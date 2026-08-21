import { createAppError } from "../../shared/errors/app-error.js";
import { isUniqueViolation } from "../../shared/errors/db-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";
import type { DatabaseClient } from "../../types/db.js";
import { authRepo } from "../auth/repo.js";
import { collectionsRepo } from "../collections/repo.js";
import { environmentsRepo } from "../environments/repo.js";
import {
  ENVIRONMENT_NAME_CONSTRAINT,
  VARIABLE_KEY_CONSTRAINT,
} from "../environments/service.js";
import {
  importExportRepo,
  withImportExportTransaction,
  type ImportExportJob,
} from "./repo.js";
import type {
  CreateWorkspaceExportInput,
  CreateWorkspaceImportInput,
  RoleNativeImportPayload,
} from "./schema.js";

type WorkspaceRole = "owner" | "admin" | "member";

type ImportExportJobResponse = {
  id: number;
  workspaceId: number;
  type: "export" | "import";
  status: "completed";
  format: "json";
  summary: Record<string, unknown>;
  artifact: Record<string, unknown>;
  createdByUserId: number;
  createdAt: Date;
  completedAt: Date;
};

const mapJob = (job: ImportExportJob): ImportExportJobResponse => {
  return {
    id: job.id,
    workspaceId: job.workspaceId,
    type: job.type,
    status: job.status,
    format: job.format,
    summary: job.summary,
    artifact: job.artifact,
    createdByUserId: job.createdByUserId,
    createdAt: job.createdAt,
    completedAt: job.completedAt,
  };
};

/**
 * `collectionsRepo` returns JSONB columns already parsed by the pg driver,
 * so these just narrow `unknown` to the expected shape rather than parsing
 * JSON text.
 */
const asJsonObject = (value: unknown): Record<string, unknown> | null => {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
};

const asJsonArray = (value: unknown): unknown[] => {
  return Array.isArray(value) ? value : [];
};

const parseKeyValueArray = (
  value: unknown,
): Array<{ key: string; value: string; enabled?: boolean }> => {
  return asJsonArray(value).flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) {
      return [];
    }

    const record = entry as Record<string, unknown>;

    if (typeof record.key !== "string" || typeof record.value !== "string") {
      return [];
    }

    return [
      {
        key: record.key,
        value: record.value,
        ...(typeof record.enabled === "boolean"
          ? { enabled: record.enabled }
          : {}),
      },
    ];
  });
};

const buildExportArtifact = async (
  workspaceId: number,
  payload: CreateWorkspaceExportInput,
): Promise<RoleNativeImportPayload> => {
  const includeCollections = payload.includeCollections ?? true;
  const includeEnvironments = payload.includeEnvironments ?? true;
  const artifact: RoleNativeImportPayload = {
    version: 1,
    format: "role-native",
    exportedAt: new Date().toISOString(),
  };

  if (includeCollections) {
    const collections = await collectionsRepo.listByWorkspace(workspaceId);
    artifact.collections = await Promise.all(
      collections.map(async (collection) => {
        const [folders, endpoints] = await Promise.all([
          collectionsRepo.listFoldersByCollection(collection.id),
          collectionsRepo.listEndpointsByCollection(collection.id),
        ]);

        return {
          name: collection.name,
          description: collection.description,
          folders: folders.map((folder) => ({
            sourceId: folder.id,
            parentSourceId: folder.parentFolderId,
            name: folder.name,
            position: folder.position,
          })),
          endpoints: await Promise.all(
            endpoints.map(async (endpoint) => ({
              sourceId: endpoint.id,
              folderSourceId: endpoint.folderId,
              name: endpoint.name,
              method: endpoint.method,
              url: endpoint.url,
              headers: parseKeyValueArray(endpoint.headers),
              queryParams: parseKeyValueArray(endpoint.queryParams),
              body: asJsonObject(endpoint.body),
              auth: asJsonObject(endpoint.auth),
              position: endpoint.position,
              examples: (
                await collectionsRepo.listExamplesByEndpoint(endpoint.id)
              ).map((example) => ({
                name: example.name,
                statusCode: example.statusCode,
                headers: parseKeyValueArray(example.headers),
                body: example.body,
                position: example.position,
              })),
            })),
          ),
        };
      }),
    );
  }

  if (includeEnvironments) {
    const environments =
      await environmentsRepo.listEnvironmentsByWorkspace(workspaceId);
    artifact.environments = await Promise.all(
      environments.map(async (environment) => ({
        name: environment.name,
        variables: (
          await environmentsRepo.listVariablesByEnvironment(environment.id)
        ).map((variable) => ({
          key: variable.key,
          value: variable.value,
          enabled: variable.enabled,
          isSecret: variable.isSecret,
          position: variable.position,
        })),
      })),
    );
  }

  return artifact;
};

