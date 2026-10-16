import type { Collection, CollectionEndpointExample } from "./repo.js";

export type CollectionResponse = {
  id: number;
  _id: number;
  workspaceId: number;
  name: string;
  description: string | null;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type EndpointKeyValue = {
  key: string;
  value: string;
  enabled?: boolean;
};

export type CollectionEndpointExampleResponse = {
  id: number;
  endpointId: number;
  name: string;
  statusCode: number;
  headers: EndpointKeyValue[];
  body: string | null;
  position: number;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

export const asKeyValueList = (value: unknown): EndpointKeyValue[] => {
  return Array.isArray(value) ? (value as EndpointKeyValue[]) : [];
};

export const mapCollection = (collection: Collection): CollectionResponse => {
  return {
    id: collection.id,
    _id: collection.id,
    workspaceId: collection.workspaceId,
    name: collection.name,
    description: collection.description,
    createdByUserId: collection.createdByUserId,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
  };
};

export const mapExample = (
  example: CollectionEndpointExample,
): CollectionEndpointExampleResponse => {
  return {
    id: example.id,
    endpointId: example.endpointId,
    name: example.name,
    statusCode: example.statusCode,
    headers: asKeyValueList(example.headers),
    body: example.body,
    position: example.position,
    createdByUserId: example.createdByUserId,
    createdAt: example.createdAt,
    updatedAt: example.updatedAt,
  };
};
