import { describe, expect, it, vi } from "vitest";

const {
  listJobsForWorkspaceMock,
  getJobByIdForWorkspaceMock,
  createExportJobForWorkspaceMock,
  createImportJobForWorkspaceMock,
} = vi.hoisted(() => ({
  listJobsForWorkspaceMock: vi.fn(),
  getJobByIdForWorkspaceMock: vi.fn(),
  createExportJobForWorkspaceMock: vi.fn(),
  createImportJobForWorkspaceMock: vi.fn(),
}));

vi.mock("../../src/modules/import-export/import-export.service.js", () => ({
  importExportService: {
    listJobsForWorkspace: listJobsForWorkspaceMock,
    getJobByIdForWorkspace: getJobByIdForWorkspaceMock,
    createExportJobForWorkspace: createExportJobForWorkspaceMock,
    createImportJobForWorkspace: createImportJobForWorkspaceMock,
  },
}));

import { importExportController } from "../../src/modules/import-export/import-export.controller.js";

const createResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
});

describe("import-export controller", () => {
  it("handles list/get/create endpoints", async () => {
    const response = createResponse();
    listJobsForWorkspaceMock.mockResolvedValue([]);
    getJobByIdForWorkspaceMock.mockResolvedValue({ id: 1 });
    createExportJobForWorkspaceMock.mockResolvedValue({
      id: 2,
      type: "export",
    });
    createImportJobForWorkspaceMock.mockResolvedValue({
      id: 3,
      type: "import",
    });

    await importExportController.listJobs(
      {
        auth: { userId: 9 },
        params: { workspaceId: "4" },
      } as never,
      response as never,
    );
    expect(listJobsForWorkspaceMock).toHaveBeenCalledWith(9, 4);

    await importExportController.getJobById(
      {
        auth: { userId: 9 },
        params: { workspaceId: "4", jobId: "1" },
      } as never,
      response as never,
    );
    expect(getJobByIdForWorkspaceMock).toHaveBeenCalledWith(9, 4, 1);

    await importExportController.createExport(
      {
        auth: { userId: 9 },
        params: { workspaceId: "4" },
        body: { format: "json", includeEnvironments: true },
      } as never,
      response as never,
    );
    expect(createExportJobForWorkspaceMock).toHaveBeenCalledWith(
      9,
      4,
      expect.objectContaining({ format: "json" }),
    );

    await importExportController.createImport(
      {
        auth: { userId: 9 },
        params: { workspaceId: "4" },
        body: { format: "json", payload: { collections: [] } },
      } as never,
      response as never,
    );
    expect(createImportJobForWorkspaceMock).toHaveBeenCalledWith(
      9,
      4,
      expect.objectContaining({ format: "json" }),
    );
  });

  it("throws when auth context is missing", async () => {
    const response = createResponse();

    await expect(
      importExportController.listJobs(
        { params: { workspaceId: "4" } } as never,
        response as never,
      ),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Missing authenticated context",
    });
  });
});
