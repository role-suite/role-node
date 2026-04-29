type ServiceAuthPayload = {
  user: {
    id: number;
    name: string;
    email: string;
  };
  workspace: {
    id: number;
    _id: number;
    name: string;
    slug: string;
    type: "personal" | "team";
    role: "owner" | "admin" | "member";
  };
  memberships: Array<{
    workspaceId: number;
    _id: number;
    name: string;
    slug: string;
    type: "personal" | "team";
    role: "owner" | "admin" | "member";
  }>;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    accessTokenTtlSeconds: number;
    refreshTokenTtlSeconds: number;
  };
};

export const toGrpcAuthPayload = (payload: ServiceAuthPayload) => {
  return {
    user: {
      id: payload.user.id,
      name: payload.user.name,
      email: payload.user.email,
    },
    workspace: {
      id: payload.workspace.id,
      legacy_id: payload.workspace._id,
      name: payload.workspace.name,
      slug: payload.workspace.slug,
      type: payload.workspace.type,
      role: payload.workspace.role,
    },
    memberships: payload.memberships.map((membership) => ({
      workspace_id: membership.workspaceId,
      legacy_id: membership._id,
      name: membership.name,
      slug: membership.slug,
      type: membership.type,
      role: membership.role,
    })),
    ...(payload.tokens
      ? {
          tokens: {
            access_token: payload.tokens.accessToken,
            refresh_token: payload.tokens.refreshToken,
            access_token_ttl_seconds: payload.tokens.accessTokenTtlSeconds,
            refresh_token_ttl_seconds: payload.tokens.refreshTokenTtlSeconds,
          },
        }
      : {}),
  };
};
