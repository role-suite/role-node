import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { authService } from "../../src/modules/auth/auth.service.js";
import { setEnvironmentsRepoDbClient } from "../../src/modules/environments/environments.repo.js";
import { environmentsService } from "../../src/modules/environments/environments.service.js";
import { workspacesService } from "../../src/modules/workspaces/workspaces.service.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("environments service", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setEnvironmentsRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setEnvironmentsRepoDbClient(null);
  });

  it("allows owner to create, update and delete environments", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });

    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Env Team",
    });

    const created = await environmentsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Staging" },
    );

    expect(created.name).toBe("Staging");

    const updated = await environmentsService.updateForWorkspace(
      owner.user.id,
      workspace.id,
      created.id,
      { name: "Production" },
    );

    expect(updated.name).toBe("Production");

    await environmentsService.deleteForWorkspace(
      owner.user.id,
      workspace.id,
      created.id,
    );

    await expect(
      environmentsService.getByIdForWorkspace(
        owner.user.id,
        workspace.id,
        created.id,
      ),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Environment not found",
    });
  });

  it("allows members to read but not modify environments", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const member = await authService.register({
      name: "Member",
      email: "member@example.com",
      password: "password123",
      accountType: "single",
    });

    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Read Env Team",
    });

    await workspacesService.addMemberForUser(owner.user.id, {
      workspaceId: workspace.id,
      email: member.user.email,
      role: "member",
    });

    const created = await environmentsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Dev" },
    );

    const listed = await environmentsService.listForWorkspace(
      member.user.id,
      workspace.id,
    );
    expect(listed).toHaveLength(1);

    await expect(
      environmentsService.createForWorkspace(member.user.id, workspace.id, {
        name: "Denied",
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "Only workspace owners and admins can modify environments",
    });

    const readOne = await environmentsService.getByIdForWorkspace(
      member.user.id,
      workspace.id,
      created.id,
    );
    expect(readOne.id).toBe(created.id);
  });

  it("enforces unique environment names within a workspace", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });

    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Unique Team",
    });

    await environmentsService.createForWorkspace(owner.user.id, workspace.id, {
      name: "Staging",
    });

    await expect(
      environmentsService.createForWorkspace(owner.user.id, workspace.id, {
        name: "Staging",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Environment name already exists",
    });
  });

  it("allows owner to manage environment variables", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });

    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Vars Team",
    });

    const environment = await environmentsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Staging" },
    );

    const variable = await environmentsService.createVariableForEnvironment(
      owner.user.id,
      workspace.id,
      environment.id,
      {
        key: "apiUrl",
        value: "https://api.example.com",
      },
    );

    expect(variable.key).toBe("apiUrl");

    const listed = await environmentsService.listVariablesForEnvironment(
      owner.user.id,
      workspace.id,
      environment.id,
    );
    expect(listed).toHaveLength(1);

    const updated = await environmentsService.updateVariableForEnvironment(
      owner.user.id,
      workspace.id,
      environment.id,
      variable.id,
      { value: "https://api-v2.example.com", isSecret: true },
    );

    expect(updated.value).toBe("https://api-v2.example.com");
    expect(updated.isSecret).toBe(true);

    await environmentsService.deleteVariableForEnvironment(
      owner.user.id,
      workspace.id,
      environment.id,
      variable.id,
    );

    await expect(
      environmentsService.getVariableByIdForEnvironment(
        owner.user.id,
        workspace.id,
        environment.id,
        variable.id,
      ),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Environment variable not found",
    });
  });

  it("blocks duplicate variable keys and member writes", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const member = await authService.register({
      name: "Member",
      email: "member@example.com",
      password: "password123",
      accountType: "single",
    });

    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Read Vars Team",
    });

    await workspacesService.addMemberForUser(owner.user.id, {
      workspaceId: workspace.id,
      email: member.user.email,
      role: "member",
    });

    const environment = await environmentsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "QA" },
    );

    await environmentsService.createVariableForEnvironment(
      owner.user.id,
      workspace.id,
      environment.id,
      {
        key: "token",
        value: "abc",
      },
    );

    await expect(
      environmentsService.createVariableForEnvironment(
        owner.user.id,
        workspace.id,
        environment.id,
        {
          key: "token",
          value: "def",
        },
      ),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Environment variable key already exists",
    });

    await expect(
      environmentsService.createVariableForEnvironment(
        member.user.id,
        workspace.id,
        environment.id,
        {
          key: "shouldFail",
          value: "x",
        },
      ),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "Only workspace owners and admins can modify environments",
    });
  });
});
