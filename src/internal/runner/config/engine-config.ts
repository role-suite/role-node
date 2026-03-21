import { z } from "zod";

export const requestRunnerEngineConfigSchema = z
  .object({
    mode: z.enum(["sync", "async"]),
    execution: z
      .object({
        httpClient: z.enum(["undici", "node-fetch"]),
        followRedirectsDefault: z.boolean(),
        maxRedirects: z.number().int().min(0).max(20),
      })
      .strict(),
    limits: z
      .object({
        timeoutMsDefault: z.number().int().positive(),
        timeoutMsMax: z.number().int().positive(),
        maxRequestBytes: z.number().int().positive(),
        maxResponseBytesDefault: z.number().int().positive(),
      })
      .strict(),
    policy: z
      .object({
        allowHttp: z.boolean(),
        allowHttps: z.boolean(),
        blockLocalhost: z.boolean(),
        blockPrivateCidrs: z.array(z.string().min(1)),
        domainAllowlist: z.array(z.string().min(1)),
      })
      .strict(),
    redaction: z
      .object({
        token: z.string().min(1).max(20),
        secretHeaderKeys: z.array(z.string().min(1)),
        secretQueryKeyPatterns: z.array(z.string().min(1)),
      })
      .strict(),
    persistence: z
      .object({
        retentionDays: z.number().int().positive(),
        persistBinaryBodies: z.boolean(),
      })
      .strict(),
    modules: z
      .object({
        runStore: z.enum(["postgres"]),
        networkPolicy: z.enum(["default"]),
        limitsPolicy: z.enum(["default"]),
        redactionPolicy: z.enum(["default"]),
      })
      .strict(),
  })
  .strict()
  .refine(
    (value) => value.limits.timeoutMsMax >= value.limits.timeoutMsDefault,
    {
      message: "limits.timeoutMsMax must be >= limits.timeoutMsDefault",
      path: ["limits", "timeoutMsMax"],
    },
  )
  .refine((value) => value.policy.allowHttp || value.policy.allowHttps, {
    message: "At least one protocol must be enabled",
    path: ["policy", "allowHttps"],
  });

export type RequestRunnerEngineConfig = z.infer<
  typeof requestRunnerEngineConfigSchema
>;

export const requestRunnerEngineDefaults: RequestRunnerEngineConfig = {
  mode: "sync",
  execution: {
    httpClient: "undici",
    followRedirectsDefault: true,
    maxRedirects: 5,
  },
  limits: {
    timeoutMsDefault: 10000,
    timeoutMsMax: 60000,
    maxRequestBytes: 1048576,
    maxResponseBytesDefault: 1048576,
  },
  policy: {
    allowHttp: true,
    allowHttps: true,
    blockLocalhost: true,
    blockPrivateCidrs: [
      "127.0.0.0/8",
      "10.0.0.0/8",
      "172.16.0.0/12",
      "192.168.0.0/16",
      "::1",
      "fc00::/7",
    ],
    domainAllowlist: [],
  },
  redaction: {
    token: "***",
    secretHeaderKeys: [
      "authorization",
      "proxy-authorization",
      "x-api-key",
      "cookie",
      "set-cookie",
    ],
    secretQueryKeyPatterns: ["token", "secret", "key", "password"],
  },
  persistence: {
    retentionDays: 30,
    persistBinaryBodies: true,
  },
  modules: {
    runStore: "postgres",
    networkPolicy: "default",
    limitsPolicy: "default",
    redactionPolicy: "default",
  },
};
