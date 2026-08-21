# Error Model

All modules return the same machine-readable error envelope:

```json
{
  "success": false,
  "error": {
    "code": "WORKSPACE_NOT_FOUND",
    "message": "Workspace not found",
    "details": {},
    "requestId": "req_123"
  }
}
```

## Error fields

- `error.code`: stable SDK/client branching key.
- `error.message`: human-readable default message.
- `error.details`: structured context (validation fields, params, upstream details).
- `error.requestId`: request correlation id (`x-request-id` header value).

## Correlation id behavior

- Every request is assigned a correlation id by `src/shared/middleware/request-id.ts`.
- If client sends `x-request-id`, the same value is reused; otherwise server generates a UUID.
- Response always includes `x-request-id` header.
- Error envelopes include the same value at `error.requestId`.
- Structured logs include this request id to make cross-service tracing and production debugging easier.

## Error code registry

Source of truth: `src/shared/errors/error-codes.ts`.

### Common

| Code                            | HTTP | Default message                  |
| ------------------------------- | ---- | -------------------------------- |
| `INTERNAL_SERVER_ERROR`         | 500  | Internal server error            |
| `VALIDATION_FAILED`             | 400  | Validation failed                |
| `INVALID_URL_PARAMETERS`        | 400  | Invalid URL parameters           |
| `ROUTE_NOT_FOUND`               | 404  | Route not found                  |
| `MISSING_AUTHENTICATED_CONTEXT` | 401  | Missing authenticated context    |
| `MISSING_ACCESS_TOKEN`          | 401  | Missing access token             |
| `INVALID_ACCESS_TOKEN`          | 401  | Invalid access token             |
| `AUTH_CONTEXT_INVALID`          | 401  | Authenticated context is invalid |
| `USER_NOT_FOUND`                | 404  | User not found                   |

### Auth

| Code                      | HTTP | Default message               |
| ------------------------- | ---- | ----------------------------- |
| `EMAIL_ALREADY_IN_USE`    | 409  | Email already in use          |
| `INVALID_CREDENTIALS`     | 401  | Invalid credentials           |
| `NO_WORKSPACE_MEMBERSHIP` | 403  | No workspace membership found |
| `INVALID_REFRESH_TOKEN`   | 401  | Invalid refresh token         |
| `REFRESH_SESSION_INVALID` | 401  | Refresh session is invalid    |

### Workspaces

| Code                                         | HTTP | Default message                                       |
| -------------------------------------------- | ---- | ----------------------------------------------------- |
| `WORKSPACE_ACCESS_DENIED`                    | 403  | Workspace access denied                               |
| `WORKSPACE_NOT_FOUND`                        | 404  | Workspace not found                                   |
| `WORKSPACE_MEMBERS_MANAGE_FORBIDDEN`         | 403  | Only workspace owners can manage members              |
| `WORKSPACE_PERSONAL_MEMBERS_UNSUPPORTED`     | 400  | Personal workspaces do not support additional members |
| `WORKSPACE_PERSONAL_INVITATIONS_UNSUPPORTED` | 400  | Personal workspaces do not support invitations        |
| `WORKSPACE_INVITATION_ALREADY_PENDING`       | 409  | Invitation already pending                            |
| `WORKSPACE_INVITATION_NOT_FOUND`             | 404  | Invitation not found                                  |
| `WORKSPACE_INVITATION_ALREADY_USED`          | 409  | Invitation already used                               |
| `WORKSPACE_INVITATION_EXPIRED`               | 410  | Invitation expired                                    |
| `WORKSPACE_INVITATION_EMAIL_MISMATCH`        | 403  | Invitation email does not match user                  |
| `WORKSPACE_MEMBERSHIP_ALREADY_EXISTS`        | 409  | User is already a workspace member                    |
| `WORKSPACE_MEMBER_NOT_FOUND`                 | 404  | Workspace member not found                            |
| `WORKSPACE_OWNER_ROLE_IMMUTABLE`             | 400  | Owner role cannot be changed                          |
| `WORKSPACE_SELF_REMOVE_USE_LEAVE`            | 400  | Use leave endpoint to remove yourself                 |
| `WORKSPACE_LAST_OWNER_REMOVE_FORBIDDEN`      | 400  | Cannot remove the last workspace owner                |
| `WORKSPACE_LAST_OWNER_LEAVE_FORBIDDEN`       | 400  | Cannot leave as the last workspace owner              |
| `WORKSPACE_DOES_NOT_ACCEPT_MEMBERS`          | 400  | Workspace does not accept members                     |
| `WORKSPACE_ALREADY_TEAM`                     | 400  | Workspace is already a team                           |

### Collections

| Code                            | HTTP | Default message                                         |
| ------------------------------- | ---- | ------------------------------------------------------- |
| `COLLECTIONS_MODIFY_FORBIDDEN`  | 403  | Only workspace owners and admins can modify collections |
| `COLLECTION_NOT_FOUND`          | 404  | Collection not found                                    |
| `COLLECTION_FOLDER_NOT_FOUND`   | 404  | Collection folder not found                             |
| `COLLECTION_FOLDER_SELF_PARENT` | 400  | Folder cannot be its own parent                         |
| `COLLECTION_ENDPOINT_NOT_FOUND` | 404  | Collection endpoint not found                           |
| `COLLECTION_EXAMPLE_NOT_FOUND`  | 404  | Collection endpoint example not found                   |

### Environments

| Code                                      | HTTP | Default message                                          |
| ----------------------------------------- | ---- | -------------------------------------------------------- |
| `ENVIRONMENTS_MODIFY_FORBIDDEN`           | 403  | Only workspace owners and admins can modify environments |
| `ENVIRONMENT_NOT_FOUND`                   | 404  | Environment not found                                    |
| `ENVIRONMENT_VARIABLE_NOT_FOUND`          | 404  | Environment variable not found                           |
| `ENVIRONMENT_NAME_ALREADY_EXISTS`         | 409  | Environment name already exists                          |
| `ENVIRONMENT_VARIABLE_KEY_ALREADY_EXISTS` | 409  | Environment variable key already exists                  |

### Import/Export

| Code                          | HTTP | Default message                                              |
| ----------------------------- | ---- | ------------------------------------------------------------ |
| `IMPORT_EXPORT_RUN_FORBIDDEN` | 403  | Only workspace owners and admins can run imports and exports |
| `IMPORT_EXPORT_JOB_NOT_FOUND` | 404  | Import/export job not found                                  |

### System

| Code             | HTTP | Default message           |
| ---------------- | ---- | ------------------------- |
| `DATABASE_ERROR` | 500  | Database operation failed |
