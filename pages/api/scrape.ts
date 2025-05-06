import type { NextApiRequest, NextApiResponse } from "next";
import { chromium } from "playwright"; // must be installed via `npm install playwright`
import { canScrape, incrementUsage } from "@/lib/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { url, email } = req.body;
  if (!url || !email) return res.status(400).json({ error: "Missing URL or email" });

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const items = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".product-item")).map((item) => ({
        title: item.querySelector("h2")?.textContent?.trim() || "",
        price: item.querySelector(".price")?.textContent?.trim() || "",
        quantity: item.querySelector("select")?.textContent?.trim() || "1",
      }));
    });

    const allowed = await canScrape(email, items.length);
    if (!allowed) {
      return res.status(403).json({ error: "Free tier limit reached. Upgrade to Pro." });
    }

    await incrementUsage(email, items.length);

    return res.status(200).json({ message: "Scrape successful", items });
  } catch (err) {
    console.error("❌ Scrape error:", err); // <-- add this
    return res.status(500).json({ error: "Scraping failed", details: err instanceof Error ? err.message : err });
  }  
}
