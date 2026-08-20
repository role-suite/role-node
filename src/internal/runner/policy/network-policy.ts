import { isIP } from "node:net";

import type { RequestRunnerEngineConfig } from "../config/engine-config.js";
import { RunnerError } from "../errors/runner-errors.js";

const normalizeHostname = (hostname: string): string => {
  return hostname.toLowerCase().replace(/^\[(.*)\]$/u, "$1");
};

const ipv4ToInt = (address: string): number | null => {
  const parts = address.split(".");

  if (parts.length !== 4) {
    return null;
  }

  let value = 0;

  for (const part of parts) {
    if (!/^\d{1,3}$/u.test(part)) {
      return null;
    }

    const octet = Number(part);

    if (octet < 0 || octet > 255) {
      return null;
    }

    value = (value << 8) + octet;
  }

  return value >>> 0;
};

const isIpv4InCidr = (address: string, cidr: string): boolean => {
  const [rangeAddress, prefixText] = cidr.split("/");
  const prefix = prefixText === undefined ? 32 : Number(prefixText);
  const addressInt = ipv4ToInt(address);
  const rangeInt = ipv4ToInt(rangeAddress ?? "");

  if (
    addressInt === null ||
    rangeInt === null ||
    !Number.isInteger(prefix) ||
    prefix < 0 ||
    prefix > 32
  ) {
    return false;
  }

  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return (addressInt & mask) === (rangeInt & mask);
};

const isIpv6InConfiguredRange = (address: string, cidr: string): boolean => {
  const normalizedAddress = normalizeHostname(address);
  const normalizedCidr = normalizeHostname(cidr);

  if (!normalizedCidr.includes("/")) {
    return normalizedAddress === normalizedCidr;
  }

  if (normalizedCidr === "fc00::/7") {
    return (
      normalizedAddress.startsWith("fc") || normalizedAddress.startsWith("fd")
    );
  }

  return false;
};

const isLocalHostname = (hostname: string): boolean => {
  const normalized = normalizeHostname(hostname);
  return (
    normalized === "localhost" ||
    isIpv4InCidr(normalized, "127.0.0.0/8") ||
    normalized === "::1"
  );
};

const isDomainAllowed = (hostname: string, allowlist: string[]): boolean => {
  if (allowlist.length === 0) {
    return true;
  }

  return allowlist.some((allowed) => {
    const normalized = normalizeHostname(allowed);
    return hostname === normalized || hostname.endsWith(`.${normalized}`);
  });
};

const isBlockedByConfiguredCidr = (
  hostname: string,
  cidrs: string[],
): boolean => {
  const ipVersion = isIP(hostname);

  if (ipVersion === 4) {
    return cidrs.some((cidr) => isIpv4InCidr(hostname, cidr));
  }

  if (ipVersion === 6) {
    return cidrs.some((cidr) => isIpv6InConfiguredRange(hostname, cidr));
  }

  return false;
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

  const hostname = normalizeHostname(parsed.hostname);

  if (config.policy.blockLocalhost && isLocalHostname(hostname)) {
    throw new RunnerError(
      "RUN_POLICY_BLOCKED",
      "Localhost targets are blocked by policy",
    );
  }

  if (
    config.policy.blockPrivateCidrs.length > 0 &&
    isBlockedByConfiguredCidr(hostname, config.policy.blockPrivateCidrs)
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
