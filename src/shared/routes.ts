export const API_PREFIX = "/api/v1" as const;

const AUTH_BASE = `${API_PREFIX}/auth` as const;
const WORKSPACES_BASE = `${API_PREFIX}/workspaces` as const;

const WORKSPACE_ID_PARAM = ":workspaceId" as const;
const COLLECTION_ID_PARAM = ":collectionId" as const;
const ENDPOINT_ID_PARAM = ":endpointId" as const;
const EXAMPLE_ID_PARAM = ":exampleId" as const;
const FOLDER_ID_PARAM = ":folderId" as const;
const ENVIRONMENT_ID_PARAM = ":environmentId" as const;
const VARIABLE_ID_PARAM = ":variableId" as const;
const JOB_ID_PARAM = ":jobId" as const;
const MEMBER_USER_ID_PARAM = ":memberUserId" as const;
const SESSION_ID_PARAM = ":sessionId" as const;

export const API_MOUNTS = {
  auth: AUTH_BASE,
  workspaces: WORKSPACES_BASE,
} as const;

export const ROUTE_SEGMENTS = {
  health: "/health",
  auth: {
    register: "/register",
    login: "/login",
    refresh: "/refresh",
    logout: "/logout",
    me: "/me",
    switchWorkspace: "/switch-workspace",
    sessions: "/sessions",
    sessionById: `/sessions/${SESSION_ID_PARAM}`,
  },
  workspaces: {
    list: "/",
    create: "/",
    byId: `/${WORKSPACE_ID_PARAM}`,
    members: `/${WORKSPACE_ID_PARAM}/members`,
    memberByUserId: `/${WORKSPACE_ID_PARAM}/members/${MEMBER_USER_ID_PARAM}`,
    invitations: `/${WORKSPACE_ID_PARAM}/invitations`,
    join: "/join",
    leave: `/${WORKSPACE_ID_PARAM}/leave`,
    convertToTeam: `/${WORKSPACE_ID_PARAM}/convert-to-team`,
    updates: `/${WORKSPACE_ID_PARAM}/updates`,
    nested: {
      environments: `/${WORKSPACE_ID_PARAM}/environments`,
      collections: `/${WORKSPACE_ID_PARAM}/collections`,
      importExport: `/${WORKSPACE_ID_PARAM}/import-export`,
    },
  },
  collections: {
    list: "/",
    create: "/",
    byId: `/${COLLECTION_ID_PARAM}`,
    endpoints: `/${COLLECTION_ID_PARAM}/endpoints`,
    endpointById: `/${COLLECTION_ID_PARAM}/endpoints/${ENDPOINT_ID_PARAM}`,
    endpointExamples: `/${COLLECTION_ID_PARAM}/endpoints/${ENDPOINT_ID_PARAM}/examples`,
    endpointExampleById: `/${COLLECTION_ID_PARAM}/endpoints/${ENDPOINT_ID_PARAM}/examples/${EXAMPLE_ID_PARAM}`,
    folders: `/${COLLECTION_ID_PARAM}/folders`,
    folderById: `/${COLLECTION_ID_PARAM}/folders/${FOLDER_ID_PARAM}`,
  },
  environments: {
    list: "/",
    create: "/",
    byId: `/${ENVIRONMENT_ID_PARAM}`,
    variables: `/${ENVIRONMENT_ID_PARAM}/variables`,
    variableById: `/${ENVIRONMENT_ID_PARAM}/variables/${VARIABLE_ID_PARAM}`,
  },
  importExport: {
    jobs: "/jobs",
    jobById: `/jobs/${JOB_ID_PARAM}`,
    exports: "/exports",
    imports: "/imports",
  },
} as const;

