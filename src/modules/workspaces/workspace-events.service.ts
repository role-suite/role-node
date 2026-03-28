import { authRepo, type WorkspaceEvent } from "../auth/auth.repo.js";

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
  async publish(input: {
    workspaceId: number;
    actorUserId: number;
    entity: string;
    action: string;
    entityId?: number | null;
    payload?: Record<string, unknown>;
  }): Promise<void> {
    await authRepo.createWorkspaceEvent({
      workspaceId: input.workspaceId,
      actorUserId: input.actorUserId,
      entity: input.entity,
      action: input.action,
      entityId: input.entityId ?? null,
      payloadJson: input.payload ? JSON.stringify(input.payload) : null,
    });
  },

  async listByCursor(workspaceId: number, since: number, limit: number) {
    const events = await authRepo.listWorkspaceEventsByCursor(
      workspaceId,
      since,
      limit,
    );

    const mapped = events.map(mapEvent);
    const nextCursor = mapped.at(-1)?.id ?? since;

    return {
      events: mapped,
      cursor: {
        since,
        next: nextCursor,
      },
    };
  },
};
