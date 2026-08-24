import { randomBytes } from "node:crypto";

import {
  authRepo,
  withAuthTransaction,
  type MembershipRole,
} from "../auth/repo.js";
import { hashToken } from "../../shared/auth/password.js";
import { createAppError } from "../../shared/errors/app-error.js";
import { isUniqueViolation } from "../../shared/errors/db-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";
import type { z } from "zod";

import { workspaceUpdatesQuerySchema } from "./schema.js";
import type {
  AddWorkspaceMemberInput,
  AcceptWorkspaceInvitationInput,
  ConvertWorkspaceToTeamInput,
  CreateWorkspaceInvitationInput,
  CreateWorkspaceInput,
  UpdateWorkspaceMemberRoleInput,
} from "./schema.js";
import { workspaceEventsService } from "./events.service.js";

type WorkspaceUpdatesQuery = z.infer<typeof workspaceUpdatesQuerySchema>;

type WorkspaceSummary = {
  id: number;
  _id: number;
  name: string;
  slug: string;
  type: "personal" | "team";
  role: MembershipRole;
};

type WorkspaceMember = {
  userId: number;
  name: string;
  email: string;
  role: MembershipRole;
};

type WorkspaceInvitation = {
  id: number;
  workspaceId: number;
  email: string;
  role: MembershipRole;
  token: string;
  expiresAt: Date;
};

const INVITATION_TTL_DAYS = 7;

// Membership uniqueness is pre-checked below for a friendly error on the common path, but that
// check-then-write is racy under concurrent requests (e.g. a double-submitted "join"). This
// constraint backs it up so a race still resolves to the same domain error instead of a raw 500.
const MEMBERSHIP_UNIQUE_CONSTRAINT =
  "workspace_memberships_user_id_workspace_id_key";

const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

