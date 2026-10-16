import { authRepo } from "../auth/repo.js";
import { createAppError } from "../../shared/errors/app-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";

import { collectionsRepo, type Collection } from "./repo.js";

type WorkspaceRole = "owner" | "admin" | "member";

export const requireWorkspaceMembership = async (
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

export const requireWorkspaceWriterRole = async (
  userId: number,
  workspaceId: number,
): Promise<void> => {
  const membership = await requireWorkspaceMembership(userId, workspaceId);

  if (membership.role === "member") {
    throw createAppError(ERROR_CODES.collections.MODIFY_FORBIDDEN);
  }
};

export const requireCollectionInWorkspace = async (
  workspaceId: number,
  collectionId: number,
): Promise<Collection> => {
  const collection = await collectionsRepo.findById(collectionId);

  if (!collection || collection.workspaceId !== workspaceId) {
    throw createAppError(ERROR_CODES.collections.COLLECTION_NOT_FOUND);
  }

  return collection;
};

/**
 * Runs the workspace-role check and the resource-scope check in parallel:
 * neither depends on the other's result, and both are independent DB round
 * trips, so serializing them (as separate `await`s) only adds latency.
 */
export const requireAccessAndCollection = async (
  userId: number,
  workspaceId: number,
  collectionId: number,
  roleCheck: (userId: number, workspaceId: number) => Promise<unknown>,
): Promise<Collection> => {
  const [, collection] = await Promise.all([
    roleCheck(userId, workspaceId),
    requireCollectionInWorkspace(workspaceId, collectionId),
  ]);

  return collection;
};
