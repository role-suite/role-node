import { z } from "zod";

const keyValueSchema = z.object({
  key: z.string(),
  value: z.string(),
  enabled: z.boolean().optional(),
});

const httpMethodSchema = z.enum([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
]);

export const collectionSchema = z
  .object({
    id: z.number().int(),
    _id: z.number().int(),
    workspaceId: z.number().int(),
    name: z.string(),
    description: z.string().nullable(),
    createdByUserId: z.number().int(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .meta({ id: "Collection" });

export const collectionEndpointSchema = z
  .object({
    id: z.number().int(),
    collectionId: z.number().int(),
    folderId: z.number().int().nullable(),
    name: z.string(),
    method: httpMethodSchema,
    url: z.string(),
    headers: z.array(keyValueSchema).nullable(),
    queryParams: z.array(keyValueSchema).nullable(),
    body: z.unknown().nullable(),
    auth: z.unknown().nullable(),
    position: z.number().int(),
    createdByUserId: z.number().int(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .meta({ id: "CollectionEndpoint" });

export const collectionFolderSchema = z
  .object({
    id: z.number().int(),
    collectionId: z.number().int(),
    parentFolderId: z.number().int().nullable(),
    name: z.string(),
    position: z.number().int(),
    createdByUserId: z.number().int(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .meta({ id: "CollectionFolder" });

export const collectionEndpointExampleSchema = z
  .object({
    id: z.number().int(),
    endpointId: z.number().int(),
    name: z.string(),
    statusCode: z.number().int(),
    headers: z.array(keyValueSchema).nullable(),
    body: z.string().nullable(),
    position: z.number().int(),
    createdByUserId: z.number().int(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .meta({ id: "CollectionEndpointExample" });