export const ROUTE_PATTERNS = {
  health: ROUTE_SEGMENTS.health,
  auth: {
    register: `${AUTH_BASE}${ROUTE_SEGMENTS.auth.register}`,
    login: `${AUTH_BASE}${ROUTE_SEGMENTS.auth.login}`,
    refresh: `${AUTH_BASE}${ROUTE_SEGMENTS.auth.refresh}`,
    logout: `${AUTH_BASE}${ROUTE_SEGMENTS.auth.logout}`,
    me: `${AUTH_BASE}${ROUTE_SEGMENTS.auth.me}`,
    switchWorkspace: `${AUTH_BASE}${ROUTE_SEGMENTS.auth.switchWorkspace}`,
    sessions: `${AUTH_BASE}${ROUTE_SEGMENTS.auth.sessions}`,
    sessionById: `${AUTH_BASE}${ROUTE_SEGMENTS.auth.sessionById}`,
  },
  workspaces: {
    list: WORKSPACES_BASE,
    create: WORKSPACES_BASE,
    byId: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.byId}`,
    members: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.members}`,
    memberByUserId: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.memberByUserId}`,
    invitations: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.invitations}`,
    join: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.join}`,
    leave: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.leave}`,
    convertToTeam: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.convertToTeam}`,
    updates: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.updates}`,
    nested: {
      environments: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.environments}`,
      collections: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.collections}`,
      importExport: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.importExport}`,
    },
  },
  collections: {
    list: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.collections}`,
    byId: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.collections}${ROUTE_SEGMENTS.collections.byId}`,
    endpoints: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.collections}${ROUTE_SEGMENTS.collections.endpoints}`,
    endpointById: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.collections}${ROUTE_SEGMENTS.collections.endpointById}`,
    endpointExamples: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.collections}${ROUTE_SEGMENTS.collections.endpointExamples}`,
    endpointExampleById: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.collections}${ROUTE_SEGMENTS.collections.endpointExampleById}`,
    folders: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.collections}${ROUTE_SEGMENTS.collections.folders}`,
    folderById: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.collections}${ROUTE_SEGMENTS.collections.folderById}`,
  },
  environments: {
    list: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.environments}`,
    byId: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.environments}${ROUTE_SEGMENTS.environments.byId}`,
    variables: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.environments}${ROUTE_SEGMENTS.environments.variables}`,
    variableById: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.environments}${ROUTE_SEGMENTS.environments.variableById}`,
  },
  importExport: {
    jobs: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.importExport}${ROUTE_SEGMENTS.importExport.jobs}`,
    jobById: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.importExport}${ROUTE_SEGMENTS.importExport.jobById}`,
    exports: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.importExport}${ROUTE_SEGMENTS.importExport.exports}`,
    imports: `${WORKSPACES_BASE}${ROUTE_SEGMENTS.workspaces.nested.importExport}${ROUTE_SEGMENTS.importExport.imports}`,
  },
} as const;

export const routeBuilders = {
  workspaceMembers: (workspaceId: number | string): string => {
    return `${WORKSPACES_BASE}/${workspaceId}/members`;
  },
  workspaceCollections: (workspaceId: number | string): string => {
    return `${WORKSPACES_BASE}/${workspaceId}/collections`;
  },
  workspaceCollectionEndpoints: (
    workspaceId: number | string,
    collectionId: number | string,
  ): string => {
    return `${WORKSPACES_BASE}/${workspaceId}/collections/${collectionId}/endpoints`;
  },
  workspaceImportExportExports: (workspaceId: number | string): string => {
    return `${WORKSPACES_BASE}/${workspaceId}/import-export/exports`;
  },
  workspaceImportExportImports: (workspaceId: number | string): string => {
    return `${WORKSPACES_BASE}/${workspaceId}/import-export/imports`;
  },
  workspaceImportExportJobs: (workspaceId: number | string): string => {
    return `${WORKSPACES_BASE}/${workspaceId}/import-export/jobs`;
  },
  workspaceImportExportJobById: (
    workspaceId: number | string,
    jobId: number | string,
  ): string => {
    return `${WORKSPACES_BASE}/${workspaceId}/import-export/jobs/${jobId}`;
  },
} as const;
