import { NextStudio } from "next-sanity/studio";
import { sanityConfigured } from "@/sanity/env";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily: "ui-monospace, monospace",
          background: "#16181d",
          color: "#cfcfcf",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        <div style={{ maxWidth: 460 }}>
          <strong>Sanity Studio is not configured.</strong>
          <p>
            Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and{" "}
            <code>NEXT_PUBLIC_SANITY_DATASET</code>) in your environment, then
            reload. See <code>.env.local.example</code>.
          </p>
        </div>
      </div>
    );
  }
  return <NextStudio config={config} />;
}
