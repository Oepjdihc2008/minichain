import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "MiniChain — Open-Source BFT Consensus & EVM Engineering Lab",
  description:
    "Open-source distributed systems and EVM smart contract engineering project: Python BFT two-phase consensus labs, SQLite lock persistence, Foundry fuzz testing (30,000 runs), and live Ethereum Sepolia MiniScan read-only explorer.",
  other: {
    "color-scheme": "dark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-100">
        <LanguageProvider>
          <div className="flex min-h-dvh flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
