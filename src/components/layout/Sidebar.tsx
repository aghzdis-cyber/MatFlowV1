import Link from "next/link";
import {
    Home,
    Box,
    MapPin,
    FileText,
    Settings,
    Users,
    ShieldCheck,
    LogOut
} from "lucide-react";

export function Sidebar() {
    return (
        <div className="flex flex-col w-20 py-8 items-center bg-transparent h-full justify-between">
            <div className="flex flex-col items-center gap-8">
                {/* Logo Icon */}
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-blue-600 font-bold text-xl">
                    M
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-6 w-full items-center">
                    <NavItem href="/" icon={<Home size={22} />} active />
                    <NavItem href="/equipments" icon={<Box size={22} />} />
                    <NavItem href="/locations" icon={<MapPin size={22} />} />
                    <NavItem href="/controls" icon={<ShieldCheck size={22} />} />
                    <NavItem href="/documents" icon={<FileText size={22} />} />
                    <NavItem href="/users" icon={<Users size={22} />} />
                </nav>
            </div>

            <div className="flex flex-col items-center gap-6">
                <NavItem href="/settings" icon={<Settings size={22} />} />
                <button className="text-white/60 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/10">
                    <LogOut size={22} />
                </button>
            </div>
        </div>
    );
}

function NavItem({ href, icon, active }: { href: string; icon: React.ReactNode; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center ${active
                    ? "bg-white text-blue-600 shadow-lg scale-110"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
        >
            {icon}
        </Link>
    );
}
