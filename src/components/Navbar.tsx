// src/components/Navbar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePericias } from '../context/PericiasContext';
import { BarChart3, FileText, CalendarDays, Bell, PieChart } from 'lucide-react';

export default function Navbar() {
  const { periciasAtrasadas } = usePericias();
  const notificacoesNaoLidas = 0; // Placeholder

  const tabs = [
    { to: '/dashboard', label: 'Dashboard', icon: BarChart3, badge: periciasAtrasadas.length },
    { to: '/pericias', label: 'Perícias', icon: FileText, badge: 0 },
    { to: '/calendario', label: 'Calendário', icon: CalendarDays, badge: 0 },
    { to: '/notificacoes', label: 'Notificações', icon: Bell, badge: notificacoesNaoLidas },
    { to: '/relatorios', label: 'Relatórios', icon: PieChart, badge: 0 }
  ];

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-6 py-4 font-medium flex items-center gap-2 border-b-4 transition-all ${
      isActive ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
    }`;

  return (
    <nav role="navigation" aria-label="Navegação Principal" className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={getNavLinkClass}
              aria-label={tab.badge > 0 ? `${tab.label} (${tab.badge} ${tab.id === 'dashboard' ? 'prazos vencidos' : 'notificações'})` : tab.label}
            >
              <tab.icon size={20} aria-hidden="true" />
              {tab.label}
              {tab.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
