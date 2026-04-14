import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

export function registerRoutes(server: Server, app: Express) {
  // Get all websites with optional filters
  app.get("/api/websites", (req, res) => {
    const { category, country, search } = req.query;
    
    let results;
    if (search && typeof search === "string") {
      results = storage.searchWebsites(search);
    } else if (category && typeof category === "string") {
      results = storage.getWebsitesByCategory(category);
    } else if (country && typeof country === "string") {
      results = storage.getWebsitesByCountry(country);
    } else {
      results = storage.getAllWebsites();
    }
    
    res.json(results);
  });

  // Get single website
  app.get("/api/websites/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const website = storage.getWebsiteById(id);
    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }
    res.json(website);
  });

  // Get dashboard stats
  app.get("/api/stats", (_req, res) => {
    res.json(storage.getStats());
  });

  // Get categories
  app.get("/api/categories", (_req, res) => {
    res.json(storage.getCategories());
  });

  // Get countries
  app.get("/api/countries", (_req, res) => {
    res.json(storage.getCountries());
  });

  // Chart data
  app.get("/api/charts/categories", (_req, res) => {
    res.json(storage.getCategoryDistribution());
  });

  app.get("/api/charts/countries", (_req, res) => {
    res.json(storage.getCountryDistribution());
  });

  app.get("/api/charts/years", (_req, res) => {
    res.json(storage.getYearDistribution());
  });

  app.get("/api/charts/languages", (_req, res) => {
    res.json(storage.getLanguageDistribution());
  });

  // Export as CSV
  app.get("/api/export/csv", (_req, res) => {
    const all = storage.getAllWebsites();
    const headers = [
      "id","domain","url","country","countryCode","city","category",
      "subcategory","language","tls","registrar","yearEstablished","description","label"
    ];
    
    const csvRows = [headers.join(",")];
    for (const w of all) {
      csvRows.push([
        w.id,
        `"${w.domain}"`,
        `"${w.url}"`,
        `"${w.country}"`,
        `"${w.countryCode}"`,
        `"${w.city}"`,
        `"${w.category}"`,
        `"${w.subcategory}"`,
        `"${w.language}"`,
        w.tls,
        `"${w.registrar}"`,
        w.yearEstablished,
        `"${w.description.replace(/"/g, '""')}"`,
        `"${w.label}"`
      ].join(","));
    }
    
    const csv = csvRows.join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=benign_websites_eu.csv");
    res.send(csv);
  });

  // Export as JSON
  app.get("/api/export/json", (_req, res) => {
    const all = storage.getAllWebsites();
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=benign_websites_eu.json");
    res.json(all);
  });
}
