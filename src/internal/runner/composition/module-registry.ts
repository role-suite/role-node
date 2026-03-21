import { createDbRunStore } from "../persistence/run-store.js";

export const moduleRegistry = {
  runStore: {
    postgres: createDbRunStore,
  },
  networkPolicy: {
    default: "default",
  },
  limitsPolicy: {
    default: "default",
  },
  redactionPolicy: {
    default: "default",
  },
} as const;