const requireWorkspaceMembership = async (
  userId: number,
  workspaceId: number,
) => {
  const membership = await authRepo.findMembershipByUserAndWorkspace(
    userId,
    workspaceId,
  );

  if (!membership) {
    throw createAppError(ERROR_CODES.workspaces.ACCESS_DENIED);
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
  return authRepo.listWorkspaceMembersWithUser(workspaceId);
};

const listWorkspaceSummaries = async (
  userId: number,
): Promise<WorkspaceSummary[]> => {
  const memberships = await authRepo.listMembershipsWithWorkspaceByUser(userId);

  return memberships.map(({ role, workspace }) => ({
    id: workspace.id,
    _id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    type: workspace.type,
    role,
  }));
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

    const workspace = await authRepo.findWorkspaceById(workspaceId);

    if (!workspace) {
      throw createAppError(ERROR_CODES.workspaces.NOT_FOUND);
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
    // Same transaction guarantee as auth registration: a failure creating the owner membership
    // must not leave an orphaned, ownerless workspace behind.
    const { workspace, membership } = await withAuthTransaction(async (tx) => {
      const workspace = await authRepo.createWorkspace(
        {
          name: payload.name,
          type: "team",
          createdByUserId: userId,
        },
        tx,
      );

      const membership = await authRepo.createMembership(
        {
          userId,
          workspaceId: workspace.id,
          role: "owner",
        },
        tx,
      );

      return { workspace, membership };
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

    return {
      id: workspace.id,
      _id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      type: workspace.type,
      role: membership.role,
    };
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

    const workspace = await authRepo.findWorkspaceById(payload.workspaceId);

    if (!workspace) {
      throw createAppError(ERROR_CODES.workspaces.NOT_FOUND);
    }

    if (workspace.type === "personal") {
      throw createAppError(ERROR_CODES.workspaces.PERSONAL_MEMBERS_UNSUPPORTED);
    }

    const invitedUser = await authRepo.findUserByEmail(payload.email);

    if (!invitedUser) {
      throw createAppError(ERROR_CODES.common.USER_NOT_FOUND);
    }

    const existingMembership = await authRepo.findMembershipByUserAndWorkspace(
      invitedUser.id,
      payload.workspaceId,
    );

    if (existingMembership) {
      throw createAppError(ERROR_CODES.workspaces.MEMBERSHIP_ALREADY_EXISTS);
    }

    let membership;

    try {
      membership = await authRepo.createMembership({
        userId: invitedUser.id,
        workspaceId: payload.workspaceId,
        role: payload.role,
      });
    } catch (error) {
      if (isUniqueViolation(error, MEMBERSHIP_UNIQUE_CONSTRAINT)) {
        throw createAppError(ERROR_CODES.workspaces.MEMBERSHIP_ALREADY_EXISTS);
      }

      throw error;
    }

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

    const workspace = await authRepo.findWorkspaceById(payload.workspaceId);

    if (!workspace) {
      throw createAppError(ERROR_CODES.workspaces.NOT_FOUND);
    }

    if (workspace.type === "personal") {
      throw createAppError(
        ERROR_CODES.workspaces.PERSONAL_INVITATIONS_UNSUPPORTED,
      );
    }

    const email = normalizeEmail(payload.email);
    const existingInvitation =
      await authRepo.findPendingWorkspaceInvitationByEmail(
        payload.workspaceId,
        email,
      );

    if (existingInvitation && existingInvitation.expiresAt > new Date()) {
      throw createAppError(ERROR_CODES.workspaces.INVITATION_ALREADY_PENDING);
    }

    const existingUser = await authRepo.findUserByEmail(email);

    if (existingUser) {
      const existingMembership =
        await authRepo.findMembershipByUserAndWorkspace(
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

    const invitation = await authRepo.createWorkspaceInvitation({
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
    const tokenHash = hashToken(payload.token);
    const invitation =
      await authRepo.findWorkspaceInvitationByTokenHash(tokenHash);

    if (!invitation) {
      throw createAppError(ERROR_CODES.workspaces.INVITATION_NOT_FOUND);
    }

    if (invitation.acceptedAt) {
      throw createAppError(ERROR_CODES.workspaces.INVITATION_ALREADY_USED);
    }

    if (invitation.expiresAt <= new Date()) {
      throw createAppError(ERROR_CODES.workspaces.INVITATION_EXPIRED);
    }

    const user = await authRepo.findUserById(userId);

    if (!user) {
      throw createAppError(ERROR_CODES.common.USER_NOT_FOUND);
    }

    if (normalizeEmail(user.email) !== invitation.email) {
      throw createAppError(ERROR_CODES.workspaces.INVITATION_EMAIL_MISMATCH);
    }

    const workspace = await authRepo.findWorkspaceById(invitation.workspaceId);

    if (!workspace) {
      throw createAppError(ERROR_CODES.workspaces.NOT_FOUND);
    }

    if (workspace.type === "personal") {
      throw createAppError(ERROR_CODES.workspaces.DOES_NOT_ACCEPT_MEMBERS);
    }

    const existingMembership = await authRepo.findMembershipByUserAndWorkspace(
      userId,
      invitation.workspaceId,
    );

    if (existingMembership) {
      throw createAppError(ERROR_CODES.workspaces.MEMBERSHIP_ALREADY_EXISTS);
    }

    // A double-submitted join (or a race with an owner's concurrent addMember for the same
    // email) must not leave a membership created without the invitation being marked accepted -
    // one transaction, with the unique-violation guard as the concurrency backstop.
    const membership = await withAuthTransaction(async (tx) => {
      let created;

      try {
        created = await authRepo.createMembership(
          {
            userId,
            workspaceId: invitation.workspaceId,
            role: invitation.role,
          },
          tx,
        );
      } catch (error) {
        if (isUniqueViolation(error, MEMBERSHIP_UNIQUE_CONSTRAINT)) {
          throw createAppError(
            ERROR_CODES.workspaces.MEMBERSHIP_ALREADY_EXISTS,
          );
        }

        throw error;
      }

      await authRepo.markWorkspaceInvitationAccepted(invitation.id, tx);

      return created;
    });

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

    return {
      id: workspace.id,
      _id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      type: workspace.type,
      role: membership.role,
    };
  },

  async updateMemberRoleForUser(
    userId: number,
    payload: UpdateWorkspaceMemberRoleInput,
  ): Promise<WorkspaceMember> {
    await requireWorkspaceOwner(userId, payload.workspaceId);

    const targetMembership = await authRepo.findMembershipByUserAndWorkspace(
      payload.memberUserId,
      payload.workspaceId,
    );

    if (!targetMembership) {
      throw createAppError(ERROR_CODES.workspaces.MEMBER_NOT_FOUND);
    }

    if (targetMembership.role === "owner") {
      throw createAppError(ERROR_CODES.workspaces.OWNER_ROLE_IMMUTABLE);
    }

    await authRepo.updateMembershipRole(
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

    const user = await authRepo.findUserById(payload.memberUserId);

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

    const targetMembership = await authRepo.findMembershipByUserAndWorkspace(
      memberUserId,
      workspaceId,
    );

    if (!targetMembership) {
      throw createAppError(ERROR_CODES.workspaces.MEMBER_NOT_FOUND);
    }

    if (targetMembership.role === "owner") {
      const owners = await authRepo.countMembershipsByRole(
        workspaceId,
        "owner",
      );

      if (owners <= 1) {
        throw createAppError(
          ERROR_CODES.workspaces.LAST_OWNER_REMOVE_FORBIDDEN,
        );
      }
    }

    await authRepo.deleteMembershipByUserAndWorkspace(
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
    const membership = await requireWorkspaceMembership(userId, workspaceId);

    if (membership.role === "owner") {
      const owners = await authRepo.countMembershipsByRole(
        workspaceId,
        "owner",
      );

      if (owners <= 1) {
        throw createAppError(ERROR_CODES.workspaces.LAST_OWNER_LEAVE_FORBIDDEN);
      }
    }

    await authRepo.deleteMembershipByUserAndWorkspace(userId, workspaceId);

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
  },

  async convertToTeamForUser(
    userId: number,
    payload: ConvertWorkspaceToTeamInput,
  ): Promise<WorkspaceSummary> {
    await requireWorkspaceOwner(userId, payload.workspaceId);

    const workspace = await authRepo.findWorkspaceById(payload.workspaceId);

    if (!workspace) {
      throw createAppError(ERROR_CODES.workspaces.NOT_FOUND);
    }

    if (workspace.type === "team") {
      throw createAppError(ERROR_CODES.workspaces.ALREADY_TEAM);
    }

    const name = payload.name ?? workspace.name;

    await authRepo.updateWorkspaceTypeAndName({
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
