import {
  cancelRun,
  getRunById,
  runRequest,
  type ExecuteRunInput,
  type HttpRequestBody,
} from "../../internal/runner/index.js";
import { createAppError } from "../../shared/errors/app-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";
import { authRepo } from "../auth/auth.repo.js";
import type { CreateRunInput } from "./runs.schema.js";

type WorkspaceRole = "owner" | "admin" | "member";

const requireWorkspaceMembership = async (
  userId: number,
  workspaceId: number,
): Promise<{ role: WorkspaceRole }> => {
  const membership = await authRepo.findMembershipByUserAndWorkspace(
    userId,
    workspaceId,
  );

  if (!membership) {
    throw createAppError(ERROR_CODES.workspaces.WORKSPACE_ACCESS_DENIED);
  }

  return { role: membership.role };
};

const toExecuteRunInput = (
  userId: number,
  workspaceId: number,
  payload: CreateRunInput,
): ExecuteRunInput => {
  const normalizeRequestBody = (
    bodyValue: Exclude<
      CreateRunInput["source"],
      { type: "collectionEndpoint" }
    >["request"]["body"],
  ): HttpRequestBody => {
    if (!bodyValue) {
      return null;
    }

    if (bodyValue.mode === "raw") {
      return {
        mode: "raw",
        raw: bodyValue.raw,
        ...(bodyValue.contentType !== undefined
          ? { contentType: bodyValue.contentType }
          : {}),
      };
    }

    if (bodyValue.mode === "urlencoded") {
      return {
        mode: "urlencoded",
        entries: bodyValue.entries.map((entry) => {
          return {
            key: entry.key,
            value: entry.value,
            ...(entry.enabled !== undefined ? { enabled: entry.enabled } : {}),
          };
        }),
      };
    }

    if (bodyValue.mode === "formdata") {
      return {
        mode: "formdata",
        entries: bodyValue.entries.map((entry) => {
          if (entry.type === "text") {
            return {
              type: "text" as const,
              key: entry.key,
              value: entry.value,
              ...(entry.enabled !== undefined
                ? { enabled: entry.enabled }
                : {}),
            };
          }

          return {
            type: "file" as const,
            key: entry.key,
            fileName: entry.fileName,
            dataBase64: entry.dataBase64,
            ...(entry.contentType !== undefined
              ? { contentType: entry.contentType }
              : {}),
            ...(entry.enabled !== undefined ? { enabled: entry.enabled } : {}),
          };
        }),
      };
    }

    if (bodyValue.mode === "binary") {
      return {
        mode: "binary",
        fileName: bodyValue.fileName,
        dataBase64: bodyValue.dataBase64,
        ...(bodyValue.contentType !== undefined
          ? { contentType: bodyValue.contentType }
          : {}),
      };
    }

    return { mode: "none" };
  };

  const headers = (
    payload.source.type === "adhoc"
      ? (payload.source.request.headers ?? [])
      : []
  ).map((entry) => {
    return {
      key: entry.key,
      value: entry.value,
      ...(entry.enabled !== undefined ? { enabled: entry.enabled } : {}),
    };
  });

  const queryParams = (
    payload.source.type === "adhoc"
      ? (payload.source.request.queryParams ?? [])
      : []
  ).map((entry) => {
    return {
      key: entry.key,
      value: entry.value,
      ...(entry.enabled !== undefined ? { enabled: entry.enabled } : {}),
    };
  });

  const body =
    payload.source.type === "adhoc" && payload.source.request.body
      ? normalizeRequestBody(payload.source.request.body)
      : null;

  const options = payload.options
    ? {
        ...(payload.options.timeoutMs !== undefined
          ? { timeoutMs: payload.options.timeoutMs }
          : {}),
        ...(payload.options.followRedirects !== undefined
          ? { followRedirects: payload.options.followRedirects }
          : {}),
        ...(payload.options.maxResponseBytes !== undefined
          ? { maxResponseBytes: payload.options.maxResponseBytes }
          : {}),
      }
    : undefined;

  if (payload.source.type === "adhoc") {
    return {
      workspaceId,
      initiatedByUserId: userId,
      source: {
        type: "adhoc",
        request: {
          method: payload.source.request.method,
          url: payload.source.request.url,
          headers,
          queryParams,
          body,
          auth: payload.source.request.auth ?? { type: "none" },
        },
      },
      ...(payload.environmentId !== undefined
        ? { environmentId: payload.environmentId }
        : {}),
      ...(payload.variableOverrides !== undefined
        ? { variableOverrides: payload.variableOverrides }
        : {}),
      ...(options ? { options } : {}),
    };
  }

  return {
    workspaceId,
    initiatedByUserId: userId,
    source: {
      type: "collectionEndpoint",
      collectionId: payload.source.collectionId,
      endpointId: payload.source.endpointId,
    },
    ...(payload.environmentId !== undefined
      ? { environmentId: payload.environmentId }
      : {}),
    ...(payload.variableOverrides !== undefined
      ? { variableOverrides: payload.variableOverrides }
      : {}),
    ...(options ? { options } : {}),
  };
};

const throwForRunFailure = (run: {
  status: string;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  } | null;
}): void => {
  if (run.status === "failed" && run.error) {
    switch (run.error.code) {
      case ERROR_CODES.runs.RUN_VALIDATION_FAILED:
      case ERROR_CODES.runs.RUN_ACCESS_DENIED:
      case ERROR_CODES.runs.RUN_SOURCE_NOT_FOUND:
      case ERROR_CODES.runs.RUN_POLICY_BLOCKED:
      case ERROR_CODES.runs.RUN_TIMEOUT:
      case ERROR_CODES.runs.RUN_NETWORK_ERROR:
      case ERROR_CODES.runs.RUN_RESPONSE_TOO_LARGE:
      case ERROR_CODES.runs.RUN_CANCELLED:
      case ERROR_CODES.runs.RUN_INTERNAL_ERROR:
        throw createAppError(run.error.code, {
          message: run.error.message,
          details: run.error.details ?? {},
        });
      default:
        throw createAppError(ERROR_CODES.runs.RUN_INTERNAL_ERROR, {
          message: run.error.message,
          details: {
            ...(run.error.details ?? {}),
            originalCode: run.error.code,
          },
        });
    }
  }
};

export const runsService = {
  async createRunForWorkspace(
    userId: number,
    workspaceId: number,
    payload: CreateRunInput,
  ) {
    await requireWorkspaceMembership(userId, workspaceId);

    const result = await runRequest(
      toExecuteRunInput(userId, workspaceId, payload),
    );

    throwForRunFailure(result);

    return result;
  },

  async getRunByIdForWorkspace(
    userId: number,
    workspaceId: number,
    runId: number,
  ) {
    await requireWorkspaceMembership(userId, workspaceId);
    const run = await getRunById(workspaceId, runId);

    if (!run) {
      throw createAppError(ERROR_CODES.runs.RUN_NOT_FOUND);
    }

    return run;
  },

  async cancelRunForWorkspace(
    userId: number,
    workspaceId: number,
    runId: number,
  ) {
    await requireWorkspaceMembership(userId, workspaceId);
    const run = await cancelRun(workspaceId, runId);

    if (!run) {
      throw createAppError(ERROR_CODES.runs.RUN_NOT_FOUND);
    }

    return run;
  },
};
