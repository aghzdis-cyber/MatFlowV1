"use client";

import { ArrowLeft, MoreVertical, Award, Shield, Cpu, Zap, Box } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock Data
const achievements = [
    { id: 1, title: "Maître des Contrôles", current: 4, total: 5, color: "bg-amber-400", icon: Award },
    { id: 2, title: "Expertise RFID", current: 1, total: 5, color: "bg-slate-300", icon: Cpu },
    { id: 3, title: "Sécurité Qualité", current: 2, total: 2, color: "bg-emerald-400", icon: Shield },
    { id: 4, title: "Interventions Rapides", current: 5, total: 10, color: "bg-purple-400", icon: Zap },
];

export default function ProfilePage() {
    return (
        <div className="max-w-md mx-auto h-full flex flex-col relative overflow-hidden bg-slate-50">

            {/* Header bar (Mobile style) */}
            <div className="flex items-center justify-between p-6 pb-2 z-10 w-full relative">
                <Link href="/" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:text-slate-800 transition">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-lg font-bold text-slate-800">Profil de l'Agent</h1>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:text-slate-800 transition">
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Main Blue Card */}
            <div className="px-6 relative z-0 mt-4">
                <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-[2.5rem] p-8 pb-10 shadow-xl text-white flex flex-col items-center w-full relative overflow-hidden">
                    {/* Decorative background blobs */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 -right-10 w-60 h-60 bg-blue-900 opacity-20 rounded-full blur-2xl"></div>

                    <h2 className="text-2xl font-bold tracking-tight z-10">Amine Guellou</h2>
                    <p className="text-blue-200 font-medium text-sm mt-1 mb-8 z-10">Technicien Contrôle Matériel</p>

                    {/* Avatar with Ring */}
                    <div className="relative w-36 h-36 mb-10 z-10 flex items-center justify-center">
                        {/* SVG Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            {/* Background ring */}
                            <circle cx="50" cy="50" r="46" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                            {/* Progress ring - 75% */}
                            <circle
                                cx="50" cy="50" r="46" fill="transparent"
                                stroke="white" strokeWidth="4"
                                strokeDasharray="289" strokeDashoffset="72"
                                strokeLinecap="round"
                            />
                            {/* Small dot at the end of progress */}
                            <circle cx="50" cy="4" r="4" fill="white" transform="rotate(270 50 50)" />
                        </svg>

                        {/* Inner Avatar */}
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-transparent p-1 bg-gradient-to-br from-blue-400 to-blue-600 shadow-inner">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center text-blue-600 font-bold text-3xl">
                                AG
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex w-full justify-between items-center px-2 z-10">
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-blue-200 font-medium mb-1">Efficacité</span>
                            <span className="font-bold text-lg">86%</span>
                        </div>
                        <div className="w-px h-8 bg-blue-400 opacity-30"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-blue-200 font-medium mb-1">Interventions</span>
                            <span className="font-bold text-lg">92%</span>
                        </div>
                        <div className="w-px h-8 bg-blue-400 opacity-30"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-blue-200 font-medium mb-1">Expérience</span>
                            <span className="font-bold text-lg">5 ans</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Achievements */}
            <div className="flex-1 bg-slate-50 px-6 pt-8 pb-10 overflow-y-auto">
                <div className="flex justify-between items-center mb-6 px-2">
                    <h3 className="font-bold text-slate-800 text-lg">Compétences</h3>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition focus:outline-none">
                        <ArrowLeft size={16} className="rotate-45" />
                    </button>
                </div>

                <div className="flex flex-col gap-5 px-2">
                    {achievements.map((ach) => (
                        <div key={ach.id} className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${ach.color}`}>
                                <ach.icon size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-slate-700 text-sm">{ach.title}</span>
                                    <span className="text-xs font-bold text-slate-500">{ach.current}/{ach.total}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${ach.color}`}
                                        style={{ width: `${(ach.current / ach.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
