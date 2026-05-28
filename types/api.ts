export type UUID = string;
export type ISODateString = string; // e.g. "2026-01-01T10:00:00.000Z"

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export type ApiListMeta = {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
};

export type ApiListResponse<T> = {
  items: T[];
  meta: ApiListMeta;
};

// اگر بک‌اند شما wrapper دارد (مثلا {data, success}) از این استفاده کن:
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

// برای payloadهای jsonb مثل shipping_address / variant_details
export type JsonRecord = Record<string, JsonValue>;
