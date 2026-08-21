import { createAppError } from "../../shared/errors/app-error.js";
import { isUniqueViolation } from "../../shared/errors/db-error.js";
import {
  ERROR_CODES,
  type ErrorCode,
} from "../../shared/errors/error-codes.js";
import { authRepo } from "../auth/repo.js";
import { workspaceEventsService } from "../workspaces/events.service.js";
import {
  environmentsRepo,
  type Environment,
  type EnvironmentVariable,
} from "./repo.js";
import type {
  CreateEnvironmentInput,
  CreateEnvironmentVariableInput,
  UpdateEnvironmentInput,
  UpdateEnvironmentVariableInput,
} from "./schema.js";

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
    throw createAppError(ERROR_CODES.workspaces.ACCESS_DENIED);
  }

  return { role: membership.role };
};

const requireWorkspaceWriterRole = async (
  userId: number,
  workspaceId: number,
): Promise<void> => {
  const membership = await requireWorkspaceMembership(userId, workspaceId);

  if (membership.role === "member") {
    throw createAppError(ERROR_CODES.environments.MODIFY_FORBIDDEN);
  }
};

const requireEnvironmentInWorkspace = async (
  workspaceId: number,
  environmentId: number,
): Promise<Environment> => {
  const environment = await environmentsRepo.findEnvironmentById(environmentId);

  if (!environment || environment.workspaceId !== workspaceId) {
    throw createAppError(ERROR_CODES.environments.ENVIRONMENT_NOT_FOUND);
  }

  return environment;
};

const requireVariableInEnvironment = async (
  environmentId: number,
  variableId: number,
): Promise<EnvironmentVariable> => {
  const variable = await environmentsRepo.findVariableById(variableId);

  if (!variable || variable.environmentId !== environmentId) {
    throw createAppError(ERROR_CODES.environments.VARIABLE_NOT_FOUND);
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
    throw createAppError(ERROR_CODES.environments.NAME_ALREADY_EXISTS);
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
    throw createAppError(ERROR_CODES.environments.VARIABLE_KEY_ALREADY_EXISTS);
  }
};

// Name/key availability is pre-checked above for a friendly error on the common path, but that
// check-then-write is inherently racy under concurrent requests. These constraints back it up:
// the DB's UNIQUE indexes are the actual source of truth, and a violation here still resolves to
// the same domain error instead of leaking as a raw 500. Exported so other modules that write
// environments/variables (e.g. import-export) can translate the same constraint violations.
export const ENVIRONMENT_NAME_CONSTRAINT = "environments_workspace_id_name_key";
export const VARIABLE_KEY_CONSTRAINT =
  "environment_variables_environment_id_key_name_key";

const runUniqueGuarded = async <T>(
  fn: () => Promise<T>,
  constraint: string,
  errorCode: ErrorCode,
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (isUniqueViolation(error, constraint)) {
      throw createAppError(errorCode);
    }

    throw error;
  }
};

export const environmentsService = {
  async listForWorkspace(
    userId: number,
    workspaceId: number,
  ): Promise<EnvironmentResponse[]> {
    await requireWorkspaceMembership(userId, workspaceId);
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
    await ensureEnvironmentNameAvailable(workspaceId, payload.name);

    const created = await runUniqueGuarded(
      () =>
        environmentsRepo.createEnvironment({
          workspaceId,
          name: payload.name,
          createdByUserId: userId,
        }),
      ENVIRONMENT_NAME_CONSTRAINT,
      ERROR_CODES.environments.NAME_ALREADY_EXISTS,
    );

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

    const updated = await runUniqueGuarded(
      () =>
        environmentsRepo.updateEnvironment({
          id: existing.id,
          name: nextName,
        }),
      ENVIRONMENT_NAME_CONSTRAINT,
      ERROR_CODES.environments.NAME_ALREADY_EXISTS,
    );

    if (!updated) {
      throw createAppError(ERROR_CODES.environments.ENVIRONMENT_NOT_FOUND);
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

    const created = await runUniqueGuarded(
      () =>
        environmentsRepo.createVariable({
          environmentId,
          key: payload.key,
          value: payload.value,
          enabled: payload.enabled ?? true,
          isSecret: payload.isSecret ?? false,
          position: payload.position ?? 0,
          createdByUserId: userId,
        }),
      VARIABLE_KEY_CONSTRAINT,
      ERROR_CODES.environments.VARIABLE_KEY_ALREADY_EXISTS,
    );

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

    const updated = await runUniqueGuarded(
      () =>
        environmentsRepo.updateVariable({
          id: existing.id,
          key: nextKey,
          value: payload.value ?? existing.value,
          enabled: payload.enabled ?? existing.enabled,
          isSecret: payload.isSecret ?? existing.isSecret,
          position: payload.position ?? existing.position,
        }),
      VARIABLE_KEY_CONSTRAINT,
      ERROR_CODES.environments.VARIABLE_KEY_ALREADY_EXISTS,
    );

    if (!updated) {
      throw createAppError(ERROR_CODES.environments.VARIABLE_NOT_FOUND);
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
