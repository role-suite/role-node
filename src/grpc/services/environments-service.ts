import type {
  ServiceDefinition,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";

import {
  createEnvironmentSchema,
  createEnvironmentVariableSchema,
  updateEnvironmentSchema,
  updateEnvironmentVariableSchema,
  workspaceEnvironmentByIdParamsSchema,
  workspaceEnvironmentParamsSchema,
  workspaceEnvironmentVariableByIdParamsSchema,
} from "../../modules/environments/environments.schema.js";
import { environmentsService } from "../../modules/environments/environments.service.js";
import { withUnaryContext } from "../interceptors/unary-context.js";
import {
  toGrpcEnvironmentItem,
  toGrpcEnvironmentVariableItem,
} from "../mappers/environments.js";

type EnvironmentsServiceDefinition = {
  service: ServiceDefinition<UntypedServiceImplementation>;
};

type ServiceRoot = {
  role: {
    v1: {
      EnvironmentsService: EnvironmentsServiceDefinition;
    };
  };
};

export const addEnvironmentsGrpcService = (root: ServiceRoot) => {
  return {
    service: root.role.v1.EnvironmentsService.service,
    implementation: {
      List: withUnaryContext<{ workspace_id: number }, { items: unknown[] }>(
        "EnvironmentsService.List",
        {
          requireAuth: true,
          handler: async (call, context) => {
            const { workspaceId } = workspaceEnvironmentParamsSchema.parse({
              workspaceId: call.request.workspace_id,
            });
            const result = await environmentsService.listForWorkspace(
              context.auth!.userId,
              workspaceId,
            );
            return { items: result.map(toGrpcEnvironmentItem) };
          },
        },
      ),
      GetById: withUnaryContext<
        { workspace_id: number; environment_id: number },
        { item: unknown }
      >("EnvironmentsService.GetById", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, environmentId } =
            workspaceEnvironmentByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              environmentId: call.request.environment_id,
            });
          const result = await environmentsService.getByIdForWorkspace(
            context.auth!.userId,
            workspaceId,
            environmentId,
          );
          return { item: toGrpcEnvironmentItem(result) };
        },
      }),
      Create: withUnaryContext<
        { workspace_id: number; name: string },
        { item: unknown }
      >("EnvironmentsService.Create", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId } = workspaceEnvironmentParamsSchema.parse({
            workspaceId: call.request.workspace_id,
          });
          const payload = createEnvironmentSchema.parse({
            name: call.request.name,
          });
          const result = await environmentsService.createForWorkspace(
            context.auth!.userId,
            workspaceId,
            payload,
          );
          return { item: toGrpcEnvironmentItem(result) };
        },
      }),
      Update: withUnaryContext<
        { workspace_id: number; environment_id: number; name?: string },
        { item: unknown }
      >("EnvironmentsService.Update", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, environmentId } =
            workspaceEnvironmentByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              environmentId: call.request.environment_id,
            });
          const payload = updateEnvironmentSchema.parse({
            ...(call.request.name !== undefined
              ? { name: call.request.name }
              : {}),
          });
          const result = await environmentsService.updateForWorkspace(
            context.auth!.userId,
            workspaceId,
            environmentId,
            payload,
          );
          return { item: toGrpcEnvironmentItem(result) };
        },
      }),
      Delete: withUnaryContext<
        { workspace_id: number; environment_id: number },
        { status: string }
      >("EnvironmentsService.Delete", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, environmentId } =
            workspaceEnvironmentByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              environmentId: call.request.environment_id,
            });
          await environmentsService.deleteForWorkspace(
            context.auth!.userId,
            workspaceId,
            environmentId,
          );
          return { status: "deleted" };
        },
      }),
      ListVariables: withUnaryContext<
        { workspace_id: number; environment_id: number },
        { items: unknown[] }
      >("EnvironmentsService.ListVariables", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, environmentId } =
            workspaceEnvironmentByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              environmentId: call.request.environment_id,
            });
          const result = await environmentsService.listVariablesForEnvironment(
            context.auth!.userId,
            workspaceId,
            environmentId,
          );
          return { items: result.map(toGrpcEnvironmentVariableItem) };
        },
      }),
      GetVariableById: withUnaryContext<
        { workspace_id: number; environment_id: number; variable_id: number },
        { item: unknown }
      >("EnvironmentsService.GetVariableById", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, environmentId, variableId } =
            workspaceEnvironmentVariableByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              environmentId: call.request.environment_id,
              variableId: call.request.variable_id,
            });
          const result =
            await environmentsService.getVariableByIdForEnvironment(
              context.auth!.userId,
              workspaceId,
              environmentId,
              variableId,
            );
          return { item: toGrpcEnvironmentVariableItem(result) };
        },
      }),
      CreateVariable: withUnaryContext<
        {
          workspace_id: number;
          environment_id: number;
          key: string;
          value: string;
          enabled: boolean;
          is_secret: boolean;
          position: number;
        },
        { item: unknown }
      >("EnvironmentsService.CreateVariable", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, environmentId } =
            workspaceEnvironmentByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              environmentId: call.request.environment_id,
            });
          const payload = createEnvironmentVariableSchema.parse({
            key: call.request.key,
            value: call.request.value,
            enabled: call.request.enabled,
            isSecret: call.request.is_secret,
            position: call.request.position,
          });
          const result = await environmentsService.createVariableForEnvironment(
            context.auth!.userId,
            workspaceId,
            environmentId,
            payload,
          );
          return { item: toGrpcEnvironmentVariableItem(result) };
        },
      }),
      UpdateVariable: withUnaryContext<
        {
          workspace_id: number;
          environment_id: number;
          variable_id: number;
          key?: string;
          value?: string;
          enabled?: boolean;
          is_secret?: boolean;
          position?: number;
        },
        { item: unknown }
      >("EnvironmentsService.UpdateVariable", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, environmentId, variableId } =
            workspaceEnvironmentVariableByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              environmentId: call.request.environment_id,
              variableId: call.request.variable_id,
            });
          const payload = updateEnvironmentVariableSchema.parse({
            ...(call.request.key !== undefined
              ? { key: call.request.key }
              : {}),
            ...(call.request.value !== undefined
              ? { value: call.request.value }
              : {}),
            ...(call.request.enabled !== undefined
              ? { enabled: call.request.enabled }
              : {}),
            ...(call.request.is_secret !== undefined
              ? { isSecret: call.request.is_secret }
              : {}),
            ...(call.request.position !== undefined
              ? { position: call.request.position }
              : {}),
          });
          const result = await environmentsService.updateVariableForEnvironment(
            context.auth!.userId,
            workspaceId,
            environmentId,
            variableId,
            payload,
          );
          return { item: toGrpcEnvironmentVariableItem(result) };
        },
      }),
      DeleteVariable: withUnaryContext<
        { workspace_id: number; environment_id: number; variable_id: number },
        { status: string }
      >("EnvironmentsService.DeleteVariable", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, environmentId, variableId } =
            workspaceEnvironmentVariableByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              environmentId: call.request.environment_id,
              variableId: call.request.variable_id,
            });
          await environmentsService.deleteVariableForEnvironment(
            context.auth!.userId,
            workspaceId,
            environmentId,
            variableId,
          );
          return { status: "deleted" };
        },
      }),
    } as UntypedServiceImplementation,
  };
};
