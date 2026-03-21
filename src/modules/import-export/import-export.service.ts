import { appResponse } from "../../shared/app-response.js";
import { authRepo } from "../auth/auth.repo.js";
import {
  importExportRepo,
  type ImportExportJob,
} from "./import-export.repo.js";
import type {
  CreateWorkspaceExportInput,
  CreateWorkspaceImportInput,
} from "./import-export.schema.js";

type WorkspaceRole = "owner" | "admin" | "member";

type ImportExportJobResponse = {
  id: number;
  workspaceId: number;
  type: "export" | "import";
  status: "completed";
  format: "json";
  summary: Record<string, unknown>;
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
    createdByUserId: job.createdByUserId,
    createdAt: job.createdAt,
    completedAt: job.completedAt,
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
      "Only workspace owners and admins can run imports and exports",
    );
  }
};

export const importExportService = {
  async listJobsForWorkspace(
    userId: number,
    workspaceId: number,
  ): Promise<ImportExportJobResponse[]> {
    await requireWorkspaceMembership(userId, workspaceId);
    return importExportRepo.listByWorkspace(workspaceId).map(mapJob);
  },

  async getJobByIdForWorkspace(
    userId: number,
    workspaceId: number,
    jobId: number,
  ): Promise<ImportExportJobResponse> {
    await requireWorkspaceMembership(userId, workspaceId);
    const job = importExportRepo.findByWorkspaceAndId(workspaceId, jobId);

    if (!job) {
      throw appResponse.withStatus(404, "Import/export job not found");
    }

    return mapJob(job);
  },

  async createExportJobForWorkspace(
    userId: number,
    workspaceId: number,
    payload: CreateWorkspaceExportInput,
  ): Promise<ImportExportJobResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    const job = importExportRepo.createJob({
      workspaceId,
      createdByUserId: userId,
      type: "export",
      format: payload.format,
      summary: {
        includeCollections: payload.includeCollections ?? true,
        includeEnvironments: payload.includeEnvironments ?? true,
        includeRuns: payload.includeRuns ?? false,
      },
    });

    return mapJob(job);
  },

  async createImportJobForWorkspace(
    userId: number,
    workspaceId: number,
    payload: CreateWorkspaceImportInput,
  ): Promise<ImportExportJobResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    const rootKeys = Object.keys(payload.payload);
    const job = importExportRepo.createJob({
      workspaceId,
      createdByUserId: userId,
      type: "import",
      format: payload.format,
      summary: {
        rootKeys,
        rootKeyCount: rootKeys.length,
      },
    });

    return mapJob(job);
  },
};