// `folders`/`endpoints` cross-reference each other by an external `sourceId`, not the DB-assigned
// id (which doesn't exist until the row is inserted). Validating every reference against the
// declared sourceIds up front - before any row is written - means a payload with a typo'd or
// dangling reference is rejected as a clean 400 instead of silently reparenting the folder/
// endpoint to the collection root (the previous `?? null` fallback swallowed the mistake).
const validateSourceReferences = (
  collections: RoleNativeImportPayload["collections"],
): void => {
  for (const collectionPayload of collections ?? []) {
    const knownFolderSourceIds = new Set(
      (collectionPayload.folders ?? [])
        .map((folder) => folder.sourceId)
        .filter((sourceId): sourceId is number => sourceId !== undefined),
    );

    for (const folderPayload of collectionPayload.folders ?? []) {
      if (
        folderPayload.parentSourceId !== null &&
        folderPayload.parentSourceId !== undefined &&
        !knownFolderSourceIds.has(folderPayload.parentSourceId)
      ) {
        throw createAppError(
          ERROR_CODES.importExport.INVALID_SOURCE_REFERENCE,
          {
            message: `Folder "${folderPayload.name}" references unknown parentSourceId ${folderPayload.parentSourceId}`,
          },
        );
      }
    }

    for (const endpointPayload of collectionPayload.endpoints ?? []) {
      if (
        endpointPayload.folderSourceId !== null &&
        endpointPayload.folderSourceId !== undefined &&
        !knownFolderSourceIds.has(endpointPayload.folderSourceId)
      ) {
        throw createAppError(
          ERROR_CODES.importExport.INVALID_SOURCE_REFERENCE,
          {
            message: `Endpoint "${endpointPayload.name}" references unknown folderSourceId ${endpointPayload.folderSourceId}`,
          },
        );
      }
    }
  }
};

const importArtifact = async (
  workspaceId: number,
  createdByUserId: number,
  payload: RoleNativeImportPayload,
  dbClient: DatabaseClient,
): Promise<{ collections: number; environments: number }> => {
  let importedCollections = 0;
  let importedEnvironments = 0;

  for (const collectionPayload of payload.collections ?? []) {
    const collection = await collectionsRepo.create(
      {
        workspaceId,
        name: collectionPayload.name,
        description: collectionPayload.description ?? null,
        createdByUserId,
      },
      dbClient,
    );
    const folderIdBySourceId = new Map<number, number>();
    importedCollections += 1;

    for (const folderPayload of collectionPayload.folders ?? []) {
      const parentFolderId =
        folderPayload.parentSourceId !== null &&
        folderPayload.parentSourceId !== undefined
          ? (folderIdBySourceId.get(folderPayload.parentSourceId) ?? null)
          : null;
      const folder = await collectionsRepo.createFolder(
        {
          collectionId: collection.id,
          parentFolderId,
          name: folderPayload.name,
          position: folderPayload.position ?? 0,
          createdByUserId,
        },
        dbClient,
      );

      if (folderPayload.sourceId !== undefined) {
        folderIdBySourceId.set(folderPayload.sourceId, folder.id);
      }
    }

    for (const endpointPayload of collectionPayload.endpoints ?? []) {
      const folderId =
        endpointPayload.folderSourceId !== null &&
        endpointPayload.folderSourceId !== undefined
          ? (folderIdBySourceId.get(endpointPayload.folderSourceId) ?? null)
          : null;
      const endpoint = await collectionsRepo.createEndpoint(
        {
          collectionId: collection.id,
          folderId,
          name: endpointPayload.name,
          method: endpointPayload.method,
          url: endpointPayload.url,
          headers: JSON.stringify(endpointPayload.headers ?? []),
          queryParams: JSON.stringify(endpointPayload.queryParams ?? []),
          body:
            endpointPayload.body === undefined
              ? null
              : JSON.stringify(endpointPayload.body),
          auth:
            endpointPayload.auth === undefined
              ? null
              : JSON.stringify(endpointPayload.auth),
          position: endpointPayload.position ?? 0,
          createdByUserId,
        },
        dbClient,
      );

      for (const examplePayload of endpointPayload.examples ?? []) {
        await collectionsRepo.createEndpointExample(
          {
            endpointId: endpoint.id,
            name: examplePayload.name,
            statusCode: examplePayload.statusCode ?? 200,
            headers: JSON.stringify(examplePayload.headers ?? []),
            body: examplePayload.body ?? null,
            position: examplePayload.position ?? 0,
            createdByUserId,
          },
          dbClient,
        );
      }
    }
  }

  for (const environmentPayload of payload.environments ?? []) {
    let environment;

    try {
      environment = await environmentsRepo.createEnvironment(
        {
          workspaceId,
          name: environmentPayload.name,
          createdByUserId,
        },
        dbClient,
      );
    } catch (error) {
      if (isUniqueViolation(error, ENVIRONMENT_NAME_CONSTRAINT)) {
        throw createAppError(ERROR_CODES.environments.NAME_ALREADY_EXISTS, {
          message: `Environment name "${environmentPayload.name}" already exists in this workspace`,
        });
      }

      throw error;
    }

    importedEnvironments += 1;

    for (const variablePayload of environmentPayload.variables ?? []) {
      try {
        await environmentsRepo.createVariable(
          {
            environmentId: environment.id,
            key: variablePayload.key,
            value: variablePayload.value,
            enabled: variablePayload.enabled ?? true,
            isSecret: variablePayload.isSecret ?? false,
            position: variablePayload.position ?? 0,
            createdByUserId,
          },
          dbClient,
        );
      } catch (error) {
        if (isUniqueViolation(error, VARIABLE_KEY_CONSTRAINT)) {
          throw createAppError(
            ERROR_CODES.environments.VARIABLE_KEY_ALREADY_EXISTS,
            {
              message: `Variable key "${variablePayload.key}" already exists in environment "${environmentPayload.name}"`,
            },
          );
        }

        throw error;
      }
    }
  }

  return {
    collections: importedCollections,
    environments: importedEnvironments,
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
    throw createAppError(ERROR_CODES.importExport.RUN_FORBIDDEN);
  }
};

