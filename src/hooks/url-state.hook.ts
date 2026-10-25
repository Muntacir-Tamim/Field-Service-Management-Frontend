"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { type Dispatch, type SetStateAction, useCallback } from "react";

/**
 * Writes one query param straight to the URL (no navigation / re-fetch of the
 * route). It always reads `window.location.search`, so several updates made in
 * the same tick (e.g. set filter + reset page) compose instead of overwriting.
 */
function writeParam(pathname: string, key: string, value: string | null) {
  const params = new URLSearchParams(window.location.search);
  if (value === null || value === "") {
    params.delete(key);
  } else {
    params.set(key, value);
  }
  const qs = params.toString();
  window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
}

/**
 * `useState`-like hook whose value lives in the URL (`?key=value`), so filters,
 * search and sorting can be bookmarked and shared.
 */
export function useUrlState<T extends string>(
  key: string,
  defaultValue: T,
): [T, (next: T) => void] {
  const pathname = usePathname();
  const value = (useSearchParams().get(key) ?? defaultValue) as T;

  const setValue = useCallback(
    (next: T) => writeParam(pathname, key, next === defaultValue ? null : next),
    [pathname, key, defaultValue],
  );

  return [value, setValue];
}

/** Same idea for a 1-based page number (`?page=2`). */
export function useUrlPage(
  defaultPage = 1,
  key = "page",
): [number, Dispatch<SetStateAction<number>>] {
  const pathname = usePathname();
  const raw = Number(useSearchParams().get(key));
  const page = Number.isInteger(raw) && raw >= 1 ? raw : defaultPage;

  const setPage = useCallback<Dispatch<SetStateAction<number>>>(
    (action) => {
      const current = Number(
        new URLSearchParams(window.location.search).get(key),
      );
      const prev =
        Number.isInteger(current) && current >= 1 ? current : defaultPage;
      const next = typeof action === "function" ? action(prev) : action;
      writeParam(pathname, key, next === defaultPage ? null : String(next));
    },
    [pathname, key, defaultPage],
  );

  return [page, setPage];
}
