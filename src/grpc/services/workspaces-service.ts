import type {
  ServiceDefinition,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";

import {
  acceptWorkspaceInvitationSchema,
  addWorkspaceMemberSchema,
  convertWorkspaceToTeamSchema,
  createWorkspaceInvitationSchema,
  createWorkspaceSchema,
  updateWorkspaceMemberRoleSchema,
  workspaceIdSchema,
  workspaceMemberParamsSchema,
  workspaceUpdatesQuerySchema,
} from "../../modules/workspaces/workspaces.schema.js";
import { workspacesService } from "../../modules/workspaces/workspaces.service.js";
import { withUnaryContext } from "../interceptors/unary-context.js";
import {
  toGrpcWorkspaceInvitation,
  toGrpcWorkspaceMember,
  toGrpcWorkspaceSummary,
  toGrpcWorkspaceUpdate,
} from "../mappers/workspaces.js";

type WorkspacesServiceDefinition = {
  service: ServiceDefinition<UntypedServiceImplementation>;
};

type ServiceRoot = {
  role: {
    v1: {
      WorkspacesService: WorkspacesServiceDefinition;
    };
  };
};

type WorkspaceIdRequest = { workspace_id: number };
type CreateWorkspaceRequest = { name: string };
type AddWorkspaceMemberRequest = {
  workspace_id: number;
  email: string;
  role: string;
};
type CreateWorkspaceInvitationRequest = AddWorkspaceMemberRequest;
type UpdateWorkspaceMemberRoleRequest = {
  workspace_id: number;
  member_user_id: number;
  role: string;
};
type RemoveWorkspaceMemberRequest = {
  workspace_id: number;
  member_user_id: number;
};
type JoinWorkspaceRequest = { token: string };
type LeaveWorkspaceRequest = { workspace_id: number };
type ConvertWorkspaceToTeamRequest = { workspace_id: number; name?: string };
type ListWorkspaceUpdatesRequest = {
  workspace_id: number;
  since?: number;
  limit?: number;
};

export const addWorkspacesGrpcService = (root: ServiceRoot) => {
  return {
    service: root.role.v1.WorkspacesService.service,
    implementation: {
      List: withUnaryContext<Record<string, never>, { items: unknown[] }>(
        "WorkspacesService.List",
        {
          requireAuth: true,
          handler: async (_call, context) => {
            const result = await workspacesService.listForUser(
              context.auth!.userId,
            );
            return { items: result.map(toGrpcWorkspaceSummary) };
          },
        },
      ),
      GetById: withUnaryContext<WorkspaceIdRequest, { item: unknown }>(
        "WorkspacesService.GetById",
        {
          requireAuth: true,
          handler: async (call, context) => {
            const { workspaceId } = workspaceIdSchema.parse({
              workspaceId: call.request.workspace_id,
            });
            const result = await workspacesService.getByIdForUser(
              context.auth!.userId,
              workspaceId,
            );
            return { item: toGrpcWorkspaceSummary(result) };
          },
        },
      ),
      Create: withUnaryContext<CreateWorkspaceRequest, { item: unknown }>(
        "WorkspacesService.Create",
        {
          requireAuth: true,
          handler: async (call, context) => {
            const payload = createWorkspaceSchema.parse(call.request);
            const result = await workspacesService.createForUser(
              context.auth!.userId,
              payload,
            );
            return { item: toGrpcWorkspaceSummary(result) };
          },
        },
      ),
      ListMembers: withUnaryContext<WorkspaceIdRequest, { items: unknown[] }>(
        "WorkspacesService.ListMembers",
        {
          requireAuth: true,
          handler: async (call, context) => {
            const { workspaceId } = workspaceIdSchema.parse({
              workspaceId: call.request.workspace_id,
            });
            const result = await workspacesService.listMembersForUser(
              context.auth!.userId,
              workspaceId,
            );
            return { items: result.map(toGrpcWorkspaceMember) };
          },
        },
      ),
      AddMember: withUnaryContext<AddWorkspaceMemberRequest, { item: unknown }>(
        "WorkspacesService.AddMember",
        {
          requireAuth: true,
          handler: async (call, context) => {
            const payload = addWorkspaceMemberSchema.parse({
              workspaceId: call.request.workspace_id,
              email: call.request.email,
              role: call.request.role,
            });
            const result = await workspacesService.addMemberForUser(
              context.auth!.userId,
              payload,
            );
            return { item: toGrpcWorkspaceMember(result) };
          },
        },
      ),
      CreateInvitation: withUnaryContext<
        CreateWorkspaceInvitationRequest,
        { item: unknown }
      >("WorkspacesService.CreateInvitation", {
        requireAuth: true,
        handler: async (call, context) => {
          const payload = createWorkspaceInvitationSchema.parse({
            workspaceId: call.request.workspace_id,
            email: call.request.email,
            role: call.request.role,
          });
          const result = await workspacesService.createInvitationForUser(
            context.auth!.userId,
            payload,
          );
          return { item: toGrpcWorkspaceInvitation(result) };
        },
      }),
      UpdateMemberRole: withUnaryContext<
        UpdateWorkspaceMemberRoleRequest,
        { item: unknown }
      >("WorkspacesService.UpdateMemberRole", {
        requireAuth: true,
        handler: async (call, context) => {
          const payload = updateWorkspaceMemberRoleSchema.parse({
            workspaceId: call.request.workspace_id,
            memberUserId: call.request.member_user_id,
            role: call.request.role,
          });
          const result = await workspacesService.updateMemberRoleForUser(
            context.auth!.userId,
            payload,
          );
          return { item: toGrpcWorkspaceMember(result) };
        },
      }),
      RemoveMember: withUnaryContext<
        RemoveWorkspaceMemberRequest,
        { status: string }
      >("WorkspacesService.RemoveMember", {
        requireAuth: true,
        handler: async (call, context) => {
          const payload = workspaceMemberParamsSchema.parse({
            workspaceId: call.request.workspace_id,
            memberUserId: call.request.member_user_id,
          });
          await workspacesService.removeMemberForUser(
            context.auth!.userId,
            payload.workspaceId,
            payload.memberUserId,
          );
          return { status: "deleted" };
        },
      }),
      Join: withUnaryContext<JoinWorkspaceRequest, { item: unknown }>(
        "WorkspacesService.Join",
        {
          requireAuth: true,
          handler: async (call, context) => {
            const payload = acceptWorkspaceInvitationSchema.parse(call.request);
            const result = await workspacesService.joinForUser(
              context.auth!.userId,
              payload,
            );
            return { item: toGrpcWorkspaceSummary(result) };
          },
        },
      ),
      Leave: withUnaryContext<LeaveWorkspaceRequest, { status: string }>(
        "WorkspacesService.Leave",
        {
          requireAuth: true,
          handler: async (call, context) => {
            const { workspaceId } = workspaceIdSchema.parse({
              workspaceId: call.request.workspace_id,
            });
            await workspacesService.leaveForUser(
              context.auth!.userId,
              workspaceId,
            );
            return { status: "left" };
          },
        },
      ),
      ConvertToTeam: withUnaryContext<
        ConvertWorkspaceToTeamRequest,
        { item: unknown }
      >("WorkspacesService.ConvertToTeam", {
        requireAuth: true,
        handler: async (call, context) => {
          const payload = convertWorkspaceToTeamSchema.parse({
            workspaceId: call.request.workspace_id,
            name: call.request.name || undefined,
          });
          const result = await workspacesService.convertToTeamForUser(
            context.auth!.userId,
            payload,
          );
          return { item: toGrpcWorkspaceSummary(result) };
        },
      }),
      ListUpdates: withUnaryContext<
        ListWorkspaceUpdatesRequest,
        { items: unknown[]; cursor: { next: number; has_more: boolean } }
      >("WorkspacesService.ListUpdates", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId } = workspaceIdSchema.parse({
            workspaceId: call.request.workspace_id,
          });
          const query = workspaceUpdatesQuerySchema.parse({
            since: call.request.since ?? 0,
            limit: call.request.limit ?? 50,
          });
          const result = await workspacesService.listUpdatesForUser(
            context.auth!.userId,
            workspaceId,
            query,
          );
          return {
            items: result.items.map(toGrpcWorkspaceUpdate),
            cursor: {
              next: result.cursor.next,
              has_more: result.cursor.hasMore,
            },
          };
        },
      }),
    } as UntypedServiceImplementation,
  };
};
