import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectViewer } from "@/components/viewer/ProjectViewer";
import { BreakdownStrip } from "@/components/project/BreakdownStrip";
import { ProjectVideo } from "@/components/project/ProjectVideo";
import { asset } from "@/lib/assets";
import { getNextProject, getProject, projects } from "@/lib/projects";
import { site } from "@/lib/site";

/** Every project page is prerendered at build time: no functions, no cost. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = getProject(params.slug);
  if (!project) return { title: "Not found" };

  const poster = asset(project.poster);

  return {
    title: project.title,
    description: project.blurb,
    openGraph: {
      title: `${project.title}: ${site.name}`,
      description: project.blurb,
      type: "article",
      images: poster ? [{ url: poster, alt: project.posterAlt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title}: ${site.name}`,
      description: project.blurb,
      images: poster ? [poster] : undefined,
    },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const next = getNextProject(project.slug);
  const position = projects.findIndex((p) => p.slug === project.slug) + 1;

  return (
    <>
      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <div className="border-b-2 border-divider">
        <div className="mx-auto flex max-w-page items-center justify-between px-4 py-[14px] min-[900px]:px-10">
          <Link
            href="/#portfolio"
            className="text-[12px] font-extrabold uppercase tracking-nav text-fg no-underline transition-colors duration-[140ms] ease-out hover:text-accent-400"
          >
            &larr; Portfolio
          </Link>
          <p className="text-[12px] uppercase tracking-nav text-fg-muted">
            <span className="min-[600px]:hidden">
              {project.index} / {String(projects.length).padStart(2, "0")}
            </span>
            <span className="hidden min-[600px]:inline">
              Project {project.index} of {String(projects.length).padStart(2, "0")}
            </span>
          </p>
        </div>
      </div>

      {/* ── Main split ──────────────────────────────────────────────────── */}
      <div className="mx-auto grid max-w-page grid-cols-1 border-b-2 border-divider min-[900px]:grid-cols-[1fr_340px] min-[1200px]:grid-cols-[1fr_400px]">
        {/* Left: the viewer stays dominant. */}
        <div className="min-[900px]:border-r-2 min-[900px]:border-divider">
          <ProjectViewer
            modelPath={project.model}
            poster={project.poster}
            posterAlt={project.posterAlt}
            className="h-[400px] w-full min-[900px]:h-[660px]"
          />

          {project.video && (
            <ProjectVideo
              src={project.video}
              poster={project.poster}
              title={`${project.title}: animation`}
            />
          )}

          <BreakdownStrip breakdowns={project.breakdowns} />
        </div>

        {/* Right: the support column. */}
        <div className="flex flex-col">
          <div className="border-b-2 border-divider px-4 py-6 min-[900px]:p-8">
            <p className="t-eyebrow mb-3 tracking-flag text-accent-400">
              {project.discipline} &middot; {project.year}
            </p>
            <h1 className="t-detail-h1 text-fg">
              {project.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </div>

          <div className="border-b-2 border-divider px-4 py-6 min-[900px]:px-8 min-[900px]:py-7">
            {project.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mb-4 text-[15px] leading-[1.6] text-fg last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {project.artstation && (
            <div className="border-b-2 border-divider px-4 py-4 min-[900px]:px-8">
              <a
                href={project.artstation}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 text-[13px] font-bold text-fg no-underline transition-colors duration-[140ms] ease-out hover:text-accent-400"
              >
                View the original post on ArtStation
                <span
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-[200ms] ease-out group-hover:translate-x-1 motion-reduce:transition-none"
                >
                  &rarr;
                </span>
              </a>
            </div>
          )}

          <div className="border-b-2 border-divider px-4 py-5 min-[900px]:px-8 min-[900px]:py-6">
            <p className="t-eyebrow mb-3 text-fg-muted">Tools</p>
            <ul className="flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <li
                  key={tool}
                  className="t-tag border border-divider px-[10px] py-[7px] text-fg min-[900px]:py-[6px]"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          <dl className="border-b-2 border-divider">
            {project.specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex items-baseline justify-between gap-4 px-4 py-3 min-[900px]:px-8 min-[900px]:py-[11px] ${
                  i > 0 ? "border-t border-divider-light" : ""
                }`}
              >
                <dt className="text-[11px] uppercase tracking-nav text-fg-muted">
                  {spec.label}
                </dt>
                <dd className="text-[13px] font-bold text-fg">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-1 flex-col justify-end px-4 py-6 min-[900px]:px-8 min-[900px]:py-7">
            <Link
              href={`/work/${next.slug}`}
              className="t-button inline-flex w-full items-center justify-center whitespace-nowrap border-2 border-divider bg-accent px-[18px] py-3 text-white no-underline transition-colors duration-[140ms] ease-out hover:bg-accent-700 min-[900px]:w-fit min-[900px]:justify-start"
            >
              Next: {next.title} &rarr;
            </Link>
            <p className="sr-only">
              Project {position} of {projects.length}.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
