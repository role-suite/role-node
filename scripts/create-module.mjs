import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const rawModuleName = process.argv[2]?.trim();

if (!rawModuleName) {
  console.error("Usage: pnpm create:module <module-name>");
  process.exit(1);
}

if (!/^[a-z][a-z0-9-]*$/.test(rawModuleName)) {
  console.error(
    "Module name must match /^[a-z][a-z0-9-]*$/ (example: audit-logs)",
  );
  process.exit(1);
}

const toPascal = (value) => {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
};

const toCamel = (value) => {
  const pascal = toPascal(value);
  return pascal[0].toLowerCase() + pascal.slice(1);
};

const singularize = (value) => {
  if (value.endsWith("ies") && value.length > 3) {
    return `${value.slice(0, -3)}y`;
  }

  if (value.endsWith("s") && value.length > 1) {
    return value.slice(0, -1);
  }

  return value;
};

const moduleName = rawModuleName;
const singularName = singularize(moduleName);
const modulePascal = toPascal(moduleName);
const moduleCamel = toCamel(moduleName);
const singularPascal = toPascal(singularName);

const rootDir = process.cwd();
const moduleDir = path.join(rootDir, "src", "modules", moduleName);
const unitTestsDir = path.join(rootDir, "tests", "unit");
const integrationTestsDir = path.join(rootDir, "tests", "integration");

