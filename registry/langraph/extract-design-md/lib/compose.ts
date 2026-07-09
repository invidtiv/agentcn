import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { ContextDev } from "context.dev";

import { deriveCssVariables, deriveTailwindTheme } from "./derive-tokens";
import type { LiveBrand, LiveStyleguide } from "./derive-tokens";
import { buildDesignMdPrompt, DESIGN_MD_SYSTEM } from "./design-md";

const client = new ContextDev({
  apiKey: process.env.CONTEXT_DEV_API_KEY ?? "",
});

interface DesignSignals {
  styleguide: unknown;
  brand: unknown;
  screenshotUrl: string | null;
  markdown: string;
}

async function fetchSignals(domain: string): Promise<DesignSignals> {
  const [styleguide, brand, screenshot, markdown] = await Promise.all([
    client.web.extractStyleguide({ domain, timeoutMS: 120_000 }),
    client.brand.retrieve({ domain }),
    client.web.screenshot({
      domain,
      fullScreenshot: "false",
      handleCookiePopup: "true",
    }),
    client.web.webScrapeMd({
      includeImages: false,
      includeLinks: true,
      url: `https://${domain}`,
      useMainContentOnly: true,
    }),
  ]);

  return {
    brand: brand.brand ?? null,
    markdown: markdown.markdown ?? "",
    screenshotUrl: screenshot.screenshot ?? null,
    styleguide: styleguide.styleguide ?? null,
  };
}

async function generateDesignMd(
  domain: string,
  signals: DesignSignals
): Promise<string> {
  const prompt = buildDesignMdPrompt({
    contextStyleguide: signals.styleguide,
    domain,
    markdown: signals.markdown,
    screenshotUrl: signals.screenshotUrl ?? undefined,
  });

  const { text } = await generateText({
    messages: [
      {
        content: signals.screenshotUrl
          ? [
              { image: new URL(signals.screenshotUrl), type: "image" },
              { text: prompt, type: "text" },
            ]
          : [{ text: prompt, type: "text" }],
        role: "user",
      },
    ],
    model: anthropic("claude-sonnet-4-6"),
    system: DESIGN_MD_SYSTEM,
    temperature: 0.2,
  });

  return text.trim();
}

export interface DesignMdResult {
  designMd: string;
  tailwind: string;
  css: string;
}

export async function composeDesignMd(domain: string): Promise<DesignMdResult> {
  const signals = await fetchSignals(domain);
  const designMd = await generateDesignMd(domain, signals);
  const styleguide = signals.styleguide as LiveStyleguide | null;
  const brand = (signals.brand as LiveBrand | null) ?? undefined;

  return {
    css: deriveCssVariables(domain, brand, styleguide),
    designMd,
    tailwind: deriveTailwindTheme(domain, brand, styleguide),
  };
}
