import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const websites = sqliteTable("websites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  domain: text("domain").notNull(),
  url: text("url").notNull(),
  country: text("country").notNull(),
  countryCode: text("country_code").notNull(),
  city: text("city").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
  language: text("language").notNull(),
  tls: integer("tls", { mode: "boolean" }).notNull().default(true),
  registrar: text("registrar").notNull(),
  yearEstablished: integer("year_established").notNull(),
  description: text("description").notNull(),
  label: text("label").notNull().default("benign"),
});

export const insertWebsiteSchema = createInsertSchema(websites).omit({
  id: true,
});

export type InsertWebsite = z.infer<typeof insertWebsiteSchema>;
export type Website = typeof websites.$inferSelect;
