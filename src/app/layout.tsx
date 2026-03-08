import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

// We use Inter font as it matches the modern requested aesthetic
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MatFlow - Gestion de Contrôle Matériel",
  description: "Plateforme centralisée de gestion et de contrôle matériel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased bg-[#0e172a]`}>
        {/* Main wrapper: Dark blue background matching the sidebar theme */}
        <div className="flex h-screen w-full overflow-hidden p-2 gap-2">
          {/* Sidebar Area */}
          <Sidebar />

          {/* Main Content Area - White curved container */}
          <div className="flex flex-col flex-1 bg-white rounded-[2rem] overflow-hidden shadow-2xl mr-2 relative">
            <Navbar />

            <main className="flex-1 overflow-y-auto bg-slate-50 relative p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
