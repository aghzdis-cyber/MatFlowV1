import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, CheckSquare, Presentation, BellRing } from 'lucide-react';

export default function ControleReglementairePage() {
    return (
        <div className="min-h-screen bg-[#1e2343] p-8 text-white font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header section with back button and Title */}
                <div className="flex flex-col space-y-6">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 bg-[#ff5722] hover:bg-[#e64a19] text-white px-4 py-2 rounded-md w-fit transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Retour au tableau de bord</span>
                    </Link>
                    <h1 className="text-[#ff5722] text-3xl font-bold tracking-tight">Module de Contrôle Réglementaire</h1>
                </div>

                {/* Main Information Card */}
                <div className="bg-[#2a3059] rounded-lg p-8 shadow-lg border border-[#3b4371]">
                    <p className="text-gray-200 leading-relaxed mb-6">
                        Assurez la conformité de votre parc matériel avec le module de Contrôle Réglementaire. Planifiez, suivez et documentez toutes les inspections et vérifications périodiques obligatoires (sécurité, environnement, qualité, etc.).
                    </p>

                    <h3 className="text-white font-semibold mb-3">Fonctionnalités clés :</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm ml-2 mb-10">
                        <li>Calendrier des contrôles à venir et échus</li>
                        <li>Checklists personnalisables par type d'équipement</li>
                        <li>Archivage des rapports d'inspection et certificats</li>
                        <li>Alertes automatiques pour les échéances critiques</li>
                    </ul>

                    <div className="border-t border-[#3b4371] pt-6 mb-6">
                        <h2 className="text-[#ff5722] text-xl font-bold">Actions du Module</h2>
                    </div>

                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <CalendarDays className="w-5 h-5" />
                            <span className="font-medium text-sm">Calendrier des Contrôles</span>
                        </button>
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <CheckSquare className="w-5 h-5" />
                            <span className="font-medium text-sm">Gérer les Checklists</span>
                        </button>
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <Presentation className="w-5 h-5" />
                            <span className="font-medium text-sm">Archiver Rapports/Certificats</span>
                        </button>
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <BellRing className="w-5 h-5" />
                            <span className="font-medium text-sm">Gérer les Alertes</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
