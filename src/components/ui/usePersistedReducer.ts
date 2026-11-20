"use client";

import { useCallback, useEffect, useReducer, type Dispatch } from "react";

type Hydrate<S> = { type: "__hydrate"; state: S };

/**
 * useReducer + autosave localStorage, bebas hydration mismatch:
 * render pertama selalu memakai `initial` (sama dengan server), data tersimpan dimuat setelah mount.
 * State awal (referensi `initial`) tidak pernah ditulis supaya tidak menimpa data tersimpan.
 * Reducer yang "mereset" sebaiknya mengembalikan salinan `initial` agar reset ikut tersimpan.
 */
export function usePersistedReducer<S, A extends { type: string }>(
  key: string,
  reducer: (state: S, action: A) => S,
  initial: S,
  parse: (raw: string | null) => S | null,
): [S, Dispatch<A>] {
  const wrapped = useCallback(
    (state: S, action: A | Hydrate<S>): S =>
      action.type === "__hydrate" ? (action as Hydrate<S>).state : reducer(state, action as A),
    [reducer],
  );
  const [state, dispatch] = useReducer(wrapped, initial);

  useEffect(() => {
    try {
      const stored = parse(window.localStorage.getItem(key));
      if (stored) dispatch({ type: "__hydrate", state: stored });
    } catch {
      // localStorage tidak tersedia — tetap pakai data awal
    }
  }, [key, parse]);

  useEffect(() => {
    if (state === initial) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // kuota penuh / diblokir
    }
  }, [key, state, initial]);

  return [state, dispatch as Dispatch<A>];
}
