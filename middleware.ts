import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_UA_PATTERNS = [
  "chatgpt",
  "oai-searchbot",
  "gptbot",
  "openai",
  "bingbot",
  "msnbot",
  "bingpreview",
  "adidxbot",
  "claudebot",
  "claude-web",
  "claude-user",
  "anthropic",
  "perplexity",
  "ccbot",
  "cohere-ai",
  "bytespider",
  "meta-external",
  "facebookexternalhit",
  "facebookbot",
  "youbot",
  "diffbot",
  "omgili",
  "amazonbot",
  "applebot-extended",
  "deepseek",
  "mistral",
  "headlesschrome",
  "phantomjs",
  "puppeteer",
  "playwright",
  "selenium",
  "python-requests",
  "python-urllib",
  "aiohttp",
  "httpx",
  "node-fetch",
  "undici",
  "axios",
  "go-http-client",
  "okhttp",
  "scrapy",
  "curl/",
  "wget/",
];

const CHALLENGE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noai, noimageai" />
  <title>Protected Academic Portal</title>
  <style>
    body {
      margin: 0;
      min-height: 100dvh;
      display: grid;
      place-items: center;
      font-family: system-ui, -apple-system, sans-serif;
      background: #09090b;
      color: #a1a1aa;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <noscript>
    <p>403 Forbidden: Automated AI assistants (including ChatGPT) and non-browser fetchers are blocked from accessing this portal.</p>
  </noscript>
  <div id="gate-msg" aria-live="polite">Verifying browser session...</div>
  <script>
    (function () {
      try {
        var ua = (navigator.userAgent || "").toLowerCase();
        var isHeadless =
          navigator.webdriver === true ||
          /headless|chatgpt|gptbot|oai-searchbot|claudebot|perplexity|phantomjs|puppeteer|playwright/i.test(ua);
        if (isHeadless) {
          document.getElementById("gate-msg").textContent =
            "403 Forbidden: Automated AI browsing is blocked on this portal.";
          return;
        }
        requestAnimationFrame(function () {
          var token = "v1_" + Math.floor(Date.now() / 60000);
          document.cookie = "_aa_verified=" + token + "; path=/; max-age=7200; SameSite=Lax";
          window.location.replace(window.location.pathname + window.location.search + window.location.hash);
        });
      } catch (e) {}
    })();
  </script>
</body>
</html>`;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets (images, videos, fonts, next static chunks) once page loads
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/logos/") ||
    pathname.startsWith("/members/") ||
    pathname.startsWith("/theorist/") ||
    pathname.startsWith("/videos/") ||
    pathname === "/icon.png" ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt"
  ) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet, noai, noimageai");
    return res;
  }

  // Allow owner's Antigravity agent via private header
  if (request.headers.get("x-agy-agent") === "blueteeth") {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet, noai, noimageai");
    res.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
    return res;
  }

  const ua = (request.headers.get("user-agent") || "").toLowerCase();
  const referer = (request.headers.get("referer") || "").toLowerCase();

  // Hard block any known AI crawler, search indexer used by ChatGPT (Bing), or referer from ChatGPT
  const isBlockedAgent =
    !ua ||
    BLOCKED_UA_PATTERNS.some((pattern) => ua.includes(pattern)) ||
    referer.includes("chatgpt.com") ||
    referer.includes("chat.openai.com") ||
    referer.includes("claude.ai") ||
    referer.includes("perplexity.ai");

  if (isBlockedAgent) {
    return new NextResponse(
      "403 Forbidden: Automated AI assistants (including ChatGPT) and external crawlers are strictly blocked from accessing this site.",
      {
        status: 403,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noai, noimageai",
          "Cache-Control": "private, no-store, no-cache, must-revalidate",
        },
      }
    );
  }

  // Require real browser JS cookie handshake before serving any HTML content
  const verifiedCookie = request.cookies.get("_aa_verified")?.value || "";
  if (!verifiedCookie.startsWith("v1_")) {
    return new NextResponse(CHALLENGE_HTML, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noai, noimageai",
        "Cache-Control": "private, no-store, no-cache, must-revalidate",
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet, noai, noimageai");
  response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
  return response;
}

export const config = {
  matcher: ["/:path*"],
};
