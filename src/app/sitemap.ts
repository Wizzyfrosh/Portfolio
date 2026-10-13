import type { MetadataRoute } from "next";

const baseUrl = "https://www.froshcodeorbit.site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/resume`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
