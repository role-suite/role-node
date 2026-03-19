import { appResponse } from "../../shared/app-response.js";

import { workspacesRepo, type WorkspaceRole } from "./workspaces.repo.js";
import type {
  AddWorkspaceMemberInput,
  CreateWorkspaceInput,
  UpdateWorkspaceMemberRoleInput,
} from "./workspaces.schema.js";

type WorkspaceSummary = {
  id: number;
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

const requireWorkspaceMembership = async (
  userId: number,
  workspaceId: number,
) => {
  const membership = await workspacesRepo.findMembershipByUserAndWorkspace(
    userId,
    workspaceId,
  );

  if (!membership) {
    throw appResponse.withStatus(403, "Workspace access denied");
  }

  return membership;
};

const requireWorkspaceOwner = async (userId: number, workspaceId: number) => {
  const membership = await requireWorkspaceMembership(userId, workspaceId);

  if (membership.role !== "owner") {
    throw appResponse.withStatus(
      403,
      "Only workspace owners can manage members",
    );
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
      throw appResponse.withStatus(404, "Workspace not found");
    }

    return {
      id: workspace.id,
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

    return {
      id: workspace.id,
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

    const workspace = await workspacesRepo.findWorkspaceById(
      payload.workspaceId,
    );

    if (!workspace) {
      throw appResponse.withStatus(404, "Workspace not found");
    }

    if (workspace.type === "personal") {
      throw appResponse.withStatus(
        400,
        "Personal workspaces do not support additional members",
      );
    }

    const invitedUser = await workspacesRepo.findUserByEmail(payload.email);

    if (!invitedUser) {
      throw appResponse.withStatus(404, "User not found");
    }

    const existingMembership =
      await workspacesRepo.findMembershipByUserAndWorkspace(
        invitedUser.id,
        payload.workspaceId,
      );

    if (existingMembership) {
      throw appResponse.withStatus(409, "User is already a workspace member");
    }

    const membership = await workspacesRepo.createMembership({
      userId: invitedUser.id,
      workspaceId: payload.workspaceId,
      role: payload.role,
    });

    return {
      userId: invitedUser.id,
      name: invitedUser.name,
      email: invitedUser.email,
      role: membership.role,
    };
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
      throw appResponse.withStatus(404, "Workspace member not found");
    }

    if (targetMembership.role === "owner") {
      throw appResponse.withStatus(400, "Owner role cannot be changed");
    }

    await workspacesRepo.updateMembershipRole(
      payload.memberUserId,
      payload.workspaceId,
      payload.role,
    );

    const user = await workspacesRepo.findUserById(payload.memberUserId);

    if (!user) {
      throw appResponse.withStatus(404, "User not found");
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
      throw appResponse.withStatus(
        400,
        "Use leave endpoint to remove yourself",
      );
    }

    const targetMembership =
      await workspacesRepo.findMembershipByUserAndWorkspace(
        memberUserId,
        workspaceId,
      );

    if (!targetMembership) {
      throw appResponse.withStatus(404, "Workspace member not found");
    }

    if (targetMembership.role === "owner") {
      const owners = await workspacesRepo.countMembershipsByRole(
        workspaceId,
        "owner",
      );

      if (owners <= 1) {
        throw appResponse.withStatus(
          400,
          "Cannot remove the last workspace owner",
        );
      }
    }

    await workspacesRepo.deleteMembershipByUserAndWorkspace(
      memberUserId,
      workspaceId,
    );
  },

  async leaveForUser(userId: number, workspaceId: number): Promise<void> {
    const membership = await requireWorkspaceMembership(userId, workspaceId);

    if (membership.role === "owner") {
      const owners = await workspacesRepo.countMembershipsByRole(
        workspaceId,
        "owner",
      );

      if (owners <= 1) {
        throw appResponse.withStatus(
          400,
          "Cannot leave as the last workspace owner",
        );
      }
    }

    await workspacesRepo.deleteMembershipByUserAndWorkspace(
      userId,
      workspaceId,
    );
  },
};
