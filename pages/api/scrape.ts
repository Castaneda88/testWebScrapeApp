// pages/api/scrape.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { chromium } from "playwright";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Wait for product grid to load
    await page.waitForSelector(".product-grid-item");

    const items = await page.$$eval(".product-grid-item", (products) =>
      products.map((el) => {
        const title = el.querySelector(".product-title")?.textContent?.trim() || "N/A";
        const price = el.querySelector(".price-item")?.textContent?.trim() || "N/A";
        return { title, price };
      })
    );

    await browser.close();

    return res.status(200).json({
      message: "Scrape successful",
      items,
    });
  } catch (err) {
    console.error("❌ Scrape failed:", err);
    return res.status(500).json({ error: "Scraping failed" });
  }
}
