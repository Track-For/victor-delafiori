import type { MetadataRoute } from "next";
import { company } from "@/data/company";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: company.siteUrl, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${company.siteUrl}/projetos/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
