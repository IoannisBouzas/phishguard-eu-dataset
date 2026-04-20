// Pure in-memory data layer — reads dataset.json at module load time.
// No native binaries, no SQLite. Works in Vercel serverless functions.

import type { Website } from "../shared/schema";

// Vercel bundles this file, so we need to read it at runtime via fs
// (Vercel includes the file because it's listed in vercel.json outputDirectory includes)
import fs from "fs";
import path from "path";

let _data: Website[] | null = null;

function load(): Website[] {
  if (_data) return _data;

  // Try multiple paths to support both local dev and Vercel runtime
  const candidates = [
    path.join(process.cwd(), "dataset.json"),
    path.join(__dirname, "../dataset.json"),
    path.join(__dirname, "../../dataset.json"),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const raw = JSON.parse(fs.readFileSync(p, "utf-8")) as Omit<Website, "id" | "label">[];
      _data = raw.map((entry, i) => ({
        id: i + 1,
        label: "benign",
        ...entry,
      })) as Website[];
      return _data;
    }
  }

  throw new Error("dataset.json not found");
}

export function getAllWebsites(): Website[] {
  return load();
}

export function getWebsiteById(id: number): Website | undefined {
  return load().find((w) => w.id === id);
}

export function getWebsitesByCategory(category: string): Website[] {
  return load().filter((w) => w.category === category);
}

export function getWebsitesByCountry(country: string): Website[] {
  return load().filter((w) => w.country === country);
}

export function searchWebsites(query: string): Website[] {
  const q = query.toLowerCase();
  return load().filter(
    (w) =>
      w.domain.toLowerCase().includes(q) ||
      w.country.toLowerCase().includes(q) ||
      w.city.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q) ||
      w.description.toLowerCase().includes(q)
  );
}

export function getCategories(): string[] {
  return [...new Set(load().map((w) => w.category))].sort();
}

export function getCountries(): { country: string; countryCode: string; count: number }[] {
  const map = new Map<string, { country: string; countryCode: string; count: number }>();
  for (const w of load()) {
    const key = w.country;
    if (map.has(key)) {
      map.get(key)!.count++;
    } else {
      map.set(key, { country: w.country, countryCode: w.countryCode, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function getStats() {
  const data = load();
  const currentYear = new Date().getFullYear();
  const tlsEnabled = data.filter((w) => w.tls).length;
  const avgAge = Math.round(
    data.reduce((sum, w) => sum + (currentYear - w.yearEstablished), 0) / data.length
  );
  const categories = new Set(data.map((w) => w.category)).size;
  const countries = new Set(data.map((w) => w.country)).size;
  return {
    total: data.length,
    totalSites: data.length,
    categories,
    countries,
    tlsEnabled,
    avgAge,
  };
}

export function getCategoryDistribution(): { category: string; count: number }[] {
  const map = new Map<string, number>();
  for (const w of load()) map.set(w.category, (map.get(w.category) ?? 0) + 1);
  return [...map.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getCountryDistribution(): { country: string; countryCode: string; count: number }[] {
  return getCountries();
}

export function getYearDistribution(): { year: number; count: number }[] {
  const map = new Map<number, number>();
  for (const w of load()) map.set(w.yearEstablished, (map.get(w.yearEstablished) ?? 0) + 1);
  return [...map.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
}

export function getLanguageDistribution(): { language: string; count: number }[] {
  const map = new Map<string, number>();
  for (const w of load()) map.set(w.language, (map.get(w.language) ?? 0) + 1);
  return [...map.entries()]
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count);
}

export function exportCSV(): string {
  const headers = [
    "id","domain","url","country","countryCode","city","category",
    "subcategory","language","tls","registrar","yearEstablished","description","label"
  ];
  const rows = [headers.join(",")];
  for (const w of load()) {
    rows.push([
      w.id,
      `"${w.domain}"`,
      `"${w.url}"`,
      `"${w.country}"`,
      `"${w.countryCode}"`,
      `"${w.city}"`,
      `"${w.category}"`,
      `"${w.subcategory}"`,
      `"${w.language}"`,
      w.tls ? "true" : "false",
      `"${w.registrar}"`,
      w.yearEstablished,
      `"${w.description.replace(/"/g, '""')}"`,
      `"${w.label}"`,
    ].join(","));
  }
  return rows.join("\n");
}
