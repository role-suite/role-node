import { authContracts } from "./auth/contracts.js";
import { collectionContracts } from "./collections/contracts.js";
import { environmentContracts } from "./environments/contracts.js";
import { importExportContracts } from "./import-export/contracts.js";
import { runContracts } from "./runs/contracts.js";
import { workspaceContracts } from "./workspaces/contracts.js";

export { authContracts } from "./auth/contracts.js";
export { collectionContracts } from "./collections/contracts.js";
export { environmentContracts } from "./environments/contracts.js";
export { importExportContracts } from "./import-export/contracts.js";
export { runContracts } from "./runs/contracts.js";
export { workspaceContracts } from "./workspaces/contracts.js";
export type { EndpointContract, AuthRequirement } from "./shared.js";

export const allContracts = [
  ...authContracts,
  ...workspaceContracts,
  ...collectionContracts,
  ...environmentContracts,
  ...runContracts,
  ...importExportContracts,
];
