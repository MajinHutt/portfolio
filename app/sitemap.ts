import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

/**
 * Generated at build time into a static sitemap.xml. Admissions tutors and
 * recruiters find this site by name, so the sitemap is mostly about making sure
 * every project page is indexed rather than only the homepage.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/contact", "/cv"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date("2026-08-28"),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${site.url}/work/${project.slug}`,
    lastModified: new Date("2026-08-28"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
