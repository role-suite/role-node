import { randomBytes } from "node:crypto";

import { hashToken } from "../../shared/auth/password.js";
import { createAppError } from "../../shared/errors/app-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";
import {
  recordDomainMetric,
  withDomainSpan,
} from "../../shared/telemetry-domain.js";
import type { z } from "zod";

import { workspacesRepo, type WorkspaceRole } from "./workspaces.repo.js";
import { workspaceUpdatesQuerySchema } from "./workspaces.schema.js";
import type {
  AddWorkspaceMemberInput,
  AcceptWorkspaceInvitationInput,
  ConvertWorkspaceToTeamInput,
  CreateWorkspaceInvitationInput,
  CreateWorkspaceInput,
  UpdateWorkspaceMemberRoleInput,
} from "./workspaces.schema.js";
import { workspaceEventsService } from "./workspace-events.service.js";

type WorkspaceUpdatesQuery = z.infer<typeof workspaceUpdatesQuerySchema>;

type WorkspaceSummary = {
  id: number;
  _id: number;
  name: string;
  slug: string;
  type: "personal" | "team";
  role: WorkspaceRole;
};

type WorkspaceMember = {
  userId: number;
  name: string;
  email: string;
  role: WorkspaceRole;
};

type WorkspaceInvitation = {
  id: number;
  workspaceId: number;
  email: string;
  role: WorkspaceRole;
  token: string;
  expiresAt: Date;
};

const INVITATION_TTL_DAYS = 7;

const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

const requireWorkspaceMembership = async (
  userId: number,
  workspaceId: number,
) => {
  const membership = await workspacesRepo.findMembershipByUserAndWorkspace(
    userId,
    workspaceId,
  );

  if (!membership) {
    throw createAppError(ERROR_CODES.workspaces.WORKSPACE_ACCESS_DENIED);
  }

  return membership;
};

const requireWorkspaceOwner = async (userId: number, workspaceId: number) => {
  const membership = await requireWorkspaceMembership(userId, workspaceId);

  if (membership.role !== "owner") {
    throw createAppError(ERROR_CODES.workspaces.MEMBERS_MANAGE_FORBIDDEN);
  }

  return membership;
};

const listWorkspaceMembers = async (
  workspaceId: number,
): Promise<WorkspaceMember[]> => {
  const memberships =
    await workspacesRepo.listMembershipsByWorkspace(workspaceId);
  const hydrated = await Promise.all(
    memberships.map(async (membership) => {
      const user = await workspacesRepo.findUserById(membership.userId);

      if (!user) {
        return null;
      }

      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: membership.role,
      };
    }),
  );

  return hydrated.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );
};

const listWorkspaceSummaries = async (
  userId: number,
): Promise<WorkspaceSummary[]> => {
  const memberships = await workspacesRepo.listMembershipsByUser(userId);
  const hydrated = await Promise.all(
    memberships.map(async (membership) => {
      const workspace = await workspacesRepo.findWorkspaceById(
        membership.workspaceId,
      );

      if (!workspace) {
        return null;
      }

      return {
        id: workspace.id,
        _id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        type: workspace.type,
        role: membership.role,
      };
    }),
  );

  return hydrated.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );
};

