declare global {
  namespace Express {
    interface Request {
      requestId?: string;
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
