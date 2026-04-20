import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getCountryDistribution } from "../../lib/data";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(getCountryDistribution());
}
