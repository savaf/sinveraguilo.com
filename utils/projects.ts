// Rotating accent colors for the neo-brutalist project cards
export const PROJECT_ACCENTS = ["#22d3ee", "#6366f1", "#facc15"];

export interface ProjectLike {
  title: string;
  slug: string;
  image: string;
  tags?: string[];
  technologies?: string[];
}

export function projectAccent(index: number): string {
  return PROJECT_ACCENTS[index % PROJECT_ACCENTS.length];
}

// Primary category chip, derived from the project tags
export function projectCategory(project: ProjectLike): string {
  const tags = project.tags || [];
  if (tags.includes("Landing")) return "Landing";
  if (tags.includes("Frontend")) return "Frontend";
  return tags[0] || "Project";
}

// Short "tech stack" line shown under a card title
export function projectStack(project: ProjectLike): string {
  return (project.technologies || []).slice(0, 3).join(" · ");
}
