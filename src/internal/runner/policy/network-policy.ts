import type { RequestRunnerEngineConfig } from "../config/engine-config.js";
import { RunnerError } from "../errors/runner-errors.js";

const isLocalHostname = (hostname: string): boolean => {
  const normalized = hostname.toLowerCase();
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "::1"
  );
};

const isPrivateIpv4Host = (hostname: string): boolean => {
  if (/^10\./u.test(hostname) || /^192\.168\./u.test(hostname)) {
    return true;
  }

  const match172 = hostname.match(/^172\.(\d{1,3})\./u);
  if (match172) {
    const second = Number(match172[1]);
    return second >= 16 && second <= 31;
  }

  return false;
};

const isPrivateIpv6Host = (hostname: string): boolean => {
  const normalized = hostname.toLowerCase();
  return normalized.startsWith("fc") || normalized.startsWith("fd");
};

const isDomainAllowed = (hostname: string, allowlist: string[]): boolean => {
  if (allowlist.length === 0) {
    return true;
  }

  return allowlist.some((allowed) => {
    const normalized = allowed.toLowerCase();
    return hostname === normalized || hostname.endsWith(`.${normalized}`);
  });
};

export const assertNetworkPolicy = (
  rawUrl: string,
  config: RequestRunnerEngineConfig,
): void => {
  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new RunnerError("RUN_VALIDATION_FAILED", "Request URL is invalid");
  }

  if (parsed.protocol === "http:" && !config.policy.allowHttp) {
    throw new RunnerError("RUN_POLICY_BLOCKED", "HTTP protocol is disabled");
  }

  if (parsed.protocol === "https:" && !config.policy.allowHttps) {
    throw new RunnerError("RUN_POLICY_BLOCKED", "HTTPS protocol is disabled");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new RunnerError(
      "RUN_POLICY_BLOCKED",
      "Only HTTP and HTTPS protocols are allowed",
    );
  }

  const hostname = parsed.hostname.toLowerCase();

  if (config.policy.blockLocalhost && isLocalHostname(hostname)) {
    throw new RunnerError(
      "RUN_POLICY_BLOCKED",
      "Localhost targets are blocked by policy",
    );
  }

  if (
    config.policy.blockPrivateCidrs.length > 0 &&
    (isPrivateIpv4Host(hostname) || isPrivateIpv6Host(hostname))
  ) {
    throw new RunnerError(
      "RUN_POLICY_BLOCKED",
      "Private network targets are blocked by policy",
    );
  }

  if (!isDomainAllowed(hostname, config.policy.domainAllowlist)) {
    throw new RunnerError(
      "RUN_POLICY_BLOCKED",
      "Target domain is not in the allowlist",
      { hostname },
    );
  }
};
