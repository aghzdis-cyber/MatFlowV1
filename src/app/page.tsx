"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Activity, Box, MapPin, ShieldAlert } from "lucide-react";

// Mock Data
const statusData = [
  { name: "Actifs", value: 450, color: "#3b82f6" },     // Blue
  { name: "En Maintenance", value: 35, color: "#f59e0b" }, // Amber
  { name: "Au rebut", value: 15, color: "#ef4444" },    // Red
];

const zoneData = [
  { name: "Rayon A", value: 120 },
  { name: "Rayon B", value: 98 },
  { name: "Zone C", value: 86 },
  { name: "Stock Sécurité", value: 45 },
  { name: "Zone Quarantaine", value: 12 },
];

const controlsData = [
  { month: "Jan", controls: 12 },
  { month: "Fév", controls: 18 },
  { month: "Mar", controls: 25 },
  { month: "Avr", controls: 15 },
  { month: "Mai", controls: 30 },
  { month: "Juin", controls: 22 },
];

const KpiCard = ({ title, value, trend, isUp, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-20`}>
        <Icon className={colorClass.replace("bg-", "text-")} size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-semibold ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
        {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {trend}
      </div>
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Title section handled by Navbar mostly, but extra specific page text here */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-slate-800">Bonjour, Admin</h2>
        <p className="text-slate-500">Voici le résumé de l'état de votre matériel aujourd'hui.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Équipements" value="500" trend="+12% ce mois" isUp={true} icon={Box} colorClass="bg-blue-500" />
        <KpiCard title="Contrôles Requies" value="24" trend="-5% ce mois" isUp={true} icon={ShieldAlert} colorClass="bg-amber-500" />
        <KpiCard title="Zones Actives" value="12" trend="stable" isUp={true} icon={MapPin} colorClass="bg-indigo-500" />
        <KpiCard title="Taux de Disponibilité" value="96.5%" trend="-2.1% ce mois" isUp={false} icon={Activity} colorClass="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Status Overview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Évolution des Contrôles</h3>
            <select className="bg-slate-50 border-none text-sm font-medium text-slate-500 rounded-lg focus:ring-0 cursor-pointer">
              <option>6 Derniers Mois</option>
              <option>Cette Année</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={controlsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorControls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />
                <Area type="monotone" dataKey="controls" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorControls)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Status Breakdown */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col items-center relative">
          <h3 className="text-lg font-bold text-slate-800 self-start w-full mb-2">Répartition Statut</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-800">500</span>
              <span className="text-xs font-semibold text-slate-400">Total</span>
            </div>
          </div>
          <div className="w-full flex justify-between gap-2 mt-4 flex-wrap">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-sm font-medium text-slate-500">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Lists & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Répartition par Zone</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }} width={110} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />
                <Bar dataKey="value" fill="#fbbf24" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[1.5rem] shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldAlert size={120} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Contrôles Urgents</h3>
            <p className="text-blue-100 max-w-[80%]">Vous avez des équipements nécessitant une révision réglementaire immédiate. Consultez les synthèses pour agir.</p>
          </div>

          <div className="mt-8 flex justify-between items-end">
            <div>
              <span className="text-5xl font-extrabold block mb-1">24</span>
              <span className="text-blue-200 font-medium">Équipements en alerte</span>
            </div>
            <button className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold transition-colors shadow-lg">
              Traiter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
