import { Search, Bell, Menu } from "lucide-react";

export function Navbar() {
    return (
        <header className="flex items-center justify-between px-8 py-4 bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
                {/* Mobile menu button (hidden on desktop) */}
                <button className="md:hidden p-2 rounded-lg bg-gray-100/80 text-gray-500 hover:text-gray-900 transition-colors">
                    <Menu size={20} />
                </button>

                {/* Page Title / Breadcrumb context could go here */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Vue d'Ensemble</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">Gérez et suivez tout votre matériel avec MatFlow.</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un dossier, équipement..."
                        className="pl-10 pr-4 py-2.5 bg-gray-100/80 border-transparent rounded-full text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white w-72 transition-all shadow-sm"
                    />
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-3">
                    <button className="relative p-2.5 rounded-full bg-gray-100/80 text-gray-500 hover:text-blue-600 transition-colors shadow-sm">
                        <Bell size={19} />
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold text-gray-800">Admin</span>
                            <span className="text-xs text-blue-500 font-medium">Magasin Central</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                            AD
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
