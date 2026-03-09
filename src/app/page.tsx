"use client";

import { PackageSearch, Archive, ScanSearch, ShieldCheck, XSquare, Recycle } from "lucide-react";
import { ModuleCard } from "@/components/dashboard/ModuleCard";

export default function Dashboard() {
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

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard
          title="Réception"
          description="Enregistrement des entrées de matériel et vérification des livraisons."
          metricText="3 en attente"
          progress={30}
          icon={PackageSearch}
        />
        <ModuleCard
          title="Capitalisation"
          description="Ajout au parc et suivi initial des nouveaux équipements."
          metricText="5 nouveaux / mois"
          progress={0}
          icon={Archive}
        />
        <ModuleCard
          title="Inventaire"
          description="Localisation des biens, gestion des stocks et scan par code-barres/QR."
          metricText="75% effectué"
          progress={75}
          icon={ScanSearch}
        />
        <ModuleCard
          title="Contrôle Réglementaire"
          description="Planification et suivi des inspections de conformité obligatoires."
          metricText="2 contrôles à venir"
          progress={20}
          icon={ShieldCheck}
        />
        <ModuleCard
          title="Réforme"
          description="Mise hors service des équipements obsolètes ou hors d'usage."
          metricText="10 équipements réformés"
          progress={0}
          icon={XSquare}
        />
        <ModuleCard
          title="Ferraillage"
          description="Gestion de la destruction et du recyclage des matériels réformés."
          metricText="Prêt pour collecte"
          progress={0}
          icon={Recycle}
        />
      </div>
    </div>
  );
}
