import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  buildPublicContractsSnapshot,
  formatSnapshot,
  snapshotFilePath,
} from "./public-contract-utils.js";

const snapshot = buildPublicContractsSnapshot();

mkdirSync(path.dirname(snapshotFilePath), { recursive: true });
writeFileSync(snapshotFilePath, formatSnapshot(snapshot), "utf8");

console.log(`Generated contract snapshot at ${snapshotFilePath}`);
