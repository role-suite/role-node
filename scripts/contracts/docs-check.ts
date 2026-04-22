import { execSync } from "node:child_process";

const SNAPSHOT_PATH = "contracts/generated/public-api.snapshot.json";

const DOC_PATH_PREFIXES = [
  "docs/",
  "contracts/README.md",
  "README.md",
  "CHANGELOG.md",
];

const resolveBaseRefCandidates = (): string[] => {
  const envRef = process.env.CONTRACT_BASE_REF?.trim();

  return [envRef, "origin/main", "HEAD~1"].filter(
    (value): value is string => Boolean(value && value.length > 0),
  );
};

const getChangedFiles = (baseRef: string): string[] => {
  const diff = execSync(`git diff --name-only ${baseRef}...HEAD`, {
    encoding: "utf8",
  });

  return diff
    .split("\n")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
};

const hasDocsUpdate = (changedFiles: string[]): boolean => {
  return changedFiles.some((file) => {
    return DOC_PATH_PREFIXES.some((prefix) => file.startsWith(prefix));
  });
};

const runDocsGuard = (): number => {
  let changedFiles: string[] | null = null;

  for (const baseRef of resolveBaseRefCandidates()) {
    try {
      changedFiles = getChangedFiles(baseRef);
      break;
    } catch {
      continue;
    }
  }

  if (!changedFiles) {
    console.log(
      "Skipping docs guard: could not diff against configured refs.",
    );
    return 0;
  }

  const contractChanged = changedFiles.includes(SNAPSHOT_PATH);

  if (!contractChanged) {
    console.log("No contract artifact change detected; docs guard passed.");
    return 0;
  }

  if (!hasDocsUpdate(changedFiles)) {
    console.error("Contract artifact changed but docs were not updated.");
    console.error(
      "Update at least one docs file (for example docs/guides/client-integration.md or contracts/README.md).",
    );
    return 1;
  }

  console.log("Docs guard passed for contract change.");
  return 0;
};

process.exit(runDocsGuard());
