import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_AI_AGENTS = [
  "chatgpt-user",
  "oai-searchbot",
  "gptbot",
  "openai",
  "claudebot",
  "claude-web",
  "claude-user",
  "anthropic-ai",
  "perplexitybot",
  "perplexity-user",
  "ccbot",
  "cohere-ai",
  "bytespider",
  "meta-externalagent",
  "meta-externalfetcher",
  "facebookbot",
  "youbot",
  "diffbot",
  "omgili",
  "amazonbot",
  "applebot-extended",
  "deepseek",
  "mistral",
];

export function middleware(request: NextRequest) {
  const ua = (request.headers.get("user-agent") || "").toLowerCase();

  const isBlockedAi = BLOCKED_AI_AGENTS.some((bot) => ua.includes(bot));

  if (isBlockedAi) {
    return new NextResponse(
      "403 Forbidden: Automated AI assistants and external scrapers are blocked from accessing this academic showcase. Please view this site directly in a standard web browser.",
      {
        status: 403,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Robots-Tag": "noai, noimageai, noindex, nofollow",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noai, noimageai");
  return response;
}

export const config = {
  matcher: ["/:path*"],
};