const files = new Map([
  [
    path.join(moduleDir, `${moduleName}.schema.ts`),
    `import { z } from "zod";

export const create${singularPascal}Schema = z.object({
  name: z.string().min(2).max(120)
});

export const ${singularName}IdSchema = z.object({
  id: z.coerce.number().int().positive()
});

export type Create${singularPascal}Input = z.infer<typeof create${singularPascal}Schema>;
`,
  ],
  [
    path.join(moduleDir, `${moduleName}.repo.ts`),
    `import type { Create${singularPascal}Input } from "./${moduleName}.schema.js";

export type ${singularPascal}Entity = {
  id: number;
  name: string;
  createdAt: Date;
};

const ${moduleCamel}Table: ${singularPascal}Entity[] = [];
let currentId = 1;

export const ${moduleCamel}Repo = {
  findAll(): ${singularPascal}Entity[] {
    return ${moduleCamel}Table;
  },

  findById(id: number): ${singularPascal}Entity | undefined {
    return ${moduleCamel}Table.find((entity) => entity.id === id);
  },

  create(payload: Create${singularPascal}Input): ${singularPascal}Entity {
    const entity: ${singularPascal}Entity = {
      id: currentId++,
      name: payload.name,
      createdAt: new Date()
    };

    ${moduleCamel}Table.push(entity);
    return entity;
  },

  clear(): void {
    ${moduleCamel}Table.length = 0;
    currentId = 1;
  }
};
`,
  ],
  [
    path.join(moduleDir, `${moduleName}.service.ts`),
    `import { appResponse } from "../../shared/app-response.js";

import { ${moduleCamel}Repo } from "./${moduleName}.repo.js";
import type { Create${singularPascal}Input } from "./${moduleName}.schema.js";

export const ${moduleCamel}Service = {
  list${modulePascal}() {
    return ${moduleCamel}Repo.findAll();
  },

  get${singularPascal}ById(id: number) {
    const entity = ${moduleCamel}Repo.findById(id);

    if (!entity) {
      throw appResponse.withStatus(404, "${singularPascal} not found");
    }

    return entity;
  },

  create${singularPascal}(payload: Create${singularPascal}Input) {
    return ${moduleCamel}Repo.create(payload);
  }
};
`,
  ],
  [
    path.join(moduleDir, `${moduleName}.controller.ts`),
    `import type { Request, Response } from "express";

import { appResponse } from "../../shared/app-response.js";
import { create${singularPascal}Schema, ${singularName}IdSchema } from "./${moduleName}.schema.js";
import { ${moduleCamel}Service } from "./${moduleName}.service.js";

export const ${moduleCamel}Controller = {
  list(req: Request, res: Response): void {
    const entities = ${moduleCamel}Service.list${modulePascal}();
    appResponse.sendSuccess(res, 200, entities);
  },

  getById(req: Request, res: Response): void {
    const { id } = ${singularName}IdSchema.parse(req.params);
    const entity = ${moduleCamel}Service.get${singularPascal}ById(id);
    appResponse.sendSuccess(res, 200, entity);
  },

  create(req: Request, res: Response): void {
    const payload = create${singularPascal}Schema.parse(req.body);
    const entity = ${moduleCamel}Service.create${singularPascal}(payload);
    appResponse.sendSuccess(res, 201, entity);
  }
};
`,
  ],
  [
    path.join(moduleDir, `${moduleName}.route.ts`),
    `import { Router } from "express";

import { ${moduleCamel}Controller } from "./${moduleName}.controller.js";

export const ${moduleCamel}Router = Router();

${moduleCamel}Router.get("/", ${moduleCamel}Controller.list);
${moduleCamel}Router.get("/:id", ${moduleCamel}Controller.getById);
${moduleCamel}Router.post("/", ${moduleCamel}Controller.create);
`,
  ],
  [
    path.join(unitTestsDir, `${moduleName}.schema.test.ts`),
    `import { describe, expect, it } from "vitest";

import { create${singularPascal}Schema, ${singularName}IdSchema } from "../../src/modules/${moduleName}/${moduleName}.schema.js";

describe("${moduleName} schema", () => {
  it("parses valid create payload", () => {
    const payload = create${singularPascal}Schema.parse({
      name: "Template ${singularPascal}"
    });

    expect(payload.name).toBe("Template ${singularPascal}");
  });

  it("rejects invalid create payload", () => {
    const result = create${singularPascal}Schema.safeParse({ name: "A" });
    expect(result.success).toBe(false);
  });

  it("coerces route param id to number", () => {
    const parsed = ${singularName}IdSchema.parse({ id: "12" });
    expect(parsed.id).toBe(12);
  });
});
`,
  ],
  [
    path.join(unitTestsDir, `${moduleName}.repo.test.ts`),
    `import { beforeEach, describe, expect, it } from "vitest";

import { ${moduleCamel}Repo } from "../../src/modules/${moduleName}/${moduleName}.repo.js";

describe("${moduleName} repo", () => {
  beforeEach(() => {
    ${moduleCamel}Repo.clear();
  });

  it("creates entities with incrementing ids", () => {
    const first = ${moduleCamel}Repo.create({ name: "First" });
    const second = ${moduleCamel}Repo.create({ name: "Second" });

    expect(first.id).toBe(1);
    expect(second.id).toBe(2);
  });

  it("finds entity by id", () => {
    const created = ${moduleCamel}Repo.create({ name: "Find" });
    expect(${moduleCamel}Repo.findById(created.id)).toEqual(created);
  });
});
`,
  ],
  [
    path.join(unitTestsDir, `${moduleName}.service.test.ts`),
    `import { beforeEach, describe, expect, it } from "vitest";

import { appResponse } from "../../src/shared/app-response.js";
import { ${moduleCamel}Repo } from "../../src/modules/${moduleName}/${moduleName}.repo.js";
import { ${moduleCamel}Service } from "../../src/modules/${moduleName}/${moduleName}.service.js";

describe("${moduleName} service", () => {
  beforeEach(() => {
    ${moduleCamel}Repo.clear();
  });

  it("lists entities", () => {
    ${moduleCamel}Service.create${singularPascal}({ name: "One" });
    ${moduleCamel}Service.create${singularPascal}({ name: "Two" });

    const items = ${moduleCamel}Service.list${modulePascal}();
    expect(items).toHaveLength(2);
  });

  it("throws centralized error when entity is missing", () => {
    expect.assertions(1);

    try {
      ${moduleCamel}Service.get${singularPascal}ById(999);
    } catch (error) {
      expect(error).toMatchObject(
        appResponse.withStatus(404, "${singularPascal} not found")
      );
    }
  });
});
`,
  ],
  [
    path.join(integrationTestsDir, `${moduleName}.test.ts`),
    `import { describe, it } from "vitest";

describe.skip("${moduleName} integration", () => {
  it("register module router in src/app.ts and implement endpoint assertions", () => {
    // template placeholder
  });
});
`,
  ],
]);

await mkdir(moduleDir, { recursive: true });
await mkdir(unitTestsDir, { recursive: true });
await mkdir(integrationTestsDir, { recursive: true });

for (const [filePath, content] of files.entries()) {
  await writeFile(filePath, content, { flag: "wx" });
}

console.log(`Created module template for '${moduleName}'.`);
console.log(
  `Next: register ${moduleCamel}Router in src/app.ts and unskip tests.`,
);
