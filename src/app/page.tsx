"use client";

import { useEffect, useState } from "react";
import { PackageSearch, Archive, ScanSearch, ShieldCheck, XSquare, Recycle } from "lucide-react";
import { ModuleCard } from "@/components/dashboard/ModuleCard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    receptions: { pending: 0 },
    inspections: { pending: 0 },
    reforms: { pending: 0, approved: 0 },
    scrap: { pending: 0 },
    inventory: { totalItems: 0 },
    materials: { total: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header section */}
      <div className="mb-10 mt-4">
        <h1 className="text-[2.5rem] font-bold text-white mb-2 tracking-tight">
          Tableau de Bord MatFlow
        </h1>
        <p className="text-[#a6add7] text-lg font-medium">
          Gestion centralisée du cycle de vie de votre matériel.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff5722]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleCard
            title="Réception"
            description="Enregistrement des entrées de matériel et vérification des livraisons."
            metricText={`${stats.receptions.pending} en attente`}
            progress={stats.receptions.pending > 0 ? 30 : 100}
            icon={PackageSearch}
            href="/reception"
          />
          <ModuleCard
            title="Capitalisation"
            description="Ajout au parc et suivi initial des nouveaux équipements."
            metricText={`${stats.materials.total} types de matériels`}
            progress={stats.materials.total > 0 ? 100 : 0}
            icon={Archive}
            href="/capitalisation"
          />
          <ModuleCard
            title="Inventaire"
            description="Localisation des biens, gestion des stocks et mouvements."
            metricText={`${stats.inventory.totalItems} articles en stock`}
            progress={stats.inventory.totalItems > 0 ? 100 : 0}
            icon={ScanSearch}
            href="/inventaires"
          />
          <ModuleCard
            title="Contrôle Réglementaire"
            description="Planification et suivi des inspections de conformité obligatoires."
            metricText={`${stats.inspections.pending} contrôles à faire`}
            progress={stats.inspections.pending > 0 ? 20 : 100}
            icon={ShieldCheck}
            href="/controles"
          />
          <ModuleCard
            title="Réforme"
            description="Mise hors service des équipements obsolètes ou hors d'usage."
            metricText={`${stats.reforms.pending} attente, ${stats.reforms.approved} approvées`}
            progress={stats.reforms.pending > 0 ? 50 : 0}
            icon={XSquare}
            href="/reforme"
          />
          <ModuleCard
            title="Ferraillage"
            description="Gestion de la destruction et du recyclage des matériels réformés."
            metricText={`${stats.scrap.pending} lots prêts pour collecte`}
            progress={stats.scrap.pending > 0 ? 80 : 0}
            icon={Recycle}
            href="/ferraillage"
          />
        </div>
      )}
    </div>
  );
}
