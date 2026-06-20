import Link from "next/link";

import { AGENTS } from "@/constants/agents";
import type { FrameworkId } from "@/constants/agents";
import { cn } from "@/lib/utils";

export const AgentsList = ({
  framework,
  className,
}: {
  framework?: FrameworkId;
  className?: string;
}) => {
  const agents = framework
    ? AGENTS.filter((a) => a.frameworks.includes(framework))
    : AGENTS;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20",
        className
      )}
    >
      {agents.map((agent) => (
        <Link
          key={agent.slug}
          href={`/docs/agents/${framework ?? "eve"}/${agent.slug}`}
          className="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base"
        >
          {agent.shortTitle}
        </Link>
      ))}
    </div>
  );
};
