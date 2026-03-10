import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, BadgeCheck, Users, FileText } from 'lucide-react';

export default function FerraillagePage() {
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
                    <h1 className="text-[#ff5722] text-3xl font-bold tracking-tight">Module de Ferraillage</h1>
                </div>

                {/* Main Information Card */}
                <div className="bg-[#2a3059] rounded-lg p-8 shadow-lg border border-[#3b4371]">
                    <p className="text-gray-200 leading-relaxed mb-6">
                        Ce module finalise le cycle de vie du matériel en gérant sa destruction ou son recyclage. Il assure la traçabilité de l'élimination des équipements réformés, conformément aux réglementations environnementales et aux politiques internes.
                    </p>

                    <h3 className="text-white font-semibold mb-3">Fonctionnalités clés :</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm ml-2 mb-10">
                        <li>Suivi des lots de matériel à recycler/détruire</li>
                        <li>Enregistrement des certificats de destruction/recyclage</li>
                        <li>Gestion des prestataires de services de ferraillage</li>
                        <li>Rapports sur les volumes et types de matériaux recyclés</li>
                    </ul>

                    <div className="border-t border-[#3b4371] pt-6 mb-6">
                        <h2 className="text-[#ff5722] text-xl font-bold">Actions du Module</h2>
                    </div>

                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <Truck className="w-5 h-5" />
                            <span className="font-medium text-sm">Suivre les Lots</span>
                        </button>
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <BadgeCheck className="w-5 h-5" />
                            <span className="font-medium text-sm">Enregistrer Certificats</span>
                        </button>
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <Users className="w-5 h-5" />
                            <span className="font-medium text-sm">Gérer les Prestataires</span>
                        </button>
                        <button className="flex items-center justify-center space-x-3 bg-[#ff5722] hover:bg-[#e64a19] text-white py-4 px-6 rounded-md transition-colors w-full">
                            <FileText className="w-5 h-5" />
                            <span className="font-medium text-sm">Voir les Rapports</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