export const workspacesService = {
  async listForUser(userId: number): Promise<WorkspaceSummary[]> {
    return listWorkspaceSummaries(userId);
  },

  async getByIdForUser(
    userId: number,
    workspaceId: number,
  ): Promise<WorkspaceSummary> {
    const membership = await requireWorkspaceMembership(userId, workspaceId);

    const workspace = await workspacesRepo.findWorkspaceById(workspaceId);

    if (!workspace) {
      throw createAppError(ERROR_CODES.workspaces.WORKSPACE_NOT_FOUND);
    }

    return {
      id: workspace.id,
      _id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      type: workspace.type,
      role: membership.role,
    };
  },

  async createForUser(
    userId: number,
    payload: CreateWorkspaceInput,
  ): Promise<WorkspaceSummary> {
    return withDomainSpan(
      "workspaces",
      "create",
      { "workspace.operation": "create" },
      async () => {
        const workspace = await workspacesRepo.createWorkspace({
          name: payload.name,
          type: "team",
          createdByUserId: userId,
        });

        const membership = await workspacesRepo.createMembership({
          userId,
          workspaceId: workspace.id,
          role: "owner",
        });

        await workspaceEventsService.publish({
          workspaceId: workspace.id,
          actorUserId: userId,
          entity: "workspace",
          action: "created",
          entityId: workspace.id,
          payload: {
            type: workspace.type,
            name: workspace.name,
          },
        });

        recordDomainMetric.workspace("create", "success");
        return {
          id: workspace.id,
          _id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          type: workspace.type,
          role: membership.role,
        };
      },
    );
  },

  async listMembersForUser(
    userId: number,
    workspaceId: number,
  ): Promise<WorkspaceMember[]> {
    await requireWorkspaceMembership(userId, workspaceId);
    return listWorkspaceMembers(workspaceId);
  },

  async addMemberForUser(
    userId: number,
    payload: AddWorkspaceMemberInput,
  ): Promise<WorkspaceMember> {
    await requireWorkspaceOwner(userId, payload.workspaceId);

    const workspace = await workspacesRepo.findWorkspaceById(
      payload.workspaceId,
    );

    if (!workspace) {
      throw createAppError(ERROR_CODES.workspaces.WORKSPACE_NOT_FOUND);
    }

    if (workspace.type === "personal") {
      throw createAppError(ERROR_CODES.workspaces.PERSONAL_MEMBERS_UNSUPPORTED);
    }

    const invitedUser = await workspacesRepo.findUserByEmail(payload.email);

    if (!invitedUser) {
      throw createAppError(ERROR_CODES.common.USER_NOT_FOUND);
    }

    const existingMembership =
      await workspacesRepo.findMembershipByUserAndWorkspace(
        invitedUser.id,
        payload.workspaceId,
      );

    if (existingMembership) {
      throw createAppError(ERROR_CODES.workspaces.MEMBERSHIP_ALREADY_EXISTS);
    }

    const membership = await workspacesRepo.createMembership({
      userId: invitedUser.id,
      workspaceId: payload.workspaceId,
      role: payload.role,
    });

    await workspaceEventsService.publish({
      workspaceId: payload.workspaceId,
      actorUserId: userId,
      entity: "workspace_member",
      action: "added",
      entityId: invitedUser.id,
      payload: {
        userId: invitedUser.id,
        role: membership.role,
      },
    });

    return {
      userId: invitedUser.id,
      name: invitedUser.name,
      email: invitedUser.email,
      role: membership.role,
    };
  },

  async createInvitationForUser(
    userId: number,
    payload: CreateWorkspaceInvitationInput,
  ): Promise<WorkspaceInvitation> {
    await requireWorkspaceOwner(userId, payload.workspaceId);

    const workspace = await workspacesRepo.findWorkspaceById(
      payload.workspaceId,
    );

    if (!workspace) {
      throw createAppError(ERROR_CODES.workspaces.WORKSPACE_NOT_FOUND);
    }

    if (workspace.type === "personal") {
      throw createAppError(
        ERROR_CODES.workspaces.PERSONAL_INVITATIONS_UNSUPPORTED,
      );
    }

    const email = normalizeEmail(payload.email);
    const existingInvitation =
      await workspacesRepo.findPendingWorkspaceInvitationByEmail(
        payload.workspaceId,
        email,
      );

    if (existingInvitation && existingInvitation.expiresAt > new Date()) {
      throw createAppError(ERROR_CODES.workspaces.INVITATION_ALREADY_PENDING);
    }

    const existingUser = await workspacesRepo.findUserByEmail(email);

    if (existingUser) {
      const existingMembership =
        await workspacesRepo.findMembershipByUserAndWorkspace(
          existingUser.id,
          payload.workspaceId,
        );

      if (existingMembership) {
        throw createAppError(ERROR_CODES.workspaces.MEMBERSHIP_ALREADY_EXISTS);
      }
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(
      Date.now() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000,
    );

    const invitation = await workspacesRepo.createWorkspaceInvitation({
      workspaceId: payload.workspaceId,
      invitedByUserId: userId,
      email,
      role: payload.role,
      tokenHash,
      expiresAt,
    });

    await workspaceEventsService.publish({
      workspaceId: payload.workspaceId,
      actorUserId: userId,
      entity: "workspace_invitation",
      action: "created",
      entityId: invitation.id,
      payload: {
        email,
        role: invitation.role,
      },
    });

    return {
      id: invitation.id,
      workspaceId: invitation.workspaceId,
      email: invitation.email,
      role: invitation.role,
      token,
      expiresAt: invitation.expiresAt,
    };
  },

  async joinForUser(
    userId: number,
    payload: AcceptWorkspaceInvitationInput,
  ): Promise<WorkspaceSummary> {
    return withDomainSpan(
      "workspaces",
      "join",
      { "workspace.operation": "join" },
      async () => {
        const tokenHash = hashToken(payload.token);
        const invitation =
          await workspacesRepo.findWorkspaceInvitationByTokenHash(tokenHash);

        if (!invitation) {
          recordDomainMetric.workspace("join", "error");
          throw createAppError(ERROR_CODES.workspaces.INVITATION_NOT_FOUND);
        }

        if (invitation.acceptedAt) {
          recordDomainMetric.workspace("join", "error");
          throw createAppError(ERROR_CODES.workspaces.INVITATION_ALREADY_USED);
        }

        if (invitation.expiresAt <= new Date()) {
          recordDomainMetric.workspace("join", "error");
          throw createAppError(ERROR_CODES.workspaces.INVITATION_EXPIRED);
        }

        const user = await workspacesRepo.findUserById(userId);

        if (!user) {
          recordDomainMetric.workspace("join", "error");
          throw createAppError(ERROR_CODES.common.USER_NOT_FOUND);
        }

        if (normalizeEmail(user.email) !== invitation.email) {
          recordDomainMetric.workspace("join", "error");
          throw createAppError(
            ERROR_CODES.workspaces.INVITATION_EMAIL_MISMATCH,
          );
        }

        const workspace = await workspacesRepo.findWorkspaceById(
          invitation.workspaceId,
        );

        if (!workspace) {
          recordDomainMetric.workspace("join", "error");
          throw createAppError(ERROR_CODES.workspaces.WORKSPACE_NOT_FOUND);
        }

        if (workspace.type === "personal") {
          recordDomainMetric.workspace("join", "error");
          throw createAppError(ERROR_CODES.workspaces.DOES_NOT_ACCEPT_MEMBERS);
        }

        const existingMembership =
          await workspacesRepo.findMembershipByUserAndWorkspace(
            userId,
            invitation.workspaceId,
          );

        if (existingMembership) {
          recordDomainMetric.workspace("join", "error");
          throw createAppError(
            ERROR_CODES.workspaces.MEMBERSHIP_ALREADY_EXISTS,
          );
        }

        const membership = await workspacesRepo.createMembership({
          userId,
          workspaceId: invitation.workspaceId,
          role: invitation.role,
        });

        await workspacesRepo.markWorkspaceInvitationAccepted(invitation.id);

        await workspaceEventsService.publish({
          workspaceId: invitation.workspaceId,
          actorUserId: userId,
          entity: "workspace_invitation",
          action: "accepted",
          entityId: invitation.id,
          payload: {
            email: invitation.email,
            role: invitation.role,
          },
        });

        await workspaceEventsService.publish({
          workspaceId: invitation.workspaceId,
          actorUserId: userId,
          entity: "workspace_member",
          action: "joined",
          entityId: userId,
          payload: {
            userId,
            role: membership.role,
          },
        });

        recordDomainMetric.workspace("join", "success");
        return {
          id: workspace.id,
          _id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          type: workspace.type,
          role: membership.role,
        };
      },
    );
  },

  async updateMemberRoleForUser(
    userId: number,
    payload: UpdateWorkspaceMemberRoleInput,
  ): Promise<WorkspaceMember> {
    await requireWorkspaceOwner(userId, payload.workspaceId);

    const targetMembership =
      await workspacesRepo.findMembershipByUserAndWorkspace(
        payload.memberUserId,
        payload.workspaceId,
      );

    if (!targetMembership) {
      throw createAppError(ERROR_CODES.workspaces.MEMBER_NOT_FOUND);
    }

    if (targetMembership.role === "owner") {
      throw createAppError(ERROR_CODES.workspaces.OWNER_ROLE_IMMUTABLE);
    }

    await workspacesRepo.updateMembershipRole(
      payload.memberUserId,
      payload.workspaceId,
      payload.role,
    );

    await workspaceEventsService.publish({
      workspaceId: payload.workspaceId,
      actorUserId: userId,
      entity: "workspace_member",
      action: "role_updated",
      entityId: payload.memberUserId,
      payload: {
        userId: payload.memberUserId,
        role: payload.role,
      },
    });

    const user = await workspacesRepo.findUserById(payload.memberUserId);

    if (!user) {
      throw createAppError(ERROR_CODES.common.USER_NOT_FOUND);
    }

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: payload.role,
    };
  },

  async removeMemberForUser(
    userId: number,
    workspaceId: number,
    memberUserId: number,
  ): Promise<void> {
    await requireWorkspaceOwner(userId, workspaceId);

    if (memberUserId === userId) {
      throw createAppError(ERROR_CODES.workspaces.SELF_REMOVE_USE_LEAVE);
    }

    const targetMembership =
      await workspacesRepo.findMembershipByUserAndWorkspace(
        memberUserId,
        workspaceId,
      );

    if (!targetMembership) {
      throw createAppError(ERROR_CODES.workspaces.MEMBER_NOT_FOUND);
    }

    if (targetMembership.role === "owner") {
      const owners = await workspacesRepo.countMembershipsByRole(
        workspaceId,
        "owner",
      );

      if (owners <= 1) {
        throw createAppError(
          ERROR_CODES.workspaces.LAST_OWNER_REMOVE_FORBIDDEN,
        );
      }
    }

    await workspacesRepo.deleteMembershipByUserAndWorkspace(
      memberUserId,
      workspaceId,
    );

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "workspace_member",
      action: "removed",
      entityId: memberUserId,
      payload: {
        userId: memberUserId,
      },
    });
  },

  async leaveForUser(userId: number, workspaceId: number): Promise<void> {
    return withDomainSpan(
      "workspaces",
      "leave",
      { "workspace.operation": "leave" },
      async () => {
        const membership = await requireWorkspaceMembership(
          userId,
          workspaceId,
        );

        if (membership.role === "owner") {
          const owners = await workspacesRepo.countMembershipsByRole(
            workspaceId,
            "owner",
          );

          if (owners <= 1) {
            recordDomainMetric.workspace("leave", "error");
            throw createAppError(
              ERROR_CODES.workspaces.LAST_OWNER_LEAVE_FORBIDDEN,
            );
          }
        }

        await workspacesRepo.deleteMembershipByUserAndWorkspace(
          userId,
          workspaceId,
        );

        await workspaceEventsService.publish({
          workspaceId,
          actorUserId: userId,
          entity: "workspace_member",
          action: "left",
          entityId: userId,
          payload: {
            userId,
          },
        });
        recordDomainMetric.workspace("leave", "success");
      },
    );
  },

  async convertToTeamForUser(
    userId: number,
    payload: ConvertWorkspaceToTeamInput,
  ): Promise<WorkspaceSummary> {
    await requireWorkspaceOwner(userId, payload.workspaceId);

    const workspace = await workspacesRepo.findWorkspaceById(
      payload.workspaceId,
    );

    if (!workspace) {
      throw createAppError(ERROR_CODES.workspaces.WORKSPACE_NOT_FOUND);
    }

    if (workspace.type === "team") {
      throw createAppError(ERROR_CODES.workspaces.ALREADY_TEAM);
    }

    const name = payload.name ?? workspace.name;

    await workspacesRepo.updateWorkspaceTypeAndName({
      workspaceId: workspace.id,
      name,
      type: "team",
    });

    await workspaceEventsService.publish({
      workspaceId: workspace.id,
      actorUserId: userId,
      entity: "workspace",
      action: "converted_to_team",
      entityId: workspace.id,
      payload: {
        previousType: workspace.type,
        name,
      },
    });

    return {
      id: workspace.id,
      _id: workspace.id,
      name,
      slug: workspace.slug,
      type: "team",
      role: "owner",
    };
  },

  async listUpdatesForUser(
    userId: number,
    workspaceId: number,
    query: WorkspaceUpdatesQuery,
  ) {
    await requireWorkspaceMembership(userId, workspaceId);
    return workspaceEventsService.listByCursor(
      workspaceId,
      query.since,
      query.limit,
    );
  },
};
