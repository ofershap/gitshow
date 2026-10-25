"use client";

import { useEffect } from "react";

type ModelContextLike = {
  registerTool: (tool: {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    annotations?: Record<string, unknown>;
    execute: (args: Record<string, string>) => unknown;
  }) => unknown;
};

/**
 * WebMCP (developer.chrome.com/docs/ai/webmcp): expose gitshow tools to
 * in-browser AI agents via the Imperative API. Feature-detected; a no-op in
 * browsers without WebMCP support.
 */
export function WebMcpTools() {
  useEffect(() => {
    const mc = (document as Document & { modelContext?: ModelContextLike })
      .modelContext;
    if (!mc || typeof mc.registerTool !== "function") return;
    try {
      mc.registerTool({
        name: "view_portfolio",
        description:
          "Open the gitshow developer portfolio for a GitHub username in this tab.",
        inputSchema: {
          type: "object",
          properties: {
            username: {
              type: "string",
              description: "GitHub username, e.g. ofershap",
            },
          },
          required: ["username"],
        },
        execute: ({ username }) => {
          const clean = String(username || "").replace(/^@/, "").trim();
          if (!clean) return { error: "username is required" };
          const url = `${window.location.origin}/${encodeURIComponent(clean)}`;
          window.location.assign(url);
          return { url };
        },
      });
      mc.registerTool({
        name: "get_author_card",
        description:
          "Get the gitshow author-card image URL for a GitHub username, plus a ready markdown snippet to embed it in a README.",
        inputSchema: {
          type: "object",
          properties: {
            username: {
              type: "string",
              description: "GitHub username, e.g. ofershap",
            },
          },
          required: ["username"],
        },
        annotations: { readOnlyHint: true },
        execute: ({ username }) => {
          const clean = String(username || "").replace(/^@/, "").trim();
          if (!clean) return { error: "username is required" };
          const cardUrl = `${window.location.origin}/api/card/${encodeURIComponent(clean)}`;
          const profileUrl = `${window.location.origin}/${encodeURIComponent(clean)}`;
          return {
            cardUrl,
            markdown: `[![${clean}'s gitshow card](${cardUrl})](${profileUrl})`,
          };
        },
      });
    } catch {
      // WebMCP unavailable or registration rejected: stay silent
    }
  }, []);
  return null;
}
