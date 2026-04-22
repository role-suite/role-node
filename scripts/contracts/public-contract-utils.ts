import { readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

import { allContracts, type EndpointContract } from "../../contracts/index.js";
import { authRouter } from "../../src/modules/auth/auth.route.js";
import { collectionsRouter } from "../../src/modules/collections/collections.route.js";
import { environmentsRouter } from "../../src/modules/environments/environments.route.js";
import { importExportRouter } from "../../src/modules/import-export/import-export.route.js";
import { runsRouter } from "../../src/modules/runs/runs.route.js";
import { workspacesRouter } from "../../src/modules/workspaces/workspaces.route.js";
import { API_MOUNTS, ROUTE_PATTERNS } from "../../src/shared/http/routes.js";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

type RouteRef = {
  method: EndpointContract["method"];
  path: string;
};

type EndpointSnapshot = {
  method: EndpointContract["method"];
  path: string;
  auth: EndpointContract["auth"];
  request: {
    params: JsonValue | null;
    query: JsonValue | null;
    body: JsonValue | null;
  };
  responses: {
    success: {
      status: number;
      schema: JsonValue;
    };
    errors: Array<{
      status: number;
      description: string;
      schema: JsonValue;
    }>;
  };
};

export type PublicContractsSnapshot = {
  version: 1;
  endpoints: EndpointSnapshot[];
  runtimeRoutes: RouteRef[];
  undocumentedRoutes: RouteRef[];
  missingRuntimeRoutes: RouteRef[];
};

type ExpressLayer = {
  route?: {
    path: string | string[];
    methods: Record<string, boolean | undefined>;
  };
};

type RouterLike = {
  stack?: ExpressLayer[];
};

const METHOD_ORDER: EndpointContract["method"][] = [
  "GET",
  "POST",
  "PATCH",
  "DELETE",
];

const routerMounts = [
  { router: authRouter as RouterLike, basePath: API_MOUNTS.auth },
  { router: workspacesRouter as RouterLike, basePath: API_MOUNTS.workspaces },
  {
    router: collectionsRouter as RouterLike,
    basePath: ROUTE_PATTERNS.workspaces.nested.collections,
  },
  {
    router: environmentsRouter as RouterLike,
    basePath: ROUTE_PATTERNS.workspaces.nested.environments,
  },
  {
    router: importExportRouter as RouterLike,
    basePath: ROUTE_PATTERNS.workspaces.nested.importExport,
  },
  {
    router: runsRouter as RouterLike,
    basePath: ROUTE_PATTERNS.workspaces.nested.runs,
  },
];

const normalizePath = (value: string): string => {
  const compact = value.replace(/\/+/g, "/");

  if (compact.length > 1 && compact.endsWith("/")) {
    return compact.slice(0, -1);
  }

  return compact;
};

const joinPaths = (basePath: string, routePath: string): string => {
  if (routePath === "/") {
    return normalizePath(basePath);
  }

  return normalizePath(`${basePath}${routePath}`);
};

const methodRank = (method: string): number => {
  const index = METHOD_ORDER.indexOf(method as EndpointContract["method"]);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const compareRouteRefs = (left: RouteRef, right: RouteRef): number => {
  if (left.path !== right.path) {
    return left.path.localeCompare(right.path);
  }

  return methodRank(left.method) - methodRank(right.method);
};

const sortJson = (value: JsonValue): JsonValue => {
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }

  if (value && typeof value === "object") {
    const sorted: Record<string, JsonValue> = {};

    for (const key of Object.keys(value).sort()) {
      const current = (value as Record<string, JsonValue>)[key];

      if (current !== undefined) {
        sorted[key] = sortJson(current);
      }
    }

    return sorted;
  }

  return value;
};

const toJsonSchema = (schema: z.ZodTypeAny): JsonValue => {
  return sortJson(
    z.toJSONSchema(schema, {
      io: "input",
      unrepresentable: "any",
    }) as JsonValue,
  );
};

const extractRoutesFromRouter = (
  router: RouterLike,
  basePath: string,
): RouteRef[] => {
  const stack = router.stack ?? [];
  const collected: RouteRef[] = [];

  for (const layer of stack) {
    if (!layer.route) {
      continue;
    }

    const rawPaths = Array.isArray(layer.route.path)
      ? layer.route.path
      : [layer.route.path];
    const methods = Object.entries(layer.route.methods)
      .filter(([, isEnabled]) => isEnabled)
      .map(([method]) => method.toUpperCase() as EndpointContract["method"]);

    for (const rawPath of rawPaths) {
      const fullPath = joinPaths(basePath, rawPath);

      for (const method of methods) {
        collected.push({ method, path: fullPath });
      }
    }
  }

  return collected;
};

const uniqueSortedRoutes = (routes: RouteRef[]): RouteRef[] => {
  const byKey = new Map<string, RouteRef>();

  for (const route of routes) {
    byKey.set(`${route.method} ${route.path}`, route);
  }

  return Array.from(byKey.values()).sort(compareRouteRefs);
};

export const snapshotFilePath = path.resolve(
  process.cwd(),
  "contracts/generated/public-api.snapshot.json",
);

export const buildPublicContractsSnapshot = (): PublicContractsSnapshot => {
  const runtimeRoutes = uniqueSortedRoutes(
    routerMounts.flatMap(({ router, basePath }) =>
      extractRoutesFromRouter(router, basePath),
    ),
  );

  const contractRoutes = uniqueSortedRoutes(
    allContracts.map((contract) => ({
      method: contract.method,
      path: normalizePath(contract.path),
    })),
  );

  const runtimeRouteKeys = new Set(
    runtimeRoutes.map((route) => `${route.method} ${route.path}`),
  );
  const contractRouteKeys = new Set(
    contractRoutes.map((route) => `${route.method} ${route.path}`),
  );

  const undocumentedRoutes = runtimeRoutes.filter(
    (route) => !contractRouteKeys.has(`${route.method} ${route.path}`),
  );
  const missingRuntimeRoutes = contractRoutes.filter(
    (route) => !runtimeRouteKeys.has(`${route.method} ${route.path}`),
  );

  const endpoints = [...allContracts].sort(compareRouteRefs).map(
    (contract): EndpointSnapshot => ({
      method: contract.method,
      path: normalizePath(contract.path),
      auth: contract.auth,
      request: {
        params: contract.request.params
          ? toJsonSchema(contract.request.params)
          : null,
        query: contract.request.query
          ? toJsonSchema(contract.request.query)
          : null,
        body: contract.request.body
          ? toJsonSchema(contract.request.body)
          : null,
      },
      responses: {
        success: {
          status: contract.responses.success.status,
          schema: toJsonSchema(contract.responses.success.schema),
        },
        errors: contract.responses.errors.map((errorResponse) => ({
          status: errorResponse.status,
          description: errorResponse.description,
          schema: toJsonSchema(errorResponse.schema),
        })),
      },
    }),
  );

  return {
    version: 1,
    endpoints,
    runtimeRoutes,
    undocumentedRoutes,
    missingRuntimeRoutes,
  };
};

export const formatSnapshot = (snapshot: PublicContractsSnapshot): string => {
  return `${JSON.stringify(snapshot, null, 2)}\n`;
};

export const readSnapshotFile = (): PublicContractsSnapshot => {
  const raw = readFileSync(snapshotFilePath, "utf8");
  return JSON.parse(raw) as PublicContractsSnapshot;
};
