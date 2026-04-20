import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAllWebsites, getWebsitesByCategory, getWebsitesByCountry, searchWebsites } from "../../lib/data";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { category, country, search } = req.query;

  let results;
  if (search && typeof search === "string") {
    results = searchWebsites(search);
  } else if (category && typeof category === "string") {
    results = getWebsitesByCategory(category);
  } else if (country && typeof country === "string") {
    results = getWebsitesByCountry(country);
  } else {
    results = getAllWebsites();
  }

  res.json(results);
}
