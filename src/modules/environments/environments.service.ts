import { appResponse } from "../../shared/app-response.js";
import { authRepo } from "../auth/auth.repo.js";
import { workspaceEventsService } from "../workspaces/workspace-events.service.js";
import {
  environmentsRepo,
  type Environment,
  type EnvironmentVariable,
} from "./environments.repo.js";
import type {
  CreateEnvironmentInput,
  CreateEnvironmentVariableInput,
  UpdateEnvironmentInput,
  UpdateEnvironmentVariableInput,
} from "./environments.schema.js";

type WorkspaceRole = "owner" | "admin" | "member";

type EnvironmentResponse = {
  id: number;
  workspaceId: number;
  name: string;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

type EnvironmentVariableResponse = {
  id: number;
  environmentId: number;
  key: string;
  value: string;
  enabled: boolean;
  isSecret: boolean;
  position: number;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

const mapEnvironment = (environment: Environment): EnvironmentResponse => {
  return {
    id: environment.id,
    workspaceId: environment.workspaceId,
    name: environment.name,
    createdByUserId: environment.createdByUserId,
    createdAt: environment.createdAt,
    updatedAt: environment.updatedAt,
  };
};

const mapEnvironmentVariable = (
  variable: EnvironmentVariable,
): EnvironmentVariableResponse => {
  return {
    id: variable.id,
    environmentId: variable.environmentId,
    key: variable.key,
    value: variable.value,
    enabled: variable.enabled,
    isSecret: variable.isSecret,
    position: variable.position,
    createdByUserId: variable.createdByUserId,
    createdAt: variable.createdAt,
    updatedAt: variable.updatedAt,
  };
};

const requireWorkspaceMembership = async (
  userId: number,
  workspaceId: number,
): Promise<{ role: WorkspaceRole }> => {
  const membership = await authRepo.findMembershipByUserAndWorkspace(
    userId,
    workspaceId,
  );

  if (!membership) {
    throw appResponse.withStatus(403, "Workspace access denied");
  }

  return { role: membership.role };
};

const requireWorkspaceWriterRole = async (
  userId: number,
  workspaceId: number,
): Promise<void> => {
  const membership = await requireWorkspaceMembership(userId, workspaceId);

  if (membership.role === "member") {
    throw appResponse.withStatus(
      403,
      "Only workspace owners and admins can modify environments",
    );
  }
};

const requireWorkspaceExists = async (workspaceId: number): Promise<void> => {
  const workspace = await authRepo.findWorkspaceById(workspaceId);

  if (!workspace) {
    throw appResponse.withStatus(404, "Workspace not found");
  }
};

const requireEnvironmentInWorkspace = async (
  workspaceId: number,
  environmentId: number,
): Promise<Environment> => {
  const environment = await environmentsRepo.findEnvironmentById(environmentId);

  if (!environment || environment.workspaceId !== workspaceId) {
    throw appResponse.withStatus(404, "Environment not found");
  }

  return environment;
};

const requireVariableInEnvironment = async (
  environmentId: number,
  variableId: number,
): Promise<EnvironmentVariable> => {
  const variable = await environmentsRepo.findVariableById(variableId);

  if (!variable || variable.environmentId !== environmentId) {
    throw appResponse.withStatus(404, "Environment variable not found");
  }

  return variable;
};

const ensureEnvironmentNameAvailable = async (
  workspaceId: number,
  name: string,
  currentEnvironmentId?: number,
): Promise<void> => {
  const existing = await environmentsRepo.findEnvironmentByWorkspaceAndName(
    workspaceId,
    name,
  );

  if (existing && existing.id !== currentEnvironmentId) {
    throw appResponse.withStatus(409, "Environment name already exists");
  }
};

const ensureVariableKeyAvailable = async (
  environmentId: number,
  key: string,
  currentVariableId?: number,
): Promise<void> => {
  const existing = await environmentsRepo.findVariableByEnvironmentAndKey(
    environmentId,
    key,
  );

  if (existing && existing.id !== currentVariableId) {
    throw appResponse.withStatus(
      409,
      "Environment variable key already exists",
    );
  }
};

export const environmentsService = {
  async listForWorkspace(
    userId: number,
    workspaceId: number,
  ): Promise<EnvironmentResponse[]> {
    await requireWorkspaceMembership(userId, workspaceId);
    await requireWorkspaceExists(workspaceId);
    const environments =
      await environmentsRepo.listEnvironmentsByWorkspace(workspaceId);
    return environments.map(mapEnvironment);
  },

  async getByIdForWorkspace(
    userId: number,
    workspaceId: number,
    environmentId: number,
  ): Promise<EnvironmentResponse> {
    await requireWorkspaceMembership(userId, workspaceId);
    const environment = await requireEnvironmentInWorkspace(
      workspaceId,
      environmentId,
    );
    return mapEnvironment(environment);
  },

  async createForWorkspace(
    userId: number,
    workspaceId: number,
    payload: CreateEnvironmentInput,
  ): Promise<EnvironmentResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireWorkspaceExists(workspaceId);
    await ensureEnvironmentNameAvailable(workspaceId, payload.name);

    const created = await environmentsRepo.createEnvironment({
      workspaceId,
      name: payload.name,
      createdByUserId: userId,
    });

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "environment",
      action: "created",
      entityId: created.id,
      payload: {
        name: created.name,
      },
    });

    return mapEnvironment(created);
  },

  async updateForWorkspace(
    userId: number,
    workspaceId: number,
    environmentId: number,
    payload: UpdateEnvironmentInput,
  ): Promise<EnvironmentResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    const existing = await requireEnvironmentInWorkspace(
      workspaceId,
      environmentId,
    );

    const nextName = payload.name ?? existing.name;
    await ensureEnvironmentNameAvailable(workspaceId, nextName, existing.id);

    await environmentsRepo.updateEnvironment({
      id: existing.id,
      name: nextName,
    });

    const updated = await environmentsRepo.findEnvironmentById(existing.id);

    if (!updated) {
      throw appResponse.withStatus(404, "Environment not found");
    }

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "environment",
      action: "updated",
      entityId: updated.id,
      payload: {
        name: updated.name,
      },
    });

    return mapEnvironment(updated);
  },

  async deleteForWorkspace(
    userId: number,
    workspaceId: number,
    environmentId: number,
  ): Promise<void> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireEnvironmentInWorkspace(workspaceId, environmentId);
    await environmentsRepo.deleteEnvironmentById(environmentId);

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "environment",
      action: "deleted",
      entityId: environmentId,
    });
  },

  async listVariablesForEnvironment(
    userId: number,
    workspaceId: number,
    environmentId: number,
  ): Promise<EnvironmentVariableResponse[]> {
    await requireWorkspaceMembership(userId, workspaceId);
    await requireEnvironmentInWorkspace(workspaceId, environmentId);
    const variables =
      await environmentsRepo.listVariablesByEnvironment(environmentId);
    return variables.map(mapEnvironmentVariable);
  },

  async getVariableByIdForEnvironment(
    userId: number,
    workspaceId: number,
    environmentId: number,
    variableId: number,
  ): Promise<EnvironmentVariableResponse> {
    await requireWorkspaceMembership(userId, workspaceId);
    await requireEnvironmentInWorkspace(workspaceId, environmentId);
    const variable = await requireVariableInEnvironment(
      environmentId,
      variableId,
    );
    return mapEnvironmentVariable(variable);
  },

  async createVariableForEnvironment(
    userId: number,
    workspaceId: number,
    environmentId: number,
    payload: CreateEnvironmentVariableInput,
  ): Promise<EnvironmentVariableResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireEnvironmentInWorkspace(workspaceId, environmentId);
    await ensureVariableKeyAvailable(environmentId, payload.key);

    const created = await environmentsRepo.createVariable({
      environmentId,
      key: payload.key,
      value: payload.value,
      enabled: payload.enabled ?? true,
      isSecret: payload.isSecret ?? false,
      position: payload.position ?? 0,
      createdByUserId: userId,
    });

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "environment_variable",
      action: "created",
      entityId: created.id,
      payload: {
        environmentId,
        key: created.key,
      },
    });

    return mapEnvironmentVariable(created);
  },

  async updateVariableForEnvironment(
    userId: number,
    workspaceId: number,
    environmentId: number,
    variableId: number,
    payload: UpdateEnvironmentVariableInput,
  ): Promise<EnvironmentVariableResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireEnvironmentInWorkspace(workspaceId, environmentId);
    const existing = await requireVariableInEnvironment(
      environmentId,
      variableId,
    );

    const nextKey = payload.key ?? existing.key;
    await ensureVariableKeyAvailable(environmentId, nextKey, existing.id);

    await environmentsRepo.updateVariable({
      id: existing.id,
      key: nextKey,
      value: payload.value ?? existing.value,
      enabled: payload.enabled ?? existing.enabled,
      isSecret: payload.isSecret ?? existing.isSecret,
      position: payload.position ?? existing.position,
    });

    const updated = await environmentsRepo.findVariableById(existing.id);

    if (!updated) {
      throw appResponse.withStatus(404, "Environment variable not found");
    }

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "environment_variable",
      action: "updated",
      entityId: updated.id,
      payload: {
        environmentId,
        key: updated.key,
      },
    });

    return mapEnvironmentVariable(updated);
  },

  async deleteVariableForEnvironment(
    userId: number,
    workspaceId: number,
    environmentId: number,
    variableId: number,
  ): Promise<void> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireEnvironmentInWorkspace(workspaceId, environmentId);
    await requireVariableInEnvironment(environmentId, variableId);
    await environmentsRepo.deleteVariableById(variableId);

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "environment_variable",
      action: "deleted",
      entityId: variableId,
      payload: {
        environmentId,
      },
    });
  },
};
