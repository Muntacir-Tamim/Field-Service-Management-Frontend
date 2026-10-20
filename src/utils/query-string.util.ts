import type { SortOrder } from "@/types";

// backend list endpoint এর common param: ?page&limit&searchTerm&sortBy&sortOrder
export interface ListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

type ParamValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, ParamValue | ParamValue[]>;

// filter dropdown এ "All" বোঝাতে এই value ব্যবহার হয় (FilterBar দেখো)
export const ALL_VALUE = "ALL";

function isEmpty(value: unknown) {
  return (
    value === undefined || value === null || value === "" || value === ALL_VALUE
  );
}

// খালি / "ALL" / undefined বাদ দিয়ে clean object দেয়
// ofetch এর `query` option এ সরাসরি দেওয়া যায়: apiClient(url, { query: cleanParams(p) })
export function cleanParams<T extends QueryParams>(params?: T) {
  const result: Record<string, string | number | boolean | string[]> = {};
  if (!params) {
    return result;
  }
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      const items = value.filter((item) => !isEmpty(item)).map(String);
      if (items.length > 0) {
        result[key] = items;
      }
    } else if (!isEmpty(value)) {
      result[key] = value as string | number | boolean;
    }
  }
  return result;
}

// { page: 1, status: "ALL" } → "?page=1"
export function buildQueryString(params?: QueryParams) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(cleanParams(params))) {
    if (Array.isArray(value)) {
      for (const item of value) {
        search.append(key, item);
      }
    } else {
      search.set(key, String(value));
    }
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}
