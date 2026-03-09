"use client";

import Link from "next/link";
import { ScanLine, Bell, User } from "lucide-react";

export function Navbar() {
    return (
        <header className="flex justify-between items-center py-6 px-12 text-white w-full border-b border-[#2a2e6f]/50 bg-[#1e2254]">
            <Link href="/" className="flex items-center gap-2">
                <span className="text-[#f97316] font-bold text-2xl font-serif italic">M</span>
                <span className="text-xl font-bold tracking-tight">MatFlow</span>
            </Link>

            <div className="flex items-center gap-6">
                <button className="p-2 text-[#848cb8] hover:text-white transition-colors" title="Scan">
                    <ScanLine size={22} />
                </button>
                <button className="p-2 text-[#848cb8] hover:text-white transition-colors relative" title="Notifications">
                    <Bell size={22} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f97316] rounded-full border border-[#1e2254]"></span>
                </button>
                <button className="p-2 text-[#848cb8] hover:text-white transition-colors" title="Profil">
                    <User size={22} />
                </button>
            </div>
        </header>
    );
}
