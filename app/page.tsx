import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("../components/ClientApp"), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Smart Product Scraper</h1>
      <ClientApp />
    </main>
  );
}