// FILE: src/components/Header.tsx

import React from "react";
import { Activity, Bell, AlertTriangle, X, CheckCircle } from "lucide-react";

// Definimos os "dados de entrada" que o Header precisa para funcionar
interface HeaderProps {
  periciasAtrasadas: any[];
  notificacoesNaoLidas: number;
  showNotifications: boolean;
  notifications: any[];
  handleCardClick: (type: string, value: any) => void;
  setShowNotifications: (show: boolean) => void;
  abrirPericiaNotificacao: (notification: any) => void;
  marcarTodasComoLidas: () => void;
  limparNotificacoes: () => void;
  marcarComoLida: (id: number) => void;
}

export default function Header({
  periciasAtrasadas,
  notificacoesNaoLidas,
  showNotifications,
  notifications,
  handleCardClick,
  setShowNotifications,
  abrirPericiaNotificacao,
  marcarTodasComoLidas,
  limparNotificacoes,
  marcarComoLida,
}: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Activity size={36} />
              Sistema de Perícias Médicas
            </h1>
            <p className="text-blue-100 mt-1">
              Gerenciamento completo de perícias judiciais
            </p>
          </div>
          <div className="flex items-center gap-4">
            {periciasAtrasadas.length > 0 && (
              <button
                onClick={() => handleCardClick("prazos_vencidos", null)}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors relative animate-pulse"
              >
                <AlertTriangle size={20} />
                <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {periciasAtrasadas.length}
                </span>
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-lg transition-colors relative ${
                  notificacoesNaoLidas > 0
                    ? "bg-yellow-500 hover:bg-yellow-600 animate-pulse"
                    : "bg-white/10 backdrop-blur hover:bg-white/20"
                }`}
              >
                <Bell size={20} />
                {notificacoesNaoLidas > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {notificacoesNaoLidas > 9 ? "9+" : notificacoesNaoLidas}
                  </span>
                )}
              </button>

              {/* Painel de Notificações */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
                  {/* Header do painel */}
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg text-gray-800">
                        Notificações
                      </h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    {notificacoesNaoLidas > 0 && (
                      <div className="flex gap-2">
                        <button
                          onClick={marcarTodasComoLidas}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Marcar todas como lidas
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={limparNotificacoes}
                          className="text-xs text-red-600 hover:text-red-800 font-medium"
                        >
                          Limpar lidas
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Lista de notificações */}
                  <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell
                          size={48}
                          className="mx-auto text-gray-300 mb-3"
                        />
                        <p className="text-gray-500">Nenhuma notificação</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Você está em dia! 🎉
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => abrirPericiaNotificacao(notif)}
                            className={`p-4 cursor-pointer transition-colors ${
                              notif.lida
                                ? "bg-white hover:bg-gray-50"
                                : notif.prioridade === "urgente"
                                ? "bg-red-50 hover:bg-red-100"
                                : notif.prioridade === "alta"
                                ? "bg-yellow-50 hover:bg-yellow-100"
                                : "bg-blue-50 hover:bg-blue-100"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                  notif.lida ? "bg-gray-300" : "bg-blue-500"
                                }`}
                              ></div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-semibold mb-1 ${
                                    notif.lida
                                      ? "text-gray-600"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {notif.titulo}
                                </p>
                                <p
                                  className={`text-xs mb-2 ${
                                    notif.lida
                                      ? "text-gray-500"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {notif.mensagem}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(notif.data).toLocaleString(
                                    "pt-BR",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              </div>
                              {!notif.lida && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    marcarComoLida(notif.id);
                                  }}
                                  className="flex-shrink-0 text-blue-600 hover:text-blue-800"
                                  title="Marcar como lida"
                                >
                                  <CheckCircle size={18} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
                      <p className="text-xs text-gray-500">
                        {notificacoesNaoLidas} não lida
                        {notificacoesNaoLidas !== 1 ? "s" : ""} de{" "}
                        {notifications.length} total
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
