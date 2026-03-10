import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, ScanBarcode, MapPin, LineChart } from 'lucide-react';

export default function InventairePage() {
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
                    <h1 className="text-[#ff5722] text-3xl font-bold tracking-tight">Module d'Inventaire</h1>
                </div>

                {/* Main Information Card */}
                <div className="bg-[#2a3059] rounded-lg p-8 shadow-lg border border-[#3b4371]">
                    <p className="text-gray-200 leading-relaxed mb-6">
                        Ce module est essentiel pour la gestion des stocks et la localisation précise de chaque bien. Il facilite les opérations d'inventaire physique, que ce soit de manière périodique ou permanente, en utilisant notamment la lecture de codes-barres/QR pour une identification rapide et sans erreur.
                    </p>

                    <h3 className="text-white font-semibold mb-3">Fonctionnalités clés :</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm ml-2 mb-10">
                        <li>Planification et suivi des campagnes d'inventaire</li>
                        <li>Scan mobile pour la saisie terrain (codes-barres/QR)</li>
                        <li>Gestion des emplacements et des transferts de matériel</li>
                        <li>Rapports d'écarts et de valorisation des stocks</li>
                    </ul>

                    <div className="border-t border-[#3b4371] pt-6 mb-6">
                        <h2 className="text-[#ff5722] text-xl font-bold">Actions du Module</h2>
                    </div>

                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <CalendarDays className="w-5 h-5" />
                            <span className="font-medium text-sm">Planifier une Campagne</span>
                        </button>
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <ScanBarcode className="w-5 h-5" />
                            <span className="font-medium text-sm">Scan Terrain</span>
                        </button>
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <MapPin className="w-5 h-5" />
                            <span className="font-medium text-sm">Gérer les Emplacements</span>
                        </button>
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <LineChart className="w-5 h-5" />
                            <span className="font-medium text-sm">Voir les Rapports</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
