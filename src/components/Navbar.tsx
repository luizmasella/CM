// FILE: src/components/Navbar.tsx

import React from 'react';
import { useUI } from '../context/UIContext';
import { usePericias } from '../context/PericiasContext';
import { BarChart3, FileText, CalendarDays, Bell, PieChart } from 'lucide-react';

export default function Navbar() {
  const { activeTab, setActiveTab } = useUI();
  const { periciasAtrasadas } = usePericias();
  const notificacoesNaoLidas = 0; // Placeholder

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: periciasAtrasadas.length },
    { id: 'pericias', label: 'Perícias', icon: FileText, badge: 0 },
    { id: 'calendario', label: 'Calendário', icon: CalendarDays, badge: 0 },
    { id: 'notificacoes', label: 'Notificações', icon: Bell, badge: notificacoesNaoLidas },
    { id: 'relatorios', label: 'Relatórios', icon: PieChart, badge: 0 }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium flex items-center gap-2 border-b-4 transition-all ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              <tab.icon size={20} />
              {tab.label}
              {tab.badge > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">{tab.badge > 9 ? '9+' : tab.badge}</span>}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
