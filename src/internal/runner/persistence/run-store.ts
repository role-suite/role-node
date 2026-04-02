import type {
  ExecutedRequestSnapshot,
  ExecutedResponseSnapshot,
  RunnerPublicError,
  StoredRun,
} from "../core/types.js";
import { runsRepo } from "../../../modules/runs/runs.repo.js";

export type RunStore = {
  createRunning(input: {
    workspaceId: number;
    initiatedByUserId: number;
    sourceType: "adhoc" | "collection_endpoint";
    sourceCollectionId: number | null;
    sourceEndpointId: number | null;
    request: ExecutedRequestSnapshot;
    startedAt: Date;
  }): Promise<StoredRun>;
  completeSuccess(
    runId: number,
    response: ExecutedResponseSnapshot,
  ): Promise<StoredRun>;
  completeFailure(runId: number, error: RunnerPublicError): Promise<StoredRun>;
  findById(runId: number): Promise<StoredRun | undefined>;
  cancel(runId: number): Promise<StoredRun | undefined>;
};

export class DbRunStore implements RunStore {
  public constructor(
    private readonly options: {
      retentionDays: number;
      persistBinaryBodies: boolean;
    },
  ) {}

  private isExpired(run: StoredRun): boolean {
    if (!run.completedAt) {
      return false;
    }

    const retentionMs = this.options.retentionDays * 24 * 60 * 60 * 1000;
    const ageMs = Date.now() - run.completedAt.getTime();
    return ageMs > retentionMs;
  }

  async createRunning(input: {
    workspaceId: number;
    initiatedByUserId: number;
    sourceType: "adhoc" | "collection_endpoint";
    sourceCollectionId: number | null;
    sourceEndpointId: number | null;
    request: ExecutedRequestSnapshot;
    startedAt: Date;
  }): Promise<StoredRun> {
    return runsRepo.createRunning(input);
  }

  async completeSuccess(
    runId: number,
    response: ExecutedResponseSnapshot,
  ): Promise<StoredRun> {
    const prepared: ExecutedResponseSnapshot = this.options.persistBinaryBodies
      ? response
      : {
          ...response,
          bodyBase64: null,
        };

    return runsRepo.completeSuccess(runId, prepared);
  }

  async completeFailure(
    runId: number,
    error: RunnerPublicError,
  ): Promise<StoredRun> {
    return runsRepo.completeFailure(runId, error);
  }

  async findById(runId: number): Promise<StoredRun | undefined> {
    const run = await runsRepo.findById(runId);

    if (!run || this.isExpired(run)) {
      return undefined;
    }

    return run;
  }

  async cancel(runId: number): Promise<StoredRun | undefined> {
    const existing = await runsRepo.findById(runId);

    if (!existing || this.isExpired(existing)) {
      return undefined;
    }

    return runsRepo.cancel(runId);
  }
}

export const createDbRunStore = (options: {
  retentionDays: number;
  persistBinaryBodies: boolean;
}): RunStore => {
  return new DbRunStore(options);
};
