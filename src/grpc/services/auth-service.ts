import type {
  ServiceDefinition,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";

import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../../modules/auth/auth.schema.js";
import { authService } from "../../modules/auth/auth.service.js";
import { withUnaryContext } from "../interceptors/unary-context.js";
import { toGrpcAuthPayload } from "../mappers/auth.js";

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  account_type: string;
  team_name?: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

type RefreshRequest = {
  refresh_token: string;
};

type LogoutRequest = {
  refresh_token: string;
};

type AuthServiceDefinition = {
  service: ServiceDefinition<UntypedServiceImplementation>;
};

type ServiceRoot = {
  role: {
    v1: {
      AuthService: AuthServiceDefinition;
    };
  };
};

const parseRegisterPayload = (request: RegisterRequest) => {
  return registerSchema.parse({
    name: request.name,
    email: request.email,
    password: request.password,
    accountType: request.account_type,
    teamName: request.team_name || undefined,
  });
};

const parseLoginPayload = (request: LoginRequest) => {
  return loginSchema.parse({
    email: request.email,
    password: request.password,
  });
};

const parseRefreshPayload = (request: RefreshRequest | LogoutRequest) => {
  return refreshTokenSchema.parse({
    refreshToken: request.refresh_token,
  });
};

export const addAuthGrpcService = (
  root: ServiceRoot,
): {
  service: ServiceDefinition<UntypedServiceImplementation>;
  implementation: UntypedServiceImplementation;
} => {
  return {
    service: root.role.v1.AuthService.service,
    implementation: {
      Register: withUnaryContext<
        RegisterRequest,
        ReturnType<typeof toGrpcAuthPayload>
      >("AuthService.Register", {
        handler: async (call) => {
          const result = await authService.register(
            parseRegisterPayload(call.request),
          );
          return toGrpcAuthPayload(result);
        },
      }),
      Login: withUnaryContext<
        LoginRequest,
        ReturnType<typeof toGrpcAuthPayload>
      >("AuthService.Login", {
        handler: async (call) => {
          const result = await authService.login(
            parseLoginPayload(call.request),
          );
          return toGrpcAuthPayload(result);
        },
      }),
      Refresh: withUnaryContext<
        RefreshRequest,
        ReturnType<typeof toGrpcAuthPayload>
      >("AuthService.Refresh", {
        handler: async (call) => {
          const result = await authService.refresh(
            parseRefreshPayload(call.request),
          );
          return toGrpcAuthPayload(result);
        },
      }),
      Logout: withUnaryContext<LogoutRequest, { status: string }>(
        "AuthService.Logout",
        {
          handler: async (call) => {
            await authService.logout(parseRefreshPayload(call.request));
            return { status: "revoked" };
          },
        },
      ),
      Me: withUnaryContext<
        Record<string, never>,
        ReturnType<typeof toGrpcAuthPayload>
      >("AuthService.Me", {
        requireAuth: true,
        handler: async (_call, context) => {
          if (!context.auth) {
            throw new Error("Missing authenticated gRPC context");
          }

          const result = await authService.getMe({
            userId: context.auth.userId,
            workspaceId: context.auth.workspaceId,
            role: context.auth.role,
          });
          return toGrpcAuthPayload(result);
        },
      }),
    },
  };
};
