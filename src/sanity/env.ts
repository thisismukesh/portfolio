export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

// True only when a project is configured. Drives the fallback-content path so
// the site renders before Sanity credentials are wired up.
export const sanityConfigured = projectId.length > 0;
