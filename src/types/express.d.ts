declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: number;
        workspaceId: number;
        role: "owner" | "admin" | "member";
        sessionId: number;
      };
    }
  }
}

export {};
