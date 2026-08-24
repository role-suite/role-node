export const ERROR_CODES = {
  common: {
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    VALIDATION_FAILED: "VALIDATION_FAILED",
    INVALID_URL_PARAMETERS: "INVALID_URL_PARAMETERS",
    ROUTE_NOT_FOUND: "ROUTE_NOT_FOUND",
    MISSING_AUTHENTICATED_CONTEXT: "MISSING_AUTHENTICATED_CONTEXT",
    MISSING_ACCESS_TOKEN: "MISSING_ACCESS_TOKEN",
    INVALID_ACCESS_TOKEN: "INVALID_ACCESS_TOKEN",
    AUTH_CONTEXT_INVALID: "AUTH_CONTEXT_INVALID",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  },
  auth: {
    EMAIL_ALREADY_IN_USE: "EMAIL_ALREADY_IN_USE",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    NO_WORKSPACE_MEMBERSHIP: "NO_WORKSPACE_MEMBERSHIP",
    INVALID_REFRESH_TOKEN: "INVALID_REFRESH_TOKEN",
    REFRESH_SESSION_INVALID: "REFRESH_SESSION_INVALID",
    SESSION_NOT_FOUND: "AUTH_SESSION_NOT_FOUND",
  },
  workspaces: {
    ACCESS_DENIED: "WORKSPACE_ACCESS_DENIED",
    NOT_FOUND: "WORKSPACE_NOT_FOUND",
    MEMBERS_MANAGE_FORBIDDEN: "WORKSPACE_MEMBERS_MANAGE_FORBIDDEN",
    PERSONAL_MEMBERS_UNSUPPORTED: "WORKSPACE_PERSONAL_MEMBERS_UNSUPPORTED",
    PERSONAL_INVITATIONS_UNSUPPORTED:
      "WORKSPACE_PERSONAL_INVITATIONS_UNSUPPORTED",
    INVITATION_ALREADY_PENDING: "WORKSPACE_INVITATION_ALREADY_PENDING",
    INVITATION_NOT_FOUND: "WORKSPACE_INVITATION_NOT_FOUND",
    INVITATION_ALREADY_USED: "WORKSPACE_INVITATION_ALREADY_USED",
    INVITATION_EXPIRED: "WORKSPACE_INVITATION_EXPIRED",
    INVITATION_EMAIL_MISMATCH: "WORKSPACE_INVITATION_EMAIL_MISMATCH",
    MEMBERSHIP_ALREADY_EXISTS: "WORKSPACE_MEMBERSHIP_ALREADY_EXISTS",
    MEMBER_NOT_FOUND: "WORKSPACE_MEMBER_NOT_FOUND",
    OWNER_ROLE_IMMUTABLE: "WORKSPACE_OWNER_ROLE_IMMUTABLE",
    SELF_REMOVE_USE_LEAVE: "WORKSPACE_SELF_REMOVE_USE_LEAVE",
    LAST_OWNER_REMOVE_FORBIDDEN: "WORKSPACE_LAST_OWNER_REMOVE_FORBIDDEN",
    LAST_OWNER_LEAVE_FORBIDDEN: "WORKSPACE_LAST_OWNER_LEAVE_FORBIDDEN",
    DOES_NOT_ACCEPT_MEMBERS: "WORKSPACE_DOES_NOT_ACCEPT_MEMBERS",
    ALREADY_TEAM: "WORKSPACE_ALREADY_TEAM",
  },
  collections: {
    MODIFY_FORBIDDEN: "COLLECTIONS_MODIFY_FORBIDDEN",
    COLLECTION_NOT_FOUND: "COLLECTION_NOT_FOUND",
    FOLDER_NOT_FOUND: "COLLECTION_FOLDER_NOT_FOUND",
    FOLDER_SELF_PARENT: "COLLECTION_FOLDER_SELF_PARENT",
    ENDPOINT_NOT_FOUND: "COLLECTION_ENDPOINT_NOT_FOUND",
    EXAMPLE_NOT_FOUND: "COLLECTION_EXAMPLE_NOT_FOUND",
  },
  environments: {
    MODIFY_FORBIDDEN: "ENVIRONMENTS_MODIFY_FORBIDDEN",
    ENVIRONMENT_NOT_FOUND: "ENVIRONMENT_NOT_FOUND",
    VARIABLE_NOT_FOUND: "ENVIRONMENT_VARIABLE_NOT_FOUND",
    NAME_ALREADY_EXISTS: "ENVIRONMENT_NAME_ALREADY_EXISTS",
    VARIABLE_KEY_ALREADY_EXISTS: "ENVIRONMENT_VARIABLE_KEY_ALREADY_EXISTS",
  },
  importExport: {
    RUN_FORBIDDEN: "IMPORT_EXPORT_RUN_FORBIDDEN",
    JOB_NOT_FOUND: "IMPORT_EXPORT_JOB_NOT_FOUND",
    INVALID_SOURCE_REFERENCE: "IMPORT_EXPORT_INVALID_SOURCE_REFERENCE",
  },
  system: {
    DATABASE_ERROR: "DATABASE_ERROR",
  },
} as const;

