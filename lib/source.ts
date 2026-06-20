import { findNeighbour } from "fumadocs-core/page-tree";
import type { InferPageType } from "fumadocs-core/source";
import { loader } from "fumadocs-core/source";

import { docs } from "@/.source/server";
import { ROUTES } from "@/constants/routes";
import { AGENT_DOCS_DIRECTIVE_MARKDOWN } from "@/lib/agent-discovery/directive";
import { docsContentRoute, docsImageRoute } from "@/lib/docs";

export const source = loader({
  baseUrl: ROUTES.DOCS,
  source: docs.toFumadocsSource(),
});

const EVE_AGENT_PREFIX = `${ROUTES.DOCS_AGENTS}/eve/`;
const FLUE_AGENT_PREFIX = `${ROUTES.DOCS_AGENTS}/flue/`;

/**
 * Previous/next neighbours for a docs page.
 *
 * The Agents sidebar lists the Eve recipes plus a base switcher, so the Flue
 * recipe pages are absent from the page tree and `findNeighbour` returns nothing
 * for them. For those pages we mirror the Eve neighbours, rewriting Eve recipe
 * URLs to their Flue counterparts so the prev/next controls match the Eve view.
 */
export const getDocNeighbours = (url: string) => {
  if (!url.startsWith(FLUE_AGENT_PREFIX)) {
    return findNeighbour(source.pageTree, url);
  }

  const eve = findNeighbour(
    source.pageTree,
    url.replace(FLUE_AGENT_PREFIX, EVE_AGENT_PREFIX)
  );

  const toFlue = <T extends { url: string }>(node: T | undefined) =>
    node?.url.startsWith(EVE_AGENT_PREFIX)
      ? { ...node, url: node.url.replace(EVE_AGENT_PREFIX, FLUE_AGENT_PREFIX) }
      : node;

  return { next: toFlue(eve.next), previous: toFlue(eve.previous) };
};

export const getPageImage = (page: InferPageType<typeof source>) => {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join("/")}`,
  };
};

export const getPageMarkdownUrl = (page: InferPageType<typeof source>) => {
  const segments = [...page.slugs, "content.md"];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join("/")}`,
  };
};

export const getLLMText = async (page: InferPageType<typeof source>) => {
  const processed = await page.data.getText("processed");

  const sections = [
    page.data.description,
    AGENT_DOCS_DIRECTIVE_MARKDOWN,
    processed,
  ].filter(Boolean);

  return `# ${page.data.title}

${sections.join("\n\n")}`;
};
