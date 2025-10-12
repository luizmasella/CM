// FILE: src/components/Header.tsx

import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { Activity, Bell, AlertTriangle, X, CheckCircle } from 'lucide-react';

export default function Header() {
  const { periciasAtrasadas } = usePericias();
  const { showNotifications, setShowNotifications, openProcessPage, setActiveTab } = useUI();
  
  // A lógica de notificações ainda vive aqui, pode ser movida para um context no futuro
  const [notifications, setNotifications] = React.useState<any[]>([]); 
  const notificacoesNaoLidas = notifications.filter(n => !n.lida).length;
  const marcarComoLida = (id: number) => setNotifications(n => n.map(notif => notif.id === id ? {...notif, lida: true} : notif));
  const marcarTodasComoLidas = () => setNotifications(n => n.map(notif => ({...notif, lida: true})));
  const limparNotificacoes = () => setNotifications(n => n.filter(notif => !notif.lida));
  const abrirPericiaNotificacao = (notificacao: any) => { openProcessPage(notificacao.pericia); marcarComoLida(notificacao.id); };

  const handleCardClick = () => {
    setActiveTab('pericias');
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3"><Activity size={36} />Sistema de Perícias Médicas</h1>
            <p className="text-blue-100 mt-1">Gerenciamento completo de perícias judiciais</p>
          </div>
          <div className="flex items-center gap-4">
            {periciasAtrasadas.length > 0 && (
              <button onClick={handleCardClick} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors relative animate-pulse">
                <AlertTriangle size={20} />
                <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{periciasAtrasadas.length}</span>
              </button>
            )}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className={`p-2 rounded-lg transition-colors relative ${notificacoesNaoLidas > 0 ? 'bg-yellow-500 hover:bg-yellow-600 animate-pulse' : 'bg-white/10 backdrop-blur hover:bg-white/20'}`}>
                <Bell size={20} />
                {notificacoesNaoLidas > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{notificacoesNaoLidas > 9 ? '9+' : notificacoesNaoLidas}</span>}
              </button>
              {showNotifications && (
                 <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl text-black p-4">Painel de Notificações...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
