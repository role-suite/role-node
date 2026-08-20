import { jwtVerify, SignJWT } from "jose";

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

const encodeSecret = (secret: string): Uint8Array => {
  return new TextEncoder().encode(secret);
};

export const createAuthToken = async ({
  userId,
  workspaceId,
  sessionId,
  type,
  ttlSeconds,
  secret,
}: CreateTokenInput): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({
    uid: userId,
    wid: workspaceId,
    sid: sessionId,
    typ: type,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setSubject(String(userId))
    .setExpirationTime(now + ttlSeconds)
    .sign(encodeSecret(secret));
};

const parseAuthToken = async (
  token: string,
  secret: string,
): Promise<AuthTokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, encodeSecret(secret), {
      algorithms: ["HS256"],
      typ: "JWT",
    });

    const decodedPayload = payload as Record<string, unknown>;

    if (
      typeof decodedPayload.sub !== "string" ||
      decodedPayload.sub !== String(decodedPayload.uid) ||
      typeof decodedPayload.uid !== "number" ||
      typeof decodedPayload.wid !== "number" ||
      typeof decodedPayload.sid !== "number" ||
      (decodedPayload.typ !== "access" && decodedPayload.typ !== "refresh") ||
      typeof decodedPayload.iat !== "number" ||
      typeof decodedPayload.exp !== "number"
    ) {
      return null;
    }

    return {
      sub: decodedPayload.uid,
      wid: decodedPayload.wid,
      sid: decodedPayload.sid,
      typ: decodedPayload.typ,
      iat: decodedPayload.iat,
      exp: decodedPayload.exp,
    } as AuthTokenPayload;
  } catch {
    return null;
  }
};

export const verifyAccessToken = async (
  token: string,
  secret: string,
): Promise<AuthTokenPayload | null> => {
  const payload = await parseAuthToken(token, secret);

  if (!payload || payload.typ !== "access") {
    return null;
  }

  return payload;
};

export const verifyRefreshToken = async (
  token: string,
  secret: string,
): Promise<AuthTokenPayload | null> => {
  const payload = await parseAuthToken(token, secret);

  if (!payload || payload.typ !== "refresh") {
    return null;
  }

  return payload;
};

export type { AuthTokenPayload };
