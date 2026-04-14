import { websites, type Website, type InsertWebsite } from "@shared/schema";
import { db } from "./db";
import { eq, like, and, sql } from "drizzle-orm";

export interface IStorage {
  getAllWebsites(): Website[];
  getWebsiteById(id: number): Website | undefined;
  getWebsitesByCategory(category: string): Website[];
  getWebsitesByCountry(country: string): Website[];
  searchWebsites(query: string): Website[];
  insertWebsite(website: InsertWebsite): Website;
  getCategories(): string[];
  getCountries(): { country: string; countryCode: string; count: number }[];
  getStats(): {
    total: number;
    categories: number;
    countries: number;
    tlsEnabled: number;
    avgAge: number;
  };
  getCategoryDistribution(): { category: string; count: number }[];
  getCountryDistribution(): { country: string; countryCode: string; count: number }[];
  getYearDistribution(): { year: number; count: number }[];
  getLanguageDistribution(): { language: string; count: number }[];
}

export class DatabaseStorage implements IStorage {
  getAllWebsites(): Website[] {
    return db.select().from(websites).all();
  }

  getWebsiteById(id: number): Website | undefined {
    return db.select().from(websites).where(eq(websites.id, id)).get();
  }

  getWebsitesByCategory(category: string): Website[] {
    return db.select().from(websites).where(eq(websites.category, category)).all();
  }

  getWebsitesByCountry(country: string): Website[] {
    return db.select().from(websites).where(eq(websites.country, country)).all();
  }

  searchWebsites(query: string): Website[] {
    const pattern = `%${query}%`;
    return db
      .select()
      .from(websites)
      .where(
        sql`${websites.domain} LIKE ${pattern} OR ${websites.description} LIKE ${pattern} OR ${websites.country} LIKE ${pattern} OR ${websites.city} LIKE ${pattern} OR ${websites.category} LIKE ${pattern}`
      )
      .all();
  }

  insertWebsite(website: InsertWebsite): Website {
    return db.insert(websites).values(website).returning().get();
  }

  getCategories(): string[] {
    const rows = db
      .selectDistinct({ category: websites.category })
      .from(websites)
      .all();
    return rows.map((r) => r.category);
  }

  getCountries(): { country: string; countryCode: string; count: number }[] {
    return db
      .select({
        country: websites.country,
        countryCode: websites.countryCode,
        count: sql<number>`count(*)`,
      })
      .from(websites)
      .groupBy(websites.country, websites.countryCode)
      .orderBy(sql`count(*) desc`)
      .all();
  }

  getStats() {
    const total = db
      .select({ count: sql<number>`count(*)` })
      .from(websites)
      .get()!.count;
    const categories = db
      .select({ count: sql<number>`count(distinct ${websites.category})` })
      .from(websites)
      .get()!.count;
    const countries = db
      .select({ count: sql<number>`count(distinct ${websites.country})` })
      .from(websites)
      .get()!.count;
    const tlsEnabled = db
      .select({ count: sql<number>`count(*)` })
      .from(websites)
      .where(eq(websites.tls, true))
      .get()!.count;
    const avgAge = db
      .select({ avg: sql<number>`avg(2026 - ${websites.yearEstablished})` })
      .from(websites)
      .get()!.avg;

    return { total, categories, countries, tlsEnabled, avgAge: Math.round(avgAge) };
  }

  getCategoryDistribution(): { category: string; count: number }[] {
    return db
      .select({
        category: websites.category,
        count: sql<number>`count(*)`,
      })
      .from(websites)
      .groupBy(websites.category)
      .orderBy(sql`count(*) desc`)
      .all();
  }

  getCountryDistribution(): { country: string; countryCode: string; count: number }[] {
    return db
      .select({
        country: websites.country,
        countryCode: websites.countryCode,
        count: sql<number>`count(*)`,
      })
      .from(websites)
      .groupBy(websites.country, websites.countryCode)
      .orderBy(sql`count(*) desc`)
      .all();
  }

  getYearDistribution(): { year: number; count: number }[] {
    return db
      .select({
        year: websites.yearEstablished,
        count: sql<number>`count(*)`,
      })
      .from(websites)
      .groupBy(websites.yearEstablished)
      .orderBy(websites.yearEstablished)
      .all();
  }

  getLanguageDistribution(): { language: string; count: number }[] {
    return db
      .select({
        language: websites.language,
        count: sql<number>`count(*)`,
      })
      .from(websites)
      .groupBy(websites.language)
      .orderBy(sql`count(*) desc`)
      .all();
  }
}

export const storage = new DatabaseStorage();
