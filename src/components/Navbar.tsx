// FILE: src/components/Navbar.tsx

import React from "react";
import {
  BarChart3,
  FileText,
  CalendarDays,
  Bell,
  PieChart,
} from "lucide-react";

// Definimos as props que o componente espera receber
interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  periciasAtrasadas: any[]; // para o badge de alerta
  notificacoesNaoLidas: number; // para o badge de notificações
}

export default function Navbar({
  activeTab,
  setActiveTab,
  periciasAtrasadas,
  notificacoesNaoLidas,
}: NavbarProps) {
  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      badge: periciasAtrasadas.length,
    },
    { id: "pericias", label: "Perícias", icon: FileText, badge: 0 },
    { id: "calendario", label: "Calendário", icon: CalendarDays, badge: 0 },
    {
      id: "notificacoes",
      label: "Notificações",
      icon: Bell,
      badge: notificacoesNaoLidas,
    },
    { id: "relatorios", label: "Relatórios", icon: PieChart, badge: 0 },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium flex items-center gap-2 border-b-3 transition-all ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                {tab.label}
                {tab.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                    {tab.badge > 9 ? "9+" : tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
