/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { 
  Radio, 
  Users, 
  Activity, 
  BarChart3, 
  History, 
  MessageSquare, 
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SchoolData {
  id: number;
  nome: string;
  gestor: string;
  tel: string;
  total: number;
  status: 'ONLINE' | 'OFFLINE';
  trafego: number[];
}

export default function App() {
  const [data, setData] = useState<SchoolData[]>([]);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/dados');
      const json = await response.json();
      setData(json);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const dataInterval = setInterval(fetchData, 5000);
    const clockInterval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(clockInterval);
    };
  }, []);

  // Prepare data for the line chart (average traffic over time)
  // Since mock data gives us an array of 10 points per school, we'll average them
  const lineChartData = Array.from({ length: 10 }).map((_, i) => {
    const avg = data.reduce((acc, curr) => acc + (curr.trafego?.[i] || 0), 0) / (data.length || 1);
    return {
      name: `T-${10 - i}`,
      value: Math.round(avg)
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-sky-400 animate-pulse flex flex-col items-center gap-4">
          <Radio size={48} />
          <span className="text-xl font-medium uppercase tracking-widest">Iniciando NOC...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-sky-500/30">
      {/* Header */}
      <header className="bg-[#111827] border-b-2 border-sky-500 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500/20 p-2 rounded-lg">
            <Radio className="text-sky-400" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">
              MONITORING WIFI <span className="text-sky-400">| CDE 1 a 7</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-xl text-sky-100 bg-slate-800/50 px-4 py-1 rounded-md border border-slate-700">
            <Clock size={18} className="text-sky-400" />
            {time}
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Sistema Ativo
          </div>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1600px] mx-auto">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bar Chart Card */}
          <div className="bg-[#1e293b] rounded-xl p-6 shadow-xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-sky-400" size={20} />
              <h2 className="text-lg font-semibold">Dispositivos por Unidade</h2>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="nome" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#38bdf8' }}
                    cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="#38bdf8" 
                    radius={[4, 4, 0, 0]} 
                    name="Dispositivos"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart Card */}
          <div className="bg-[#1e293b] rounded-xl p-6 shadow-xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-6">
              <History className="text-sky-400" size={20} />
              <h2 className="text-lg font-semibold">Média de Tráfego (Tempo Real)</h2>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#38bdf8" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#38bdf8' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="Média Mbps"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column - Managers Table */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] rounded-xl p-6 shadow-xl border border-slate-700/50 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Users className="text-sky-400" size={20} />
              <h2 className="text-lg font-semibold">Gestores Responsáveis</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#1e293b] z-10">
                  <tr>
                    <th className="pb-4 text-sky-400 font-medium text-xs uppercase tracking-wider border-bottom border-slate-700">Escola</th>
                    <th className="pb-4 text-sky-400 font-medium text-xs uppercase tracking-wider border-bottom border-slate-700">Gestor</th>
                    <th className="pb-4 text-sky-400 font-medium text-xs uppercase tracking-wider border-bottom border-slate-700 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {data.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{item.nome}</span>
                          <div className="flex items-center gap-1 mt-1">
                            {item.status === 'ONLINE' ? (
                              <Wifi size={12} className="text-emerald-400" />
                            ) : (
                              <WifiOff size={12} className="text-rose-400" />
                            )}
                            <span className={cn(
                              "text-[10px] font-bold uppercase",
                              item.status === 'ONLINE' ? "text-emerald-400" : "text-rose-400"
                            )}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="text-xs text-slate-400 leading-tight block max-w-[120px]">
                          {item.gestor}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <a 
                          href={`https://wa.me/55${item.tel}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                          title="Contactar via WhatsApp"
                        >
                          <MessageSquare size={18} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
}
