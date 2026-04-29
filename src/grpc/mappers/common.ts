type PaginationInput = {
  limit: number;
  offset: number;
  total: number;
};

type PaginationOutput = PaginationInput & {
  hasNext: boolean;
};

export const toIsoTimestamp = (
  value: Date | string | null | undefined,
): string => {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toISOString();
};

export const toPagination = ({
  limit,
  offset,
  total,
}: PaginationInput): PaginationOutput => {
  return {
    limit,
    offset,
    total,
    hasNext: offset + limit < total,
  };
};

export const mapEnumValue = <T extends string>(
  value: string,
  allowedValues: readonly T[],
  fallback: T,
): T => {
  return allowedValues.includes(value as T) ? (value as T) : fallback;
};
