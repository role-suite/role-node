export const parseImportExportPayload = <T>(payloadJson: string): T => {
  return JSON.parse(payloadJson) as T;
};

export const toGrpcImportExportJob = (job: unknown): { job_json: string } => {
  return { job_json: JSON.stringify(job) };
};

export const toGrpcImportExportJobs = (
  jobs: unknown[],
): { jobs_json: string[] } => {
  return { jobs_json: jobs.map((item) => JSON.stringify(item)) };
};
