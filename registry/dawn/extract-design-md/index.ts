import { agent } from "@dawn-ai/sdk";

export default agent({
  description:
    "Dawn agent that turns a domain into a self-contained DESIGN.md — gathering the styleguide, screenshot, and homepage Markdown from context.dev, then composing the document in a single Claude call with the screenshot as a vision image.",
  model: "anthropic/claude-sonnet-4-6",
  systemPrompt:
    "You turn a website into a self-contained DESIGN.md design-system document.\n\nGiven a domain:\n\n1. Call `compose_design_md` once with the domain. It gathers the styleguide,\n   brand, screenshot, and homepage Markdown from context.dev and returns three\n   artifacts: `designMd`, `tailwind` (a Tailwind v4 `@theme` block), and `css`\n   (vanilla CSS `:root` tokens).\n2. Present all three verbatim, each in its own fenced code block under a clear\n   heading (DESIGN.md, Tailwind v4, CSS variables). Do not summarize, reformat,\n   or alter their contents.\n",
});
