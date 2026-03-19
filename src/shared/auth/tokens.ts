import { createHmac, timingSafeEqual } from "node:crypto";

type AuthTokenType = "access" | "refresh";

type AuthTokenPayload = {
  sub: number;
  wid: number;
  sid: number;
  typ: AuthTokenType;
  iat: number;
  exp: number;
};

type CreateTokenInput = {
  userId: number;
  workspaceId: number;
  sessionId: number;
  type: AuthTokenType;
  ttlSeconds: number;
  secret: string;
};

const toBase64Url = (value: string): string => {
  return Buffer.from(value).toString("base64url");
};

const fromBase64Url = (value: string): string => {
  return Buffer.from(value, "base64url").toString("utf8");
};

const sign = (value: string, secret: string): string => {
  return createHmac("sha256", secret).update(value).digest("base64url");
};

const safeEqual = (a: string, b: string): boolean => {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
};

export const createAuthToken = ({
  userId,
  workspaceId,
  sessionId,
  type,
  ttlSeconds,
  secret,
}: CreateTokenInput): string => {
  const now = Math.floor(Date.now() / 1000);

  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = toBase64Url(
    JSON.stringify({
      sub: userId,
      wid: workspaceId,
      sid: sessionId,
      typ: type,
      iat: now,
      exp: now + ttlSeconds,
    } satisfies AuthTokenPayload),
  );

  const unsignedToken = `${header}.${payload}`;
  const signature = sign(unsignedToken, secret);

  return `${unsignedToken}.${signature}`;
};

const parseAuthToken = (
  token: string,
  secret: string,
): AuthTokenPayload | null => {
  const [header, payload, signature] = token.split(".");

  if (!header || !payload || !signature) {
    return null;
  }

  const unsignedToken = `${header}.${payload}`;
  const expectedSignature = sign(unsignedToken, secret);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const decodedPayload = JSON.parse(
      fromBase64Url(payload),
    ) as AuthTokenPayload;

    if (
      typeof decodedPayload.sub !== "number" ||
      typeof decodedPayload.wid !== "number" ||
      typeof decodedPayload.sid !== "number" ||
      (decodedPayload.typ !== "access" && decodedPayload.typ !== "refresh") ||
      typeof decodedPayload.iat !== "number" ||
      typeof decodedPayload.exp !== "number"
    ) {
      return null;
    }

    if (decodedPayload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decodedPayload;
  } catch {
    return null;
  }
};

export const verifyAccessToken = (
  token: string,
  secret: string,
): AuthTokenPayload | null => {
  const payload = parseAuthToken(token, secret);

  if (!payload || payload.typ !== "access") {
    return null;
  }

  return payload;
};

export const verifyRefreshToken = (
  token: string,
  secret: string,
): AuthTokenPayload | null => {
  const payload = parseAuthToken(token, secret);

  if (!payload || payload.typ !== "refresh") {
    return null;
  }

  return payload;
};

export type { AuthTokenPayload };
