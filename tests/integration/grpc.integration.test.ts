import path from "node:path";

import {
  credentials,
  loadPackageDefinition,
  Metadata,
  type Client,
  type ServiceError,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { startGrpcServer } from "../../src/grpc/server.js";
import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { setCollectionsRepoDbClient } from "../../src/modules/collections/collections.repo.js";
import { setEnvironmentsRepoDbClient } from "../../src/modules/environments/environments.repo.js";
import { setImportExportRepoDbClient } from "../../src/modules/import-export/import-export.repo.js";
import { setRunsRepoDbClient } from "../../src/modules/runs/runs.repo.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

type GrpcClient = Client & Record<string, unknown>;

const callUnary = <TResponse>(
  client: GrpcClient,
  method: string,
  payload: object,
  metadata?: Metadata,
): Promise<{ response: TResponse; trailer: Metadata }> => {
  return new Promise((resolve, reject) => {
    const unaryMethod = client[method] as (
      req: object,
      md: Metadata,
      cb: (error: ServiceError | null, response: TResponse) => void,
    ) => void;

    unaryMethod.call(
      client,
      payload,
      metadata ?? new Metadata(),
      (error, response) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          response,
          trailer: metadata ?? new Metadata(),
        });
      },
    );
  });
};

describe("gRPC integration", () => {
  const grpcPort = 55051;
  let grpcServerHandle: Awaited<ReturnType<typeof startGrpcServer>> = null;
  let authClient: GrpcClient | null = null;
  let workspacesClient: GrpcClient | null = null;
  let collectionsClient: GrpcClient | null = null;
  let environmentsClient: GrpcClient | null = null;
  let runsClient: GrpcClient | null = null;
  let importExportClient: GrpcClient | null = null;
  let healthClient: GrpcClient | null = null;

  beforeAll(async () => {
    setAuthRepoDbClient(testDb);
    setCollectionsRepoDbClient(testDb);
    setEnvironmentsRepoDbClient(testDb);
    setRunsRepoDbClient(testDb);
    setImportExportRepoDbClient(testDb);

    const protoPaths = [
      path.resolve(process.cwd(), "proto", "health.proto"),
      path.resolve(process.cwd(), "proto", "auth.proto"),
      path.resolve(process.cwd(), "proto", "workspaces.proto"),
      path.resolve(process.cwd(), "proto", "collections.proto"),
      path.resolve(process.cwd(), "proto", "environments.proto"),
      path.resolve(process.cwd(), "proto", "runs.proto"),
      path.resolve(process.cwd(), "proto", "import_export.proto"),
    ];
    const packageDefinition = loadSync(protoPaths, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const grpcRoot = loadPackageDefinition(packageDefinition) as unknown as {
      role: {
        v1: {
          AuthService: new (address: string, creds: unknown) => GrpcClient;
          HealthService: new (address: string, creds: unknown) => GrpcClient;
          WorkspacesService: new (
            address: string,
            creds: unknown,
          ) => GrpcClient;
          CollectionsService: new (
            address: string,
            creds: unknown,
          ) => GrpcClient;
          EnvironmentsService: new (
            address: string,
            creds: unknown,
          ) => GrpcClient;
          RunsService: new (address: string, creds: unknown) => GrpcClient;
          ImportExportService: new (
            address: string,
            creds: unknown,
          ) => GrpcClient;
        };
      };
    };

    grpcServerHandle = await startGrpcServer({ port: grpcPort });
    const target = `localhost:${grpcPort}`;

    authClient = new grpcRoot.role.v1.AuthService(
      target,
      credentials.createInsecure(),
    );
    workspacesClient = new grpcRoot.role.v1.WorkspacesService(
      target,
      credentials.createInsecure(),
    );
    collectionsClient = new grpcRoot.role.v1.CollectionsService(
      target,
      credentials.createInsecure(),
    );
    environmentsClient = new grpcRoot.role.v1.EnvironmentsService(
      target,
      credentials.createInsecure(),
    );
    runsClient = new grpcRoot.role.v1.RunsService(
      target,
      credentials.createInsecure(),
    );
    importExportClient = new grpcRoot.role.v1.ImportExportService(
      target,
      credentials.createInsecure(),
    );
    healthClient = new grpcRoot.role.v1.HealthService(
      target,
      credentials.createInsecure(),
    );
  });

  beforeEach(async () => {
    await authRepo.clear();
  });

  afterAll(async () => {
    authClient?.close();
    workspacesClient?.close();
    collectionsClient?.close();
    environmentsClient?.close();
    runsClient?.close();
    importExportClient?.close();
    healthClient?.close();
    if (grpcServerHandle) {
      await grpcServerHandle.close();
    }
    setAuthRepoDbClient(null);
    setCollectionsRepoDbClient(null);
    setEnvironmentsRepoDbClient(null);
    setRunsRepoDbClient(null);
    setImportExportRepoDbClient(null);
  });

  it("supports workspace invitation and join flow over gRPC", async () => {
    const owner = await callUnary<{
      user: { id: number | string; email: string };
      tokens: { access_token: string };
    }>(authClient!, "Register", {
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      account_type: "single",
    });

    const ownerMd = new Metadata();
    ownerMd.set(
      "authorization",
      `Bearer ${owner.response.tokens.access_token}`,
    );

    const createdWorkspace = await callUnary<{ item: { id: number | string } }>(
      workspacesClient!,
      "Create",
      { name: "Team A" },
      ownerMd,
    );

    const invite = await callUnary<{ item: { token: string } }>(
      workspacesClient!,
      "CreateInvitation",
      {
        workspace_id: Number(createdWorkspace.response.item.id),
        email: "member@example.com",
        role: "member",
      },
      ownerMd,
    );

    const member = await callUnary<{
      user: { email: string };
      tokens: { access_token: string };
    }>(authClient!, "Register", {
      name: "Member",
      email: "member@example.com",
      password: "password123",
      account_type: "single",
    });

    const memberMd = new Metadata();
    memberMd.set(
      "authorization",
      `Bearer ${member.response.tokens.access_token}`,
    );

    const join = await callUnary<{ item: { name: string } }>(
      workspacesClient!,
      "Join",
      { token: invite.response.item.token },
      memberMd,
    );

    expect(join.response.item.name).toBe("Team A");
  });

  it("rejects workspace invitation creation for non-owner member", async () => {
    const owner = await callUnary<{
      tokens: { access_token: string };
    }>(authClient!, "Register", {
      name: "Owner",
      email: "owner2@example.com",
      password: "password123",
      account_type: "single",
    });

    const ownerMd = new Metadata();
    ownerMd.set(
      "authorization",
      `Bearer ${owner.response.tokens.access_token}`,
    );

    const workspace = await callUnary<{ item: { id: number | string } }>(
      workspacesClient!,
      "Create",
      { name: "Team B" },
      ownerMd,
    );

    const invitation = await callUnary<{ item: { token: string } }>(
      workspacesClient!,
      "CreateInvitation",
      {
        workspace_id: Number(workspace.response.item.id),
        email: "member2@example.com",
        role: "member",
      },
      ownerMd,
    );

    const member = await callUnary<{
      tokens: { access_token: string };
    }>(authClient!, "Register", {
      name: "Member",
      email: "member2@example.com",
      password: "password123",
      account_type: "single",
    });

    const memberMd = new Metadata();
    memberMd.set(
      "authorization",
      `Bearer ${member.response.tokens.access_token}`,
    );

    await callUnary(
      workspacesClient!,
      "Join",
      { token: invitation.response.item.token },
      memberMd,
    );

    await expect(
      callUnary(
        workspacesClient!,
        "CreateInvitation",
        {
          workspace_id: Number(workspace.response.item.id),
          email: "another@example.com",
          role: "member",
        },
        memberMd,
      ),
    ).rejects.toMatchObject({ code: 7 });
  });

  it("serves health check", async () => {
    const { response } = await callUnary<{ status: string; service: string }>(
      healthClient!,
      "Check",
      { service: "role-node" },
    );

    expect(response.status).toBe("SERVING");
    expect(response.service).toBe("role-node");
  });

  it("supports register and me flow over gRPC", async () => {
    const register = await callUnary<{
      user: { email: string };
      tokens: { access_token: string };
    }>(authClient!, "Register", {
      name: "Altay",
      email: "altay@example.com",
      password: "password123",
      account_type: "single",
    });

    expect(register.response.user.email).toBe("altay@example.com");

    const md = new Metadata();
    md.set("authorization", `Bearer ${register.response.tokens.access_token}`);

    const me = await callUnary<{ user: { email: string } }>(
      authClient!,
      "Me",
      {},
      md,
    );

    expect(me.response.user.email).toBe("altay@example.com");
  });

  it("supports workspace, collections, environments and import-export gRPC flows", async () => {
    const register = await callUnary<{
      user: { email: string };
      workspace: { id: number | string };
      tokens: { access_token: string };
    }>(authClient!, "Register", {
      name: "Altay",
      email: "altay+flows@example.com",
      password: "password123",
      account_type: "single",
    });

    const workspaceId = Number(register.response.workspace.id);
    const md = new Metadata();
    md.set("authorization", `Bearer ${register.response.tokens.access_token}`);

    const workspaceList = await callUnary<{ items: unknown[] }>(
      workspacesClient!,
      "List",
      {},
      md,
    );
    expect(workspaceList.response.items.length).toBeGreaterThan(0);

    const createdCollection = await callUnary<{
      item: { id: number | string };
    }>(
      collectionsClient!,
      "Create",
      {
        workspace_id: workspaceId,
        name: "Integration Collection",
      },
      md,
    );
    const collectionId = Number(createdCollection.response.item.id);
    expect(collectionId).toBeGreaterThan(0);

    const collectionList = await callUnary<{ items: unknown[] }>(
      collectionsClient!,
      "List",
      { workspace_id: workspaceId },
      md,
    );
    expect(collectionList.response.items.length).toBe(1);

    const createdEnvironment = await callUnary<{
      item: { id: number | string };
    }>(
      environmentsClient!,
      "Create",
      { workspace_id: workspaceId, name: "Dev" },
      md,
    );
    const environmentId = Number(createdEnvironment.response.item.id);

    const variable = await callUnary<{ item: { key: string } }>(
      environmentsClient!,
      "CreateVariable",
      {
        workspace_id: workspaceId,
        environment_id: environmentId,
        key: "API_URL",
        value: "https://example.com",
        enabled: true,
        is_secret: false,
        position: 0,
      },
      md,
    );
    expect(variable.response.item.key).toBe("API_URL");

    const exportJob = await callUnary<{ job_json: string }>(
      importExportClient!,
      "CreateExportJob",
      {
        workspace_id: workspaceId,
        payload_json: JSON.stringify({ format: "json", includeRuns: false }),
      },
      md,
    );
    expect(JSON.parse(exportJob.response.job_json).type).toBe("export");
  });

  it("returns validation error for invalid runs create payload", async () => {
    const register = await callUnary<{
      workspace: { id: number | string };
      tokens: { access_token: string };
    }>(authClient!, "Register", {
      name: "Altay",
      email: "altay+runs@example.com",
      password: "password123",
      account_type: "single",
    });

    const md = new Metadata();
    md.set("authorization", `Bearer ${register.response.tokens.access_token}`);

    await expect(
      callUnary(
        runsClient!,
        "Create",
        {
          workspace_id: Number(register.response.workspace.id),
          payload_json: JSON.stringify({ invalid: true }),
        },
        md,
      ),
    ).rejects.toMatchObject({ code: 3 });
  });

  it("rejects adhoc localhost runs due to network policy", async () => {
    const register = await callUnary<{
      workspace: { id: number | string };
      tokens: { access_token: string };
    }>(authClient!, "Register", {
      name: "Runner",
      email: "runner@example.com",
      password: "password123",
      account_type: "single",
    });

    const md = new Metadata();
    md.set("authorization", `Bearer ${register.response.tokens.access_token}`);

    await expect(
      callUnary<{ run_json: string }>(
        runsClient!,
        "Create",
        {
          workspace_id: Number(register.response.workspace.id),
          payload_json: JSON.stringify({
            source: {
              type: "adhoc",
              request: {
                method: "GET",
                url: "http://127.0.0.1:55000/healthz",
                headers: [],
                queryParams: [],
                body: null,
                auth: { type: "none" },
              },
            },
          }),
        },
        md,
      ),
    ).rejects.toMatchObject({
      code: 2,
      details: "Localhost targets are blocked by policy",
    });
  });
});
