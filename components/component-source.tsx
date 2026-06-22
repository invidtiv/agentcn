import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper";
import { CopyButton } from "@/components/copy-button";
import { getIconForLanguageExtension } from "@/components/icons";
import { highlightCode } from "@/lib/highlight-code";
import { readFileFromRoot } from "@/lib/read-file";
import { cn } from "@/lib/utils";

const LANG_MAP: Record<string, string> = {
  css: "css",
  js: "js",
  json: "json",
  jsx: "jsx",
  md: "markdown",
  mdx: "mdx",
  ts: "ts",
  tsx: "tsx",
  yaml: "yaml",
  yml: "yaml",
};

const getLang = (filePath: string) => {
  const ext = filePath.split(".").pop() ?? "";
  return LANG_MAP[ext] ?? ext;
};

export const ComponentSource = async ({
  src,
  title,
  language,
  collapsible = true,
  className,
}: {
  src: string;
  title?: string;
  language?: string;
  collapsible?: boolean;
  className?: string;
}) => {
  const code = await readFileFromRoot(src);

  if (!code) {
    return null;
  }

  const lang = language ?? getLang(src);
  const highlightedCode = await highlightCode(code.trimEnd(), lang);

  const figure = (
    <figure
      data-rehype-pretty-code-figure=""
      className={cn("[&>pre]:max-h-96", className)}
    >
      {title && (
        <figcaption
          data-rehype-pretty-code-title=""
          className="text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70"
          data-language={lang}
        >
          {getIconForLanguageExtension(lang)}
          {title}
        </figcaption>
      )}
      <CopyButton value={code.trimEnd()} />
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  );

  if (!collapsible) {
    return <div className="relative">{figure}</div>;
  }

  return (
    <CodeCollapsibleWrapper className={className}>
      {figure}
    </CodeCollapsibleWrapper>
  );
};
