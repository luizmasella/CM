// FILE: src/components/CalendarView.tsx

import React from "react";
import {
  CalendarDays,
  ChevronRight,
  Calendar,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface CalendarViewProps {
  currentMonth: Date;
  pericias: any[];
  periciasAtrasadas: any[];
  navigateMonth: (direction: number) => void;
  goToToday: () => void;
  getDaysInMonth: (date: Date) => any;
  formatDateString: (year: number, month: number, day: number) => string;
  getPericiasForDate: (dateString: string) => any[];
  getPrazosForDate: (dateString: string) => any[];
  isToday: (year: number, month: number, day: number) => boolean;
  isPrazoVencido: (prazo: string) => boolean;
  diasAtraso: (prazo: string) => number;
  setSelectedDate: (date: string) => void;
  setFilterDate: (date: string) => void;
  setActiveTab: (tab: string) => void;
  openProcessPage: (pericia: any) => void;
}

export default function CalendarView({
  currentMonth,
  pericias,
  periciasAtrasadas,
  navigateMonth,
  goToToday,
  getDaysInMonth,
  formatDateString,
  getPericiasForDate,
  getPrazosForDate,
  isToday,
  isPrazoVencido,
  diasAtraso,
  setSelectedDate,
  setFilterDate,
  setActiveTab,
  openProcessPage,
}: CalendarViewProps) {
  return (
    <div className="space-y-6">
      {/* Cabeçalho do Calendário */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarDays className="text-blue-600" />
            Calendário de Perícias e Prazos
          </h2>

          <div className="flex gap-2">
            <button
              onClick={goToToday}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Calendar size={18} />
              Hoje
            </button>
          </div>
        </div>

        {/* Navegação do Mês */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={24} className="rotate-180" />
          </button>

          <h3 className="text-xl font-bold">
            {currentMonth.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </h3>

          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Perícias Agendadas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Prazos Próximos (7 dias)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Prazos Vencidos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Hoje</span>
          </div>
        </div>

        {/* Calendário */}
        <div className="grid grid-cols-7 gap-2">
          {/* Cabeçalho dos dias da semana */}
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div key={day} className="text-center font-bold text-gray-600 py-2">
              {day}
            </div>
          ))}

          {/* Dias do mês */}
          {(() => {
            const { daysInMonth, startingDayOfWeek, year, month } =
              getDaysInMonth(currentMonth);
            const days = [];

            // Células vazias antes do primeiro dia
            for (let i = 0; i < startingDayOfWeek; i++) {
              days.push(
                <div
                  key={`empty-${i}`}
                  className="aspect-square p-2 bg-gray-50 rounded-lg"
                ></div>
              );
            }

            // Dias do mês
            for (let day = 1; day <= daysInMonth; day++) {
              const dateString = formatDateString(year, month, day);
              const periciasNoDia = getPericiasForDate(dateString);
              const prazosNoDia = getPrazosForDate(dateString);
              const isHoje = isToday(year, month, day);

              // Verificar se há prazos vencidos
              const temPrazoVencido = prazosNoDia.some((p) =>
                isPrazoVencido(dateString)
              );

              // Verificar se há prazos próximos (próximos 7 dias)
              const hoje = new Date();
              const dataAtual = new Date(year, month, day);
              const diffDays = Math.ceil(
                (dataAtual.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
              );
              const temPrazoProximo =
                diffDays >= 0 && diffDays <= 7 && prazosNoDia.length > 0;

              days.push(
                <div
                  key={day}
                  onClick={() => {
                    setSelectedDate(dateString);
                    setFilterDate(dateString);
                    setActiveTab("pericias");
                  }}
                  className={`aspect-square p-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    isHoje
                      ? "bg-green-100 border-2 border-green-500"
                      : temPrazoVencido
                      ? "bg-red-50 border-2 border-red-400"
                      : temPrazoProximo
                      ? "bg-yellow-50 border-2 border-yellow-400"
                      : periciasNoDia.length > 0
                      ? "bg-blue-50 border-2 border-blue-300"
                      : "bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div
                      className={`text-sm font-semibold mb-1 ${
                        isHoje ? "text-green-700" : "text-gray-700"
                      }`}
                    >
                      {day}
                    </div>

                    <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                      {periciasNoDia.length > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-xs font-medium text-blue-700">
                            {periciasNoDia.length} perícia
                            {periciasNoDia.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}

                      {prazosNoDia.length > 0 && (
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              temPrazoVencido ? "bg-red-500" : "bg-yellow-500"
                            }`}
                          ></div>
                          <span
                            className={`text-xs font-medium ${
                              temPrazoVencido
                                ? "text-red-700"
                                : "text-yellow-700"
                            }`}
                          >
                            {prazosNoDia.length} prazo
                            {prazosNoDia.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return days;
          })()}
        </div>
      </div>

      {/* Resumo do Mês */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Perícias Agendadas
          </h3>
          <div className="space-y-2">
            {(() => {
              const periciasDoMes = pericias.filter((p) => {
                const pDate = new Date(p.data);
                return (
                  pDate.getMonth() === currentMonth.getMonth() &&
                  pDate.getFullYear() === currentMonth.getFullYear()
                );
              });

              if (periciasDoMes.length === 0) {
                return (
                  <p className="text-gray-500 text-sm">
                    Nenhuma perícia agendada neste mês
                  </p>
                );
              }

              return periciasDoMes.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  onClick={() => openProcessPage(p)}
                  className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-sm text-blue-900">
                    {new Date(p.data).toLocaleDateString("pt-BR")} - {p.hora}
                  </p>
                  <p className="text-xs text-gray-600">{p.reclamante}</p>
                  <p className="text-xs text-blue-600">{p.tipo}</p>
                </div>
              ));
            })()}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="text-yellow-600" />
            Prazos Próximos
          </h3>
          <div className="space-y-2">
            {(() => {
              const hoje = new Date();
              const seteDias = new Date(
                hoje.getTime() + 7 * 24 * 60 * 60 * 1000
              );

              const prazosProximos = pericias.filter((p) => {
                const prazoLaudo = p.prazoLaudo ? new Date(p.prazoLaudo) : null;
                const prazoQuesitos = p.prazoQuesitos
                  ? new Date(p.prazoQuesitos)
                  : null;

                return (
                  (prazoLaudo &&
                    prazoLaudo >= hoje &&
                    prazoLaudo <= seteDias) ||
                  (prazoQuesitos &&
                    prazoQuesitos >= hoje &&
                    prazoQuesitos <= seteDias)
                );
              });

              if (prazosProximos.length === 0) {
                return (
                  <p className="text-gray-500 text-sm">Nenhum prazo próximo</p>
                );
              }

              return prazosProximos.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  onClick={() => openProcessPage(p)}
                  className="p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-sm text-yellow-900">
                    {p.prazoLaudo && new Date(p.prazoLaudo) <= seteDias
                      ? `Laudo: ${new Date(p.prazoLaudo).toLocaleDateString(
                          "pt-BR"
                        )}`
                      : `Quesitos: ${new Date(
                          p.prazoQuesitos
                        ).toLocaleDateString("pt-BR")}`}
                  </p>
                  <p className="text-xs text-gray-600">{p.numeroProcesso}</p>
                </div>
              ));
            })()}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <XCircle className="text-red-600" />
            Prazos Vencidos
          </h3>
          <div className="space-y-2">
            {periciasAtrasadas.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum prazo vencido! 🎉</p>
            ) : (
              periciasAtrasadas.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  onClick={() => openProcessPage(p)}
                  className="p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-sm text-red-900">
                    {isPrazoVencido(p.prazoLaudo)
                      ? `Laudo vencido há ${diasAtraso(p.prazoLaudo)} dias`
                      : `Quesitos vencidos há ${diasAtraso(
                          p.prazoQuesitos
                        )} dias`}
                  </p>
                  <p className="text-xs text-gray-600">{p.numeroProcesso}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
