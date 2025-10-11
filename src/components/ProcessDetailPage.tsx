// FILE: src/components/ProcessDetailPage.tsx (VERSÃO 100% COMPLETA)

import React, { useState, useEffect } from "react";
import { usePericias } from "../context/PericiasContext";
import {
  ChevronRight,
  User,
  Calendar,
  Edit2,
  CheckCircle,
  X,
  FileText,
  CalendarDays,
  ClipboardList,
  Activity,
  DollarSign,
  Clock,
  Gavel,
  FileQuestion,
  Download,
  Plus,
} from "lucide-react";

interface ProcessDetailPageProps {
  currentPericia: any;
  closeProcessPage: () => void;
  statusConfig: any;
  tiposPericia: string[];
  regioesList: string[];
  isPrazoVencido: (prazo: string | null) => boolean;
  diasAtraso: (prazo: string | null) => number;
}

export default function ProcessDetailPage({
  currentPericia,
  closeProcessPage,
  statusConfig,
  tiposPericia,
  regioesList,
  isPrazoVencido,
  diasAtraso,
}: ProcessDetailPageProps) {
  const { updatePericia } = usePericias();

  const [processLocalPericia, setProcessLocalPericia] =
    useState(currentPericia);
  const [processIsEditing, setProcessIsEditing] = useState(false);
  const [processNewNote, setProcessNewNote] = useState("");
  const [processNotes, setProcessNotes] = useState([
    {
      id: 1,
      data: "2025-10-05",
      texto: "Reclamante compareceu pontualmente para avaliação inicial.",
      usuario: "Dr. Silva",
    },
    {
      id: 2,
      data: "2025-10-06",
      texto: "Solicitados exames complementares: ressonância magnética.",
      usuario: "Dr. Silva",
    },
  ]);

  useEffect(() => {
    setProcessLocalPericia(currentPericia);
  }, [currentPericia]);

  if (!currentPericia || !processLocalPericia) return null;

  const addNote = () => {
    if (processNewNote.trim()) {
      const nota = {
        id: processNotes.length + 1,
        data: new Date().toISOString().split("T")[0],
        texto: processNewNote,
        usuario: "Usuário Atual",
      };
      setProcessNotes([...processNotes, nota]);
      setProcessNewNote("");
    }
  };

  const saveChanges = () => {
    updatePericia(processLocalPericia);
    setProcessIsEditing(false);
    alert("Alterações salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <button
          onClick={closeProcessPage}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ChevronRight size={20} className="rotate-180" />
          Voltar para a lista
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {processLocalPericia.numeroProcesso}
            </h1>
            <div className="flex items-center gap-4 text-blue-100">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{processLocalPericia.reclamante}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>
                  {new Date(processLocalPericia.data).toLocaleDateString(
                    "pt-BR"
                  )}{" "}
                  às {processLocalPericia.hora}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!processIsEditing ? (
              <button
                onClick={() => setProcessIsEditing(true)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit2 size={18} /> Editar
              </button>
            ) : (
              <>
                <button
                  onClick={saveChanges}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <CheckCircle size={18} /> Salvar
                </button>
                <button
                  onClick={() => {
                    setProcessLocalPericia(currentPericia);
                    setProcessIsEditing(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <X size={18} /> Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="text-blue-600" /> Informações do Processo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Número do Processo
                  </label>
                  {processIsEditing ? (
                    <input
                      type="text"
                      value={processLocalPericia.numeroProcesso}
                      onChange={(e) =>
                        setProcessLocalPericia({
                          ...processLocalPericia,
                          numeroProcesso: e.target.value,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {processLocalPericia.numeroProcesso}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Reclamante
                  </label>
                  {processIsEditing ? (
                    <input
                      type="text"
                      value={processLocalPericia.reclamante}
                      onChange={(e) =>
                        setProcessLocalPericia({
                          ...processLocalPericia,
                          reclamante: e.target.value,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {processLocalPericia.reclamante}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tipo de Perícia
                  </label>
                  {processIsEditing ? (
                    <select
                      value={processLocalPericia.tipo}
                      onChange={(e) =>
                        setProcessLocalPericia({
                          ...processLocalPericia,
                          tipo: e.target.value,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {tiposPericia.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {processLocalPericia.tipo}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Vara
                  </label>
                  {processIsEditing ? (
                    <input
                      type="text"
                      value={processLocalPericia.vara || ""}
                      onChange={(e) =>
                        setProcessLocalPericia({
                          ...processLocalPericia,
                          vara: e.target.value,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {processLocalPericia.vara || "-"}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Reclamada(s)
                  </label>
                  <div className="mt-1 space-y-1">
                    {processLocalPericia.reclamadas.map(
                      (rec: string, idx: number) => (
                        <p
                          key={idx}
                          className="text-lg font-semibold text-gray-900"
                        >
                          • {rec}
                        </p>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Local
                  </label>
                  {processIsEditing ? (
                    <input
                      type="text"
                      value={processLocalPericia.local || ""}
                      onChange={(e) =>
                        setProcessLocalPericia({
                          ...processLocalPericia,
                          local: e.target.value,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {processLocalPericia.local || "-"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Região
                  </label>
                  {processIsEditing ? (
                    <select
                      value={processLocalPericia.regiao || ""}
                      onChange={(e) =>
                        setProcessLocalPericia({
                          ...processLocalPericia,
                          regiao: e.target.value,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione...</option>
                      {regioesList.map((regiao) => (
                        <option key={regiao} value={regiao}>
                          {regiao}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {processLocalPericia.regiao || "-"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CalendarDays className="text-blue-600" /> Datas e Prazos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">
                  Data da Perícia
                </label>
                {processIsEditing ? (
                  <input
                    type="date"
                    value={processLocalPericia.data}
                    onChange={(e) =>
                      setProcessLocalPericia({
                        ...processLocalPericia,
                        data: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-lg font-bold text-blue-700 mt-2">
                    {new Date(processLocalPericia.data).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                )}
                {!processIsEditing && (
                  <p className="text-sm text-gray-600 mt-1">
                    {processLocalPericia.hora}
                  </p>
                )}
              </div>
              <div
                className={`p-4 rounded-lg ${
                  isPrazoVencido(processLocalPericia.prazoLaudo)
                    ? "bg-red-50"
                    : "bg-purple-50"
                }`}
              >
                <label className="text-sm font-medium text-gray-600">
                  Prazo do Laudo
                </label>
                {processIsEditing ? (
                  <input
                    type="date"
                    value={processLocalPericia.prazoLaudo || ""}
                    onChange={(e) =>
                      setProcessLocalPericia({
                        ...processLocalPericia,
                        prazoLaudo: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <>
                    {" "}
                    <p
                      className={`text-lg font-bold mt-2 ${
                        isPrazoVencido(processLocalPericia.prazoLaudo)
                          ? "text-red-700"
                          : "text-purple-700"
                      }`}
                    >
                      {processLocalPericia.prazoLaudo
                        ? new Date(
                            processLocalPericia.prazoLaudo
                          ).toLocaleDateString("pt-BR")
                        : "-"}
                    </p>{" "}
                    {isPrazoVencido(processLocalPericia.prazoLaudo) && (
                      <p className="text-sm text-red-600 mt-1 font-semibold">
                        Vencido há {diasAtraso(processLocalPericia.prazoLaudo)}{" "}
                        dias
                      </p>
                    )}{" "}
                  </>
                )}
              </div>
              <div
                className={`p-4 rounded-lg ${
                  isPrazoVencido(processLocalPericia.prazoQuesitos)
                    ? "bg-red-50"
                    : "bg-orange-50"
                }`}
              >
                <label className="text-sm font-medium text-gray-600">
                  Prazo Quesitos
                </label>
                {processIsEditing ? (
                  <input
                    type="date"
                    value={processLocalPericia.prazoQuesitos || ""}
                    onChange={(e) =>
                      setProcessLocalPericia({
                        ...processLocalPericia,
                        prazoQuesitos: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <>
                    {" "}
                    <p
                      className={`text-lg font-bold mt-2 ${
                        isPrazoVencido(processLocalPericia.prazoQuesitos)
                          ? "text-red-700"
                          : "text-orange-700"
                      }`}
                    >
                      {processLocalPericia.prazoQuesitos
                        ? new Date(
                            processLocalPericia.prazoQuesitos
                          ).toLocaleDateString("pt-BR")
                        : "-"}
                    </p>{" "}
                    {isPrazoVencido(processLocalPericia.prazoQuesitos) && (
                      <p className="text-sm text-red-600 mt-1 font-semibold">
                        Vencido há{" "}
                        {diasAtraso(processLocalPericia.prazoQuesitos)} dias
                      </p>
                    )}{" "}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ClipboardList className="text-blue-600" /> Observações
            </h2>
            {processIsEditing ? (
              <textarea
                value={processLocalPericia.observacoes || ""}
                onChange={(e) =>
                  setProcessLocalPericia({
                    ...processLocalPericia,
                    observacoes: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={6}
                placeholder="Adicione observações sobre a perícia..."
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {processLocalPericia.observacoes ||
                  "Nenhuma observação registrada."}
              </p>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="text-blue-600" /> Anotações do Processo
            </h2>
            <div className="space-y-4">
              {processNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-blue-700">
                      {note.usuario}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(note.data).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-gray-700">{note.texto}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <textarea
                  value={processNewNote}
                  onChange={(e) => setProcessNewNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Adicionar nova anotação..."
                />
                <button
                  onClick={addNote}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} /> Adicionar Anotação
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="text-blue-600" /> Status
            </h2>
            {processIsEditing ? (
              <select
                value={processLocalPericia.status}
                onChange={(e) =>
                  setProcessLocalPericia({
                    ...processLocalPericia,
                    status: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(statusConfig).map(
                  ([key, config]: [string, any]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  )
                )}
              </select>
            ) : (
              <div className="text-center">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    statusConfig[processLocalPericia.status].color
                  }`}
                >
                  {React.createElement(
                    statusConfig[processLocalPericia.status].icon,
                    { size: 16, className: "mr-2" }
                  )}
                  {statusConfig[processLocalPericia.status].label}
                </span>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <DollarSign className="text-blue-600" /> Honorários
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Solicitados
                </label>
                {processIsEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={processLocalPericia.honorariosSolicitados || ""}
                    onChange={(e) =>
                      setProcessLocalPericia({
                        ...processLocalPericia,
                        honorariosSolicitados: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    R${" "}
                    {(
                      processLocalPericia.honorariosSolicitados || 0
                    ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Deferidos
                </label>
                {processIsEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={processLocalPericia.honorariosDeferidos || ""}
                    onChange={(e) =>
                      setProcessLocalPericia({
                        ...processLocalPericia,
                        honorariosDeferidos: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    R${" "}
                    {(
                      processLocalPericia.honorariosDeferidos || 0
                    ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
              {!processIsEditing &&
                processLocalPericia.honorariosSolicitados > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Taxa de Deferimento</span>
                      <span className="font-semibold">
                        {(
                          (processLocalPericia.honorariosDeferidos /
                            processLocalPericia.honorariosSolicitados) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{
                          width: `${
                            (processLocalPericia.honorariosDeferidos /
                              processLocalPericia.honorariosSolicitados) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="text-blue-600" /> Histórico
            </h2>
            <div className="space-y-3">
              {processLocalPericia.historico &&
                processLocalPericia.historico.map(
                  (item: any, index: number) => (
                    <div
                      key={index}
                      className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
                    >
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.acao}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.data).toLocaleDateString("pt-BR")} -{" "}
                        {item.usuario}
                      </p>
                    </div>
                  )
                )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Gavel className="text-blue-600" /> Ações Rápidas
            </h2>
            <div className="space-y-2">
              <button className="w-full bg-blue-50 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors text-left flex items-center gap-2">
                <FileText size={18} /> Gerar Laudo
              </button>
              <button className="w-full bg-purple-50 text-purple-700 px-4 py-3 rounded-lg hover:bg-purple-100 transition-colors text-left flex items-center gap-2">
                <FileQuestion size={18} /> Responder Quesitos
              </button>
              <button className="w-full bg-green-50 text-green-700 px-4 py-3 rounded-lg hover:bg-green-100 transition-colors text-left flex items-center gap-2">
                <Download size={18} /> Exportar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
