export type ImportExportJobType = "export" | "import";
export type ImportExportJobStatus = "completed";

export type ImportExportJob = {
  id: number;
  workspaceId: number;
  type: ImportExportJobType;
  status: ImportExportJobStatus;
  format: "json";
  summary: Record<string, unknown>;
  createdByUserId: number;
  createdAt: Date;
  completedAt: Date;
};

const importExportJobsTable: ImportExportJob[] = [];
let currentJobId = 1;

export const importExportRepo = {
  listByWorkspace(workspaceId: number): ImportExportJob[] {
    return importExportJobsTable
      .filter((job) => job.workspaceId === workspaceId)
      .sort((left, right) => right.id - left.id);
  },

  findByWorkspaceAndId(
    workspaceId: number,
    jobId: number,
  ): ImportExportJob | undefined {
    return importExportJobsTable.find(
      (job) => job.workspaceId === workspaceId && job.id === jobId,
    );
  },

  createJob(payload: {
    workspaceId: number;
    type: ImportExportJobType;
    format: "json";
    summary: Record<string, unknown>;
    createdByUserId: number;
  }): ImportExportJob {
    const now = new Date();
    const job: ImportExportJob = {
      id: currentJobId++,
      workspaceId: payload.workspaceId,
      type: payload.type,
      status: "completed",
      format: payload.format,
      summary: payload.summary,
      createdByUserId: payload.createdByUserId,
      createdAt: now,
      completedAt: now,
    };

    importExportJobsTable.push(job);
    return job;
  },

  clear(): void {
    importExportJobsTable.length = 0;
    currentJobId = 1;
  },
};