export const importExportService = {
  async listJobsForWorkspace(
    userId: number,
    workspaceId: number,
  ): Promise<ImportExportJobResponse[]> {
    await requireWorkspaceMembership(userId, workspaceId);
    return (await importExportRepo.listByWorkspace(workspaceId)).map(mapJob);
  },

  async getJobByIdForWorkspace(
    userId: number,
    workspaceId: number,
    jobId: number,
  ): Promise<ImportExportJobResponse> {
    await requireWorkspaceMembership(userId, workspaceId);
    const job = await importExportRepo.findByWorkspaceAndId(workspaceId, jobId);

    if (!job) {
      throw createAppError(ERROR_CODES.importExport.JOB_NOT_FOUND);
    }

    return mapJob(job);
  },

  async createExportJobForWorkspace(
    userId: number,
    workspaceId: number,
    payload: CreateWorkspaceExportInput,
  ): Promise<ImportExportJobResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    const artifact = await buildExportArtifact(workspaceId, payload);
    const job = await importExportRepo.createJob({
      workspaceId,
      createdByUserId: userId,
      type: "export",
      format: payload.format,
      summary: {
        includeCollections: payload.includeCollections ?? true,
        includeEnvironments: payload.includeEnvironments ?? true,
        collectionCount: artifact.collections?.length ?? 0,
        environmentCount: artifact.environments?.length ?? 0,
      },
      artifact,
    });

    return mapJob(job);
  },

  async createImportJobForWorkspace(
    userId: number,
    workspaceId: number,
    payload: CreateWorkspaceImportInput,
  ): Promise<ImportExportJobResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    validateSourceReferences(payload.payload.collections);

    const rootKeys = ["collections", "environments"].filter(
      (key) => key in payload.payload,
    );

    // Everything below runs in one transaction: a failure partway through (duplicate name, bad
    // reference slipping past validation, DB error) rolls back all writes instead of leaving
    // orphaned collections/environments behind with no job record to explain how they got there.
    const job = await withImportExportTransaction(async (tx) => {
      const imported = await importArtifact(
        workspaceId,
        userId,
        payload.payload,
        tx,
      );

      return importExportRepo.createJob(
        {
          workspaceId,
          createdByUserId: userId,
          type: "import",
          format: payload.format,
          summary: {
            rootKeys,
            rootKeyCount: rootKeys.length,
            importedCollections: imported.collections,
            importedEnvironments: imported.environments,
          },
          artifact: payload.payload,
        },
        tx,
      );
    });

    return mapJob(job);
  },
};
