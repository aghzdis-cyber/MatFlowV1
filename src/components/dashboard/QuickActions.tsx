import { PlusCircle, ArrowDownToLine, ArrowUpFromLine, Search } from "lucide-react";

const actions = [
    {
        icon: PlusCircle,
        label: "Nouveau Matériel",
        desc: "Créer une fiche",
        colorClass: "bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white"
    },
    {
        icon: ArrowDownToLine,
        label: "Réception Stock",
        desc: "Entrée d'inventaire",
        colorClass: "bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white"
    },
    {
        icon: ArrowUpFromLine,
        label: "Expédition",
        desc: "Sortie de matériel",
        colorClass: "bg-amber-100 text-amber-600 hover:bg-amber-600 hover:text-white"
    },
    {
        icon: Search,
        label: "Audit Rapide",
        desc: "Démarrer un contrôle",
        colorClass: "bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white"
    }
];

export function QuickActions() {
    return (
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Actions Rapides</h3>

            <div className="grid grid-cols-2 gap-4">
                {actions.map((action, i) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={i}
                            className={`group flex flex-col items-center justify-center p-4 rounded-xl border border-transparent hover:border-slate-200 transition-all text-center gap-2 ${action.colorClass.split(' ')[0]} hover:shadow-sm bg-slate-50`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${action.colorClass}`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{action.label}</span>
                                <span className="text-xs text-slate-500 font-medium">{action.desc}</span>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
}
