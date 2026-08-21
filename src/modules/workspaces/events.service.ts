import { authRepo, type WorkspaceEvent } from "../auth/repo.js";
import type { DatabaseClient } from "../../types/db.js";

type WorkspaceEventPayload = Record<string, unknown> | null;

const parsePayload = (value: string | null): WorkspaceEventPayload => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }

    return null;
  } catch {
    return null;
  }
};

const mapEvent = (event: WorkspaceEvent) => {
  return {
    id: event.id,
    workspaceId: event.workspaceId,
    actorUserId: event.actorUserId,
    entity: event.entity,
    action: event.action,
    entityId: event.entityId,
    payload: parsePayload(event.payloadJson),
    createdAt: event.createdAt,
  };
};

export const workspaceEventsService = {
  async publish(
    input: {
      workspaceId: number;
      actorUserId: number;
      entity: string;
      action: string;
      entityId?: number | null;
      payload?: Record<string, unknown>;
    },
    dbClient?: DatabaseClient,
  ): Promise<void> {
    await authRepo.createWorkspaceEvent(
      {
        workspaceId: input.workspaceId,
        actorUserId: input.actorUserId,
        entity: input.entity,
        action: input.action,
        entityId: input.entityId ?? null,
        payloadJson: input.payload ? JSON.stringify(input.payload) : null,
      },
      dbClient,
    );
  },

  async listByCursor(workspaceId: number, since: number, limit: number) {
    // Fetch one extra row to tell "exactly `limit` events left" apart from "more after this
    // page" - `mapped.length === limit` alone can't distinguish those, so it reported `hasMore:
    // true` even when the caller had just received the last page.
    const events = await authRepo.listWorkspaceEventsByCursor(
      workspaceId,
      since,
      limit + 1,
    );

    const hasMore = events.length > limit;
    const page = hasMore ? events.slice(0, limit) : events;
    const mapped = page.map(mapEvent);
    const nextCursor = mapped.at(-1)?.id ?? since;

    return {
      items: mapped,
      cursor: {
        next: nextCursor,
        hasMore,
      },
    };
  },
};
