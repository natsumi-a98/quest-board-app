import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

// Extract origin (scheme + host) from API base URL for CSP
function getApiOrigin(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return url;
  }
}

const apiOrigin = getApiOrigin(apiBaseUrl);

const ContentSecurityPolicy = [
  "default-src 'self'",
  // Next.js requires 'unsafe-inline' for inline styles and scripts in development
  // In production, Next.js uses nonces or hashes for scripts (handled per-request via middleware for full nonce support)
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  `connect-src 'self' ${apiOrigin} https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com`,
  "img-src 'self' data: blob:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
]
  .join("; ")
  .trim();

const nextConfig: NextConfig = {
  transpilePackages: ["@quest-board/types"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
