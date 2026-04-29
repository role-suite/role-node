export const parseRunCreatePayload = <T>(payloadJson: string): T => {
  return JSON.parse(payloadJson) as T;
};

export const toGrpcRunResponse = (run: unknown): { run_json: string } => {
  return { run_json: JSON.stringify(run) };
};
