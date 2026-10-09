import type { CaseStudy } from "../content/types";
import { portfolioImage } from "../content/images";
import { DeviceFrame } from "./DeviceFrame";
import { ProjectPreview } from "./ProjectPreview";

export function ProjectMedia({
  project,
  prominent = false,
}: {
  project: CaseStudy;
  prominent?: boolean;
}) {
  if (!project.image) return <ProjectPreview project={project} />;
  // The LAH cover is a product brief, not a screenshot. Never place it in a fake app screen.
  const kind =
    project.category === "Web applications"
      ? "browser"
      : project.slug === "codeprobe-scanner"
        ? "desktop"
        : "artwork";
  return (
    <DeviceFrame kind={kind} title={project.name}>
      <img
        src={portfolioImage(project.image, prominent ? 1600 : 960)}
        alt={project.imageAlt}
        loading={prominent ? "eager" : "lazy"}
      />
    </DeviceFrame>
  );
}
