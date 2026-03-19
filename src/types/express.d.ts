declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      userId: number;
      workspaceId: number;
      role: "owner" | "admin" | "member";
      sessionId: number;
    };
  }
}

export {};
