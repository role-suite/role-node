import { createAppError } from "../../shared/errors/app-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";
import { authRepo } from "../auth/auth.repo.js";
import { collectionsRepo } from "../collections/collections.repo.js";
import { environmentsRepo } from "../environments/environments.repo.js";
import {
  importExportRepo,
  type ImportExportJob,
} from "./import-export.repo.js";
import type {
  CreateWorkspaceExportInput,
  CreateWorkspaceImportInput,
  RoleNativeImportPayload,
} from "./import-export.schema.js";

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

const parseJsonObject = (
  value: string | null,
): Record<string, unknown> | null => {
  if (value === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
};

const parseJsonArray = (value: string): unknown[] => {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const parseKeyValueArray = (
  value: string,
): Array<{ key: string; value: string; enabled?: boolean }> => {
  return parseJsonArray(value).flatMap((entry) => {
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
        const folders = await collectionsRepo.listFoldersByCollection(
          collection.id,
        );
        const endpoints = await collectionsRepo.listEndpointsByCollection(
          collection.id,
        );

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
              body: parseJsonObject(endpoint.body),
              auth: parseJsonObject(endpoint.auth),
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

const importArtifact = async (
  workspaceId: number,
  createdByUserId: number,
  payload: RoleNativeImportPayload,
): Promise<{ collections: number; environments: number }> => {
  let importedCollections = 0;
  let importedEnvironments = 0;

  for (const collectionPayload of payload.collections ?? []) {
    const collection = await collectionsRepo.create({
      workspaceId,
      name: collectionPayload.name,
      description: collectionPayload.description ?? null,
      createdByUserId,
    });
    const folderIdBySourceId = new Map<number, number>();
    importedCollections += 1;

    for (const folderPayload of collectionPayload.folders ?? []) {
      const parentFolderId = folderPayload.parentSourceId
        ? (folderIdBySourceId.get(folderPayload.parentSourceId) ?? null)
        : null;
      const folder = await collectionsRepo.createFolder({
        collectionId: collection.id,
        parentFolderId,
        name: folderPayload.name,
        position: folderPayload.position ?? 0,
        createdByUserId,
      });

      if (folderPayload.sourceId !== undefined) {
        folderIdBySourceId.set(folderPayload.sourceId, folder.id);
      }
    }

    for (const endpointPayload of collectionPayload.endpoints ?? []) {
      const folderId = endpointPayload.folderSourceId
        ? (folderIdBySourceId.get(endpointPayload.folderSourceId) ?? null)
        : null;
      const endpoint = await collectionsRepo.createEndpoint({
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
      });

      for (const examplePayload of endpointPayload.examples ?? []) {
        await collectionsRepo.createEndpointExample({
          endpointId: endpoint.id,
          name: examplePayload.name,
          statusCode: examplePayload.statusCode ?? 200,
          headers: JSON.stringify(examplePayload.headers ?? []),
          body: examplePayload.body ?? null,
          position: examplePayload.position ?? 0,
          createdByUserId,
        });
      }
    }
  }

  for (const environmentPayload of payload.environments ?? []) {
    const environment = await environmentsRepo.createEnvironment({
      workspaceId,
      name: environmentPayload.name,
      createdByUserId,
    });
    importedEnvironments += 1;

    for (const variablePayload of environmentPayload.variables ?? []) {
      await environmentsRepo.createVariable({
        environmentId: environment.id,
        key: variablePayload.key,
        value: variablePayload.value,
        enabled: variablePayload.enabled ?? true,
        isSecret: variablePayload.isSecret ?? false,
        position: variablePayload.position ?? 0,
        createdByUserId,
      });
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
    throw createAppError(ERROR_CODES.workspaces.WORKSPACE_ACCESS_DENIED);
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
        includeRuns: payload.includeRuns ?? false,
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
    const imported = await importArtifact(workspaceId, userId, payload.payload);
    const rootKeys = ["collections", "environments"].filter(
      (key) => key in payload.payload,
    );
    const job = await importExportRepo.createJob({
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
    });

    return mapJob(job);
  },
};
