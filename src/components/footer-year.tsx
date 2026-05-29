"use client";

import { useEffect, useState } from "react";

// Renders the server-computed year on first paint (so there's no hydration
// mismatch), then corrects to the visitor's actual current year after mount.
// This keeps the copyright accurate even if the static page was built or last
// revalidated in a previous year.
export function FooterYear({ initialYear }: { initialYear: number }) {
  const [year, setYear] = useState(initialYear);

  useEffect(() => {
    const current = new Date().getFullYear();
    if (current !== year) setYear(current);
  }, [year]);

  return <>{year}</>;
}
