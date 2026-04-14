import { db } from "./db";
import { websites } from "@shared/schema";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

export function initDatabase() {
  // Create table if not exists
  db.run(sql`CREATE TABLE IF NOT EXISTS websites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT NOT NULL,
    url TEXT NOT NULL,
    country TEXT NOT NULL,
    country_code TEXT NOT NULL,
    city TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    language TEXT NOT NULL,
    tls INTEGER NOT NULL DEFAULT 1,
    registrar TEXT NOT NULL,
    year_established INTEGER NOT NULL,
    description TEXT NOT NULL,
    label TEXT NOT NULL DEFAULT 'benign'
  )`);

  // Check if already seeded
  const count = db.select({ count: sql<number>`count(*)` }).from(websites).get();
  if (count && count.count > 0) {
    console.log(`Database has ${count.count} records.`);
    return;
  }

  const dataPath = path.join(process.cwd(), "dataset.json");
  if (!fs.existsSync(dataPath)) {
    console.log("No dataset.json found.");
    return;
  }

  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  console.log(`Seeding ${data.length} websites...`);

  for (const entry of data) {
    db.insert(websites).values({
      domain: entry.domain,
      url: entry.url,
      country: entry.country,
      countryCode: entry.countryCode,
      city: entry.city,
      category: entry.category,
      subcategory: entry.subcategory,
      language: entry.language,
      tls: entry.tls,
      registrar: entry.registrar,
      yearEstablished: entry.yearEstablished,
      description: entry.description,
      label: "benign",
    }).run();
  }

  console.log("Seed complete.");
}
