export const metadata = {
  title: "Smart Product Scraper",
  description: "Scrape product data into Google Sheets",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}