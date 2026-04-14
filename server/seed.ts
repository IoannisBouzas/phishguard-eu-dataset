import { db } from "./db";
import { websites } from "@shared/schema";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

export function seedDatabase() {
  // Check if already seeded
  const count = db.select({ count: sql<number>`count(*)` }).from(websites).get();
  if (count && count.count > 0) {
    console.log(`Database already has ${count.count} records. Skipping seed.`);
    return;
  }

  const dataPath = path.join(process.cwd(), "dataset.json");
  if (!fs.existsSync(dataPath)) {
    console.log("No dataset.json found. Skipping seed.");
    return;
  }

  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  
  console.log(`Seeding database with ${data.length} websites...`);
  
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
  
  console.log("Seeding complete.");
}
