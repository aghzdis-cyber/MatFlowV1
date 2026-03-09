import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MatFlow - Tableau de Bord",
  description: "Plateforme centralisée de gestion et de contrôle matériel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} antialiased min-h-screen bg-[#1e2254] m-0 p-0`}>
        <NextAuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 w-full max-w-[1400px] mx-auto p-8 lg:p-12">
              {children}
            </main>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
