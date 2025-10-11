// FILE: src/components/PericiaDetails.tsx

import React, { useState, useEffect } from "react";
import {
  Edit2,
  X,
  AlertTriangle,
  User,
  Calendar,
  Briefcase,
  DollarSign,
  ClipboardList,
  Clock,
} from "lucide-react";

interface PericiaDetailsProps {
  showDetails: boolean;
  selectedPericia: any;
  setShowDetails: (show: boolean) => void;
  setSelectedPericia: (pericia: any) => void;
  statusConfig: any;
  tiposPericia: string[];
  isPrazoVencido: (prazo: string | null) => boolean;
  diasAtraso: (prazo: string | null) => number;
  handleSaveDetails: (updatedData: any) => void;
}

export default function PericiaDetails({
  showDetails,
  selectedPericia,
  setShowDetails,
  setSelectedPericia,
  statusConfig,
  tiposPericia,
  isPrazoVencido,
  diasAtraso,
  handleSaveDetails,
}: PericiaDetailsProps) {
  const [periciaDetailsEditMode, setPericiaDetailsEditMode] = useState(false);
  const [periciaDetailsEditData, setPericiaDetailsEditData] =
    useState<any>(null);

  useEffect(() => {
    if (selectedPericia) {
      setPericiaDetailsEditData(selectedPericia);
    }
  }, [selectedPericia]);

  if (!showDetails || !selectedPericia) {
    return null;
  }

  const handleClose = () => {
    setShowDetails(false);
    setSelectedPericia(null);
    setPericiaDetailsEditMode(false);
  };

  const handleSave = () => {
    handleSaveDetails(periciaDetailsEditData);
    setPericiaDetailsEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold">Detalhes da Perícia</h3>
              <p className="text-blue-100 mt-1">
                Processo: {selectedPericia.numeroProcesso}
              </p>
            </div>
            <div className="flex gap-2">
              {!periciaDetailsEditMode && (
                <button
                  onClick={() => setPericiaDetailsEditMode(true)}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Edit2 size={18} />
                  Editar
                </button>
              )}
              <button
                onClick={handleClose}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {periciaDetailsEditMode ? (
            // MODO DE EDIÇÃO
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Outros campos de input podem ser adicionados aqui */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo</label>
                  <select
                    value={periciaDetailsEditData.tipo}
                    onChange={(e) =>
                      setPericiaDetailsEditData({
                        ...periciaDetailsEditData,
                        tipo: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {tiposPericia.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={periciaDetailsEditData.status}
                    onChange={(e) =>
                      setPericiaDetailsEditData({
                        ...periciaDetailsEditData,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(statusConfig).map(
                      ([key, config]: [string, any]) => (
                        <option key={key} value={key}>
                          {config.label}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Observações
                </label>
                <textarea
                  value={periciaDetailsEditData.observacoes || ""}
                  onChange={(e) =>
                    setPericiaDetailsEditData({
                      ...periciaDetailsEditData,
                      observacoes: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={() => {
                    setPericiaDetailsEditData(selectedPericia);
                    setPericiaDetailsEditMode(false);
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            // MODO DE VISUALIZAÇÃO
            <div className="space-y-6">
              {(isPrazoVencido(selectedPericia.prazoLaudo) ||
                isPrazoVencido(selectedPericia.prazoQuesitos)) && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-center gap-3">
                  <AlertTriangle className="text-red-600" size={24} />
                  <div>
                    <p className="font-semibold text-red-800">
                      Atenção: Prazo Vencido!
                    </p>
                    {isPrazoVencido(selectedPericia.prazoLaudo) && (
                      <p className="text-sm text-red-700">
                        Prazo do laudo vencido há{" "}
                        {diasAtraso(selectedPericia.prazoLaudo)} dias
                      </p>
                    )}
                    {isPrazoVencido(selectedPericia.prazoQuesitos) && (
                      <p className="text-sm text-red-700">
                        Prazo dos quesitos vencido há{" "}
                        {diasAtraso(selectedPericia.prazoQuesitos)} dias
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <User size={18} /> Partes
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Reclamante</p>
                      <p className="font-medium">
                        {selectedPericia.reclamante}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reclamada(s)</p>
                      {selectedPericia.reclamadas.map(
                        (rec: string, idx: number) => (
                          <p key={idx} className="font-medium">
                            • {rec}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar size={18} /> Datas e Prazos
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Data da Perícia</p>
                      <p className="font-medium">
                        {new Date(selectedPericia.data).toLocaleDateString(
                          "pt-BR"
                        )}{" "}
                        às {selectedPericia.hora}
                      </p>
                    </div>
                    {selectedPericia.prazoLaudo && (
                      <div>
                        <p className="text-sm text-gray-600">Prazo do Laudo</p>
                        <p
                          className={`font-medium ${
                            isPrazoVencido(selectedPericia.prazoLaudo)
                              ? "text-red-600"
                              : ""
                          }`}
                        >
                          {new Date(
                            selectedPericia.prazoLaudo
                          ).toLocaleDateString("pt-BR")}
                          {isPrazoVencido(selectedPericia.prazoLaudo) &&
                            " (VENCIDO)"}
                        </p>
                      </div>
                    )}
                    {selectedPericia.prazoQuesitos && (
                      <div>
                        <p className="text-sm text-gray-600">
                          Prazo dos Quesitos
                        </p>
                        <p
                          className={`font-medium ${
                            isPrazoVencido(selectedPericia.prazoQuesitos)
                              ? "text-red-600"
                              : ""
                          }`}
                        >
                          {new Date(
                            selectedPericia.prazoQuesitos
                          ).toLocaleDateString("pt-BR")}
                          {isPrazoVencido(selectedPericia.prazoQuesitos) &&
                            " (VENCIDO)"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedPericia.observacoes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <ClipboardList size={18} /> Observações
                  </h4>
                  <p className="text-gray-700">{selectedPericia.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
