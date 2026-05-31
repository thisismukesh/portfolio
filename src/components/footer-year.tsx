"use client";

import { useSyncExternalStore } from "react";

// Renders the server-computed year on first paint (so there's no hydration
// mismatch), then corrects to the visitor's actual current year after mount.
// This keeps the copyright accurate even if the static page was built or last
// revalidated in a previous year. useSyncExternalStore is the React-recommended
// way to read from external sources like Date, exempt from set-state-in-effect.
const subscribe = () => () => {};
const getYear = () => new Date().getFullYear();

export function FooterYear({ initialYear }: { initialYear: number }) {
  const year = useSyncExternalStore(subscribe, getYear, () => initialYear);
  return <>{year}</>;
}
