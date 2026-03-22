import { collectionsRepo } from "../../../modules/collections/collections.repo.js";
import { environmentsRepo } from "../../../modules/environments/environments.repo.js";
import type {
  ExecuteRunInput,
  HttpRequestAuth,
  HttpRequestBody,
  HttpRequestDraft,
  RunSourcePersistence,
  VariableContext,
} from "../core/types.js";
import { RunnerError } from "../errors/runner-errors.js";

const cloneRequestDraft = (request: HttpRequestDraft): HttpRequestDraft => {
  const body = (() => {
    if (!request.body) {
      return null;
    }

    if (request.body.mode === "raw") {
      return { ...request.body };
    }

    if (request.body.mode === "urlencoded") {
      return {
        mode: "urlencoded" as const,
        entries: request.body.entries.map((entry) => ({ ...entry })),
      };
    }

    if (request.body.mode === "formdata") {
      return {
        mode: "formdata" as const,
        entries: request.body.entries.map((entry) => ({ ...entry })),
      };
    }

    if (request.body.mode === "binary") {
      return { ...request.body };
    }

    return { mode: "none" as const };
  })();

  return {
    method: request.method,
    url: request.url,
    headers: request.headers.map((item) => ({ ...item })),
    queryParams: request.queryParams.map((item) => ({ ...item })),
    body,
    auth: { ...request.auth },
  };
};

export const buildSourceRequest = async (
  input: ExecuteRunInput,
): Promise<HttpRequestDraft> => {
  if (input.source.type === "adhoc") {
    return cloneRequestDraft(input.source.request);
  }

  const endpoint = await collectionsRepo.findEndpointById(
    input.source.endpointId,
  );

  if (!endpoint || endpoint.collectionId !== input.source.collectionId) {
    throw new RunnerError(
      "RUN_SOURCE_NOT_FOUND",
      "Collection endpoint not found",
      {
        collectionId: input.source.collectionId,
        endpointId: input.source.endpointId,
      },
    );
  }

  const collection = await collectionsRepo.findById(endpoint.collectionId);

  if (!collection || collection.workspaceId !== input.workspaceId) {
    throw new RunnerError(
      "RUN_SOURCE_NOT_FOUND",
      "Collection source not found",
    );
  }

  const headers = parseJson<
    Array<{ key: string; value: string; enabled?: boolean }>
  >(endpoint.headers, []);
  const queryParams = parseJson<
    Array<{ key: string; value: string; enabled?: boolean }>
  >(endpoint.queryParams, []);
  const body = parseEndpointBody(endpoint.body);
  const auth = parseJson<HttpRequestAuth>(endpoint.auth, { type: "none" });

  return {
    method: endpoint.method,
    url: endpoint.url,
    headers,
    queryParams,
    body,
    auth,
  };
};

export const resolveRunSourcePersistence = (
  input: ExecuteRunInput,
): RunSourcePersistence => {
  if (input.source.type === "adhoc") {
    return {
      sourceType: "adhoc",
      sourceCollectionId: null,
      sourceEndpointId: null,
    };
  }

  return {
    sourceType: "collection_endpoint",
    sourceCollectionId: input.source.collectionId,
    sourceEndpointId: input.source.endpointId,
  };
};

const parseJson = <T>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const parseEndpointBody = (value: string | null): HttpRequestBody => {
  if (!value) {
    return null;
  }

  const parsed = parseJson<
    HttpRequestBody | { contentType?: string; raw?: string }
  >(value, null);

  if (!parsed) {
    return null;
  }

  if (typeof parsed === "object" && "mode" in parsed) {
    return parsed as HttpRequestBody;
  }

  return {
    mode: "raw",
    raw: parsed.raw ?? "",
    ...(parsed.contentType !== undefined
      ? { contentType: parsed.contentType }
      : {}),
  };
};

export const buildVariableContext = async (
  input: ExecuteRunInput,
): Promise<VariableContext> => {
  const values: Record<string, string> = {};
  const secretKeys = new Set<string>();

  if (input.environmentId !== undefined) {
    const environment = await environmentsRepo.findEnvironmentById(
      input.environmentId,
    );

    if (!environment || environment.workspaceId !== input.workspaceId) {
      throw new RunnerError("RUN_SOURCE_NOT_FOUND", "Environment not found", {
        environmentId: input.environmentId,
      });
    }

    const variables = await environmentsRepo.listVariablesByEnvironment(
      input.environmentId,
    );

    for (const variable of variables) {
      if (!variable.enabled) {
        continue;
      }

      values[variable.key] = variable.value;

      if (variable.isSecret) {
        secretKeys.add(variable.key);
      }
    }
  }

  for (const override of input.variableOverrides ?? []) {
    values[override.key] = override.value;
  }

  return {
    values,
    secretKeys,
  };
};
