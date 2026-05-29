import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

// When no project is configured we still need a valid client object so module
// load doesn't throw — the query layer guards on `sanityConfigured` and never
// actually calls it, returning fallback content instead.
export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  // Pull from the edge CDN in production; revalidation is handled by Next ISR.
  useCdn: true,
  perspective: "published",
});
