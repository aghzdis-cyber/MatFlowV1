"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Activity, Box, MapPin, ShieldAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { RecentFlows } from "@/components/dashboard/RecentFlows";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Skeleton } from "@/components/ui/Skeleton";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erreur API');
  return json;
};

const KpiCard = ({ title, value, trend, isUp, icon: Icon, colorClass, isLoading }: any) => (
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
      {isLoading ? (
        <Skeleton className="h-9 w-24 mt-2" />
      ) : (
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const { data: session } = useSession();

  // SWR automatically polls data every 5 seconds (5000ms) for real-time updates
  const { data: stats, error, isLoading } = useSWR('/api/stats', fetcher, {
    refreshInterval: 5000
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Title section */}
      <div className="mb-2 flex items-center justify-between bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 bg-gradient-to-r from-white to-blue-50/50">
        <div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">
            Bonjour, {session?.user?.name || 'Utilisateur'} 👋
          </h2>
          <p className="text-slate-500 font-medium mt-1">Voici le résumé de l'état de votre matériel aujourd'hui.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-semibold text-slate-700">Système Opérationnel</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Équipements"
          value={stats?.totalEquipment || 0}
          trend="+12% ce mois"
          isUp={true}
          icon={Box}
          colorClass="bg-blue-500"
          isLoading={isLoading}
        />
        <KpiCard
          title="Contrôles Requis"
          value={stats?.urgentControls || 0}
          trend="-5% ce mois"
          isUp={true}
          icon={ShieldAlert}
          colorClass="bg-amber-500"
          isLoading={isLoading}
        />
        <KpiCard
          title="Zones Actives"
          value={stats?.activeZonesCount || 0}
          trend="stable"
          isUp={true}
          icon={MapPin}
          colorClass="bg-indigo-500"
          isLoading={isLoading}
        />
        <KpiCard
          title="Taux de Disponibilité"
          value="96.5%"
          trend="-2.1% ce mois"
          isUp={false}
          icon={Activity}
          colorClass="bg-emerald-500"
          isLoading={isLoading}
        />
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
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.controlsData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            )}
          </div>
        </div>

        {/* Donut Chart: Status Breakdown */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col items-center relative">
          <h3 className="text-lg font-bold text-slate-800 self-start w-full mb-2">Statut des Flux</h3>
          <div className="h-64 w-full relative">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-full scale-75" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.statusData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {(stats?.statusData || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            {!isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-800">
                  {(stats?.statusData || []).reduce((a: number, b: any) => a + b.value, 0)}
                </span>
                <span className="text-xs font-semibold text-slate-400">Total Flux</span>
              </div>
            )}
          </div>
          <div className="w-full flex justify-between gap-2 mt-4 flex-wrap">
            {!isLoading && (stats?.statusData || []).map((s: any, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-sm font-medium text-slate-500">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Lists & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Répartition par Zone (Top 5)</h3>
          <div className="h-64 w-full">
            {isLoading ? (
              <div className="flex flex-col gap-4 h-full justify-center">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/6" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.zoneData || []} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
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
            )}
          </div>
        </div>

        {/* Dynamic RecentFlows */}
        <div className="flex w-full h-full min-h-[300px] lg:col-span-1">
          <RecentFlows />
        </div>

        {/* Quick Actions */}
        <div className="flex w-full h-full lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
