import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAllWebsites } from "../../lib/data";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Disposition", "attachment; filename=benign_websites_eu.json");
  res.json(getAllWebsites());
}
