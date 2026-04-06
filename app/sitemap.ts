import { MetadataRoute } from 'next';

const domain = 'https://brighthouse.website';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: domain,                     lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${domain}/shop`,           lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${domain}/about`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${domain}/contact`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${domain}/track-order`,    lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${domain}/returns`,        lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${domain}/privacy`,        lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${domain}/terms`,          lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },

    // Category pages
    { url: `${domain}/shop?category=pendant-lights`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${domain}/shop?category=floor-lamps`,    lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${domain}/shop?category=table-lamps`,    lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${domain}/shop?category=wall-sconces`,   lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${domain}/shop?category=ceiling-lights`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${domain}/shop?category=smart-lighting`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${domain}/shop?category=hcme-decor`,     lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${domain}/shop?category=outdoor`,        lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ];

  return staticPages;
}