type NestedValues<T> =
  T extends Record<string, infer U>
    ? U extends string
      ? U
      : U extends Record<string, unknown>
        ? NestedValues<U>
        : never
    : never;

export type ErrorCode = NestedValues<typeof ERROR_CODES>;

type ErrorCodeDefinition = {
  status: number;
  message: string;
};

export const ERROR_CODE_DEFINITIONS: Record<ErrorCode, ErrorCodeDefinition> = {
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "Internal server error",
  },
  VALIDATION_FAILED: {
    status: 400,
    message: "Validation failed",
  },
  INVALID_URL_PARAMETERS: {
    status: 400,
    message: "Invalid URL parameters",
  },
  ROUTE_NOT_FOUND: {
    status: 404,
    message: "Route not found",
  },
  MISSING_AUTHENTICATED_CONTEXT: {
    status: 401,
    message: "Missing authenticated context",
  },
  MISSING_ACCESS_TOKEN: {
    status: 401,
    message: "Missing access token",
  },
  INVALID_ACCESS_TOKEN: {
    status: 401,
    message: "Invalid access token",
  },
  AUTH_CONTEXT_INVALID: {
    status: 401,
    message: "Authenticated context is invalid",
  },
  USER_NOT_FOUND: {
    status: 404,
    message: "User not found",
  },
  RATE_LIMIT_EXCEEDED: {
    status: 429,
    message: "Too many requests, please try again later",
  },
  EMAIL_ALREADY_IN_USE: {
    status: 409,
    message: "Email already in use",
  },
  INVALID_CREDENTIALS: {
    status: 401,
    message: "Invalid credentials",
  },
  NO_WORKSPACE_MEMBERSHIP: {
    status: 403,
    message: "No workspace membership found",
  },
  INVALID_REFRESH_TOKEN: {
    status: 401,
    message: "Invalid refresh token",
  },
  REFRESH_SESSION_INVALID: {
    status: 401,
    message: "Refresh session is invalid",
  },
  AUTH_SESSION_NOT_FOUND: {
    status: 404,
    message: "Session not found",
  },
  WORKSPACE_ACCESS_DENIED: {
    status: 403,
    message: "Workspace access denied",
  },
  WORKSPACE_NOT_FOUND: {
    status: 404,
    message: "Workspace not found",
  },
  WORKSPACE_MEMBERS_MANAGE_FORBIDDEN: {
    status: 403,
    message: "Only workspace owners can manage members",
  },
  WORKSPACE_PERSONAL_MEMBERS_UNSUPPORTED: {
    status: 400,
    message: "Personal workspaces do not support additional members",
  },
  WORKSPACE_PERSONAL_INVITATIONS_UNSUPPORTED: {
    status: 400,
    message: "Personal workspaces do not support invitations",
  },
  WORKSPACE_INVITATION_ALREADY_PENDING: {
    status: 409,
    message: "Invitation already pending",
  },
  WORKSPACE_INVITATION_NOT_FOUND: {
    status: 404,
    message: "Invitation not found",
  },
  WORKSPACE_INVITATION_ALREADY_USED: {
    status: 409,
    message: "Invitation already used",
  },
  WORKSPACE_INVITATION_EXPIRED: {
    status: 410,
    message: "Invitation expired",
  },
  WORKSPACE_INVITATION_EMAIL_MISMATCH: {
    status: 403,
    message: "Invitation email does not match user",
  },
  WORKSPACE_MEMBERSHIP_ALREADY_EXISTS: {
    status: 409,
    message: "User is already a workspace member",
  },
  WORKSPACE_MEMBER_NOT_FOUND: {
    status: 404,
    message: "Workspace member not found",
  },
  WORKSPACE_OWNER_ROLE_IMMUTABLE: {
    status: 400,
    message: "Owner role cannot be changed",
  },
  WORKSPACE_SELF_REMOVE_USE_LEAVE: {
    status: 400,
    message: "Use leave endpoint to remove yourself",
  },
  WORKSPACE_LAST_OWNER_REMOVE_FORBIDDEN: {
    status: 400,
    message: "Cannot remove the last workspace owner",
  },
  WORKSPACE_LAST_OWNER_LEAVE_FORBIDDEN: {
    status: 400,
    message: "Cannot leave as the last workspace owner",
  },
  WORKSPACE_DOES_NOT_ACCEPT_MEMBERS: {
    status: 400,
    message: "Workspace does not accept members",
  },
  WORKSPACE_ALREADY_TEAM: {
    status: 400,
    message: "Workspace is already a team",
  },
  COLLECTIONS_MODIFY_FORBIDDEN: {
    status: 403,
    message: "Only workspace owners and admins can modify collections",
  },
  COLLECTION_NOT_FOUND: {
    status: 404,
    message: "Collection not found",
  },
  COLLECTION_FOLDER_NOT_FOUND: {
    status: 404,
    message: "Collection folder not found",
  },
  COLLECTION_FOLDER_SELF_PARENT: {
    status: 400,
    message: "Folder cannot be its own parent",
  },
  COLLECTION_ENDPOINT_NOT_FOUND: {
    status: 404,
    message: "Collection endpoint not found",
  },
  COLLECTION_EXAMPLE_NOT_FOUND: {
    status: 404,
    message: "Collection endpoint example not found",
  },
  ENVIRONMENTS_MODIFY_FORBIDDEN: {
    status: 403,
    message: "Only workspace owners and admins can modify environments",
  },
  ENVIRONMENT_NOT_FOUND: {
    status: 404,
    message: "Environment not found",
  },
  ENVIRONMENT_VARIABLE_NOT_FOUND: {
    status: 404,
    message: "Environment variable not found",
  },
  ENVIRONMENT_NAME_ALREADY_EXISTS: {
    status: 409,
    message: "Environment name already exists",
  },
  ENVIRONMENT_VARIABLE_KEY_ALREADY_EXISTS: {
    status: 409,
    message: "Environment variable key already exists",
  },
  IMPORT_EXPORT_RUN_FORBIDDEN: {
    status: 403,
    message: "Only workspace owners and admins can run imports and exports",
  },
  IMPORT_EXPORT_JOB_NOT_FOUND: {
    status: 404,
    message: "Import/export job not found",
  },
  IMPORT_EXPORT_INVALID_SOURCE_REFERENCE: {
    status: 400,
    message: "Import payload references an unknown sourceId",
  },
  DATABASE_ERROR: {
    status: 500,
    message: "Database operation failed",
  },
};
