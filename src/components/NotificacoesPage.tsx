// FILE: src/components/NotificacoesPage.tsx

import React from 'react';
import { 
  Bell, 
  CheckCircle, 
  Trash2, 
  AlertTriangle, 
  AlertCircle as AlertCircleIcon, 
  Clock, 
  FileText 
} from 'lucide-react';

interface NotificacoesPageProps {
  notifications: any[];
  notificacoesNaoLidas: number;
  marcarTodasComoLidas: () => void;
  limparNotificacoes: () => void;
  abrirPericiaNotificacao: (notificacao: any) => void;
  marcarComoLida: (id: number) => void;
}

export default function NotificacoesPage({
  notifications,
  notificacoesNaoLidas,
  marcarTodasComoLidas,
  limparNotificacoes,
  abrirPericiaNotificacao,
  marcarComoLida,
}: NotificacoesPageProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="text-blue-600" />
              Central de Notificações
            </h2>
            <p className="text-gray-600 mt-1">
              {notificacoesNaoLidas} não lida{notificacoesNaoLidas !== 1 ? 's' : ''} de {notifications.length} total
            </p>
          </div>
          
          <div className="flex gap-3">
            {notificacoesNaoLidas > 0 && (
              <>
                <button
                  onClick={marcarTodasComoLidas}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Marcar todas como lidas
                </button>
                <button
                  onClick={limparNotificacoes}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Limpar lidas
                </button>
              </>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Urgentes</p>
                <p className="text-2xl font-bold text-red-700">
                  {notifications.filter(n => n.prioridade === 'urgente' && !n.lida).length}
                </p>
              </div>
              <AlertTriangle className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Alta Prioridade</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {notifications.filter(n => n.prioridade === 'alta' && !n.lida).length}
                </p>
              </div>
              <Bell className="text-yellow-500" size={32} />
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Média Prioridade</p>
                <p className="text-2xl font-bold text-blue-700">
                  {notifications.filter(n => n.prioridade === 'media' && !n.lida).length}
                </p>
              </div>
              <AlertCircleIcon className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Lidas</p>
                <p className="text-2xl font-bold text-green-700">
                  {notifications.filter(n => n.lida).length}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
        </div>

        {/* Lista de Notificações */}
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhuma notificação</h3>
            <p className="text-gray-500">Você está em dia com todas as suas perícias! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.filter(n => !n.lida).length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3 text-gray-700">Não Lidas</h3>
                {notifications.filter(n => !n.lida).map(notif => (
                  <div key={notif.id} onClick={() => abrirPericiaNotificacao(notif)} className={`p-4 rounded-xl mb-2 cursor-pointer transition-all hover:shadow-md ${notif.prioridade === 'urgente' ? 'bg-red-50 border-2 border-red-300 hover:bg-red-100' : notif.prioridade === 'alta' ? 'bg-yellow-50 border-2 border-yellow-300 hover:bg-yellow-100' : 'bg-blue-50 border-2 border-blue-300 hover:bg-blue-100'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 ${notif.prioridade === 'urgente' ? 'bg-red-500 animate-pulse' : notif.prioridade === 'alta' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold mb-1 text-gray-900">{notif.titulo}</p>
                        <p className="text-sm text-gray-700 mb-2">{notif.mensagem}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Clock size={14} />{new Date(notif.data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          {notif.pericia && (<span className="flex items-center gap-1"><FileText size={14} />{notif.pericia.numeroProcesso}</span>)}
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); marcarComoLida(notif.id); }} className="flex-shrink-0 text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Marcar como lida">
                        <CheckCircle size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {notifications.filter(n => n.lida).length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-lg mb-3 text-gray-500">Lidas</h3>
                {notifications.filter(n => n.lida).map(notif => (
                  <div key={notif.id} onClick={() => abrirPericiaNotificacao(notif)} className="p-4 bg-gray-50 rounded-xl mb-2 cursor-pointer transition-all hover:bg-gray-100 border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-3 h-3 rounded-full bg-gray-300 mt-1"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold mb-1 text-gray-600">{notif.titulo}</p>
                        <p className="text-sm text-gray-500 mb-2">{notif.mensagem}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Clock size={14} />{new Date(notif.data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                          {notif.pericia && (<span className="flex items-center gap-1"><FileText size={14} />{notif.pericia.numeroProcesso}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
