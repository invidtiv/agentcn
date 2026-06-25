import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";
import vitest from "ultracite/oxlint/vitest";

export default defineConfig({
  extends: [core, react, next, vitest],
  ignorePatterns: [
    "public/r/**",
    "registry/eve/**",
    "registry/flue/**",
    // Verbatim context.dev ports, kept byte-faithful to upstream.
    "lib/preview/seo-audit/**",
    "lib/preview/design-md/derive-tokens.ts",
    "lib/preview/design-md/prompt.ts",
    ".agents/**",
    ".cursor/**",
    ".changeset/**",
    ".claude/**",
    ".web-kits/**",
    "audio/**",
  ],
});
