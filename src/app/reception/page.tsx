import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ScanLine, QrCode, AlertTriangle, MapPin } from 'lucide-react';

export default function ReceptionPage() {
    return (
        <div className="min-h-screen bg-[#1e2343] p-8 text-white font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header section with back button and Title */}
                <div className="flex flex-col space-y-4">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 bg-[#ff5722] hover:bg-[#e64a19] text-white px-4 py-2 rounded-md w-fit transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Retour au tableau de bord</span>
                    </Link>
                    <h1 className="text-[#ff5722] text-3xl font-bold tracking-tight">Module de Réception</h1>
                </div>

                {/* Main Information Card */}
                <div className="bg-[#2a3059] rounded-lg p-8 shadow-lg border border-[#3b4371]">
                    <p className="text-gray-200 leading-relaxed mb-6">
                        Bienvenue dans le module de Réception. Ici, vous pourrez enregistrer les entrées de matériel, vérifier la conformité des livraisons par rapport aux bons de commande, générer des codes QR uniques pour chaque équipement contenant ses données et initier le processus d'intégration des nouveaux équipements dans le système. Utilisez le scanner pour lire rapidement les codes QR ou codes-barres existants.
                    </p>

                    <h3 className="text-white font-semibold mb-3">Fonctionnalités :</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm ml-2 mb-8">
                        <li>Scan de bons de livraison</li>
                        <li>Identification rapide par code QR/code-barres via la caméra</li>
                        <li>Générer des codes QR pour les équipements avec leurs données</li>
                        <li>Gestion des non-conformités</li>
                        <li>Assignation à un emplacement temporaire</li>
                    </ul>

                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <ScanLine className="w-5 h-5" />
                            <span className="font-medium text-sm">Scanner un bon de livraison</span>
                        </button>
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <QrCode className="w-5 h-5" />
                            <span className="font-medium text-sm">Générer un code QR</span>
                        </button>
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-medium text-sm">Gérer les non-conformités</span>
                        </button>
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <MapPin className="w-5 h-5" />
                            <span className="font-medium text-sm">Assigner un emplacement</span>
                        </button>
                    </div>

                    <div className="border-t border-[#3b4371] pt-6 space-y-3">
                        <h2 className="text-[#ff5722] text-xl font-bold">Identification par Code</h2>
                        <p className="text-gray-300 text-sm mb-4">
                            Utilisez la caméra de votre appareil pour scanner rapidement les codes QR ou codes-barres existants sur les équipements.
                        </p>
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-3 px-6 rounded-md transition-colors w-fit">
                            <ScanLine className="w-5 h-5" />
                            <span className="font-medium text-sm">Lancer le Scanner de Code</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
