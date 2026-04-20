import type { VercelRequest, VercelResponse } from "@vercel/node";
import { exportCSV } from "../../lib/data";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=benign_websites_eu.csv");
  res.send(exportCSV());
}
