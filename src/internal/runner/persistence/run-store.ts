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
    return runsRepo.completeSuccess(runId, response);
  }

  async completeFailure(
    runId: number,
    error: RunnerPublicError,
  ): Promise<StoredRun> {
    return runsRepo.completeFailure(runId, error);
  }

  async findById(runId: number): Promise<StoredRun | undefined> {
    return runsRepo.findById(runId);
  }

  async cancel(runId: number): Promise<StoredRun | undefined> {
    return runsRepo.cancel(runId);
  }
}

export const createDbRunStore = (): RunStore => {
  return new DbRunStore();
};
