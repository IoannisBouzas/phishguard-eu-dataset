import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getWebsiteById } from "../../lib/data";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const id = parseInt(req.query.id as string);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  const website = getWebsiteById(id);
  if (!website) return res.status(404).json({ message: "Website not found" });

  res.json(website);
}
