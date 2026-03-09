import { ArrowRight, Package, Truck, CheckCircle, Clock } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const statusConfig: Record<string, any> = {
    PENDING: {
        icon: Clock,
        text: "En attente",
        colorClass: "text-amber-600 bg-amber-50 border-amber-200",
    },
    IN_TRANSIT: {
        icon: Truck,
        text: "En transit",
        colorClass: "text-blue-600 bg-blue-50 border-blue-200",
    },
    COMPLETED: {
        icon: CheckCircle,
        text: "Terminé",
        colorClass: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
};

export function RecentFlows() {
    const { data: flows, error, isLoading } = useSWR('/api/flows', fetcher, {
        refreshInterval: 5000
    });

    if (isLoading) {
        return <div className="p-4 text-center text-slate-500">Chargement des flux...</div>;
    }

    if (error || !flows) {
        return <div className="p-4 text-center text-red-500">Erreur de chargement des flux.</div>;
    }

    // N'afficher que les 5 flux les plus récents
    const displayFlows = flows.slice(0, 5);

    return (
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col w-full h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Flux Récents</h3>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Voir tout
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {displayFlows.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">Aucun flux récent.</p>
                ) : (
                    displayFlows.map((flow: any) => {
                        const config = statusConfig[flow.status] || statusConfig.PENDING;
                        const StatusIcon = config.icon;

                        return (
                            <div key={flow.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all text-xl font-bold">
                                        <Package size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-800">{flow.material?.name || "Matériel Inconnu"}</h4>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                                            <span>{flow.sourceLocation?.name || "N/A"}</span>
                                            <ArrowRight size={12} className="text-slate-400" />
                                            <span>{flow.destLocation?.name || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.colorClass} flex items-center gap-1.5`}>
                                        <StatusIcon size={12} />
                                        {config.text}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">
                                        Quantité : <span className="text-slate-600 font-bold">{flow.quantity}</span>
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
