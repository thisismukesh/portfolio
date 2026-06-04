/** @type {import('next').NextConfig} */

// Strict CSP for the public site. Locks scripts/styles/connects to the
// origins we actually use; nothing third-party can inject. The Studio is
// exempted (separate, looser policy below) because Sanity's embedded
// Studio uses inline scripts/styles internally and won't load under
// strict CSP. It's already behind Sanity's own login.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://i.scdn.co",
  "font-src 'self' data:",
  "connect-src 'self' https://1h4duye7.api.sanity.io https://1h4duye7.apicdn.sanity.io",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Studio needs broader permissions for Sanity's UI to function (Portable
// Text editor, image pipeline, vision tool, asset CDN, etc).
const studioCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline' https://*.sanity-cdn.com",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https://*.sanity-cdn.com",
  "font-src 'self' data: https://*.sanity.io https://*.sanity-cdn.com",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.sanity-cdn.com",
  "media-src 'self' https://*.sanity.io https://*.sanity-cdn.com",
  "frame-src 'self' https://*.sanity.io https://*.sanity-cdn.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  // The site can never be embedded as a frame on another origin (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Browsers must respect the declared Content-Type, no sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak the path/query to third parties via Referer; send origin only.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down powerful browser APIs we don't use.
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=()",
      "usb=()",
      "interest-cohort=()",
    ].join(", "),
  },
  // 2-year HSTS with preload, includeSubDomains. Vercel sets a baseline HSTS
  // already; this header reinforces the policy.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Spotify album art for the "song of the day" tile.
      { protocol: "https", hostname: "i.scdn.co" },
    ],
  },
  async headers() {
    return [
      {
        // Strict CSP everywhere except the embedded Studio.
        source: "/((?!studio).*)",
        headers: [
          ...securityHeaders,
          { key: "Content-Security-Policy", value: csp },
        ],
      },
      {
        // Looser CSP for Studio so Sanity's UI can load. Other security
        // headers still apply.
        source: "/studio/:path*",
        headers: [
          ...securityHeaders,
          { key: "Content-Security-Policy", value: studioCsp },
        ],
      },
    ];
  },
};

export default nextConfig;
