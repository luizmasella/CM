// FILE: src/components/PericiaDetails.tsx
import React, { useState, useEffect } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { statusConfig, tiposPericia } from '../config/constants';
import { Edit2, X, AlertTriangle, User, Calendar, Briefcase, DollarSign, ClipboardList, Clock } from 'lucide-react';

export default function PericiaDetails() {
  const { updatePericia, isPrazoVencido } = usePericias();
  const { showDetails, selectedPericia, closeDetails } = useUI();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => { if (selectedPericia) { setEditData(selectedPericia); } }, [selectedPericia]);
  if (!showDetails || !selectedPericia) { return null; }

  const handleSave = () => { updatePericia(editData); setIsEditing(false); };
  const diasAtraso = (prazo: string | null): number => { if (!prazo) return 0; const hoje = new Date(); hoje.setHours(0, 0, 0, 0); const [ano, mes, dia] = prazo.split('-').map(Number); const dataPrazo = new Date(ano, mes - 1, dia); const diffTime = hoje.getTime() - dataPrazo.getTime(); const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); return diffDays > 0 ? diffDays : 0; };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div><h3 className="text-2xl font-bold">Detalhes da Perícia</h3><p className="text-blue-100 mt-1">Processo: {selectedPericia.numeroProcesso}</p></div>
            <div className="flex gap-2">
              {!isEditing && <button onClick={() => setIsEditing(true)} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2"><Edit2 size={18} /> Editar</button>}
              <button onClick={closeDetails} className="text-white hover:bg-white/20 p-2 rounded-lg"><X size={24} /></button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-2">Tipo</label><select value={editData.tipo} onChange={(e) => setEditData({ ...editData, tipo: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">{tiposPericia.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-2">Status</label><select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">{Object.entries(statusConfig).map(([key, config]) => <option key={key} value={key}>{config.label}</option>)}</select></div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Salvar</button>
                <button onClick={() => { setEditData(selectedPericia); setIsEditing(false); }} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg">Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {(isPrazoVencido(selectedPericia.prazoLaudo) || isPrazoVencido(selectedPericia.prazoQuesitos)) && <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-center gap-3"><AlertTriangle className="text-red-600" size={24} /><div><p className="font-semibold text-red-800">Prazo Vencido!</p>{isPrazoVencido(selectedPericia.prazoLaudo) && <p>Laudo vencido há {diasAtraso(selectedPericia.prazoLaudo)} dias</p>}{isPrazoVencido(selectedPericia.prazoQuesitos) && <p>Quesitos vencido há {diasAtraso(selectedPericia.prazoQuesitos)} dias</p>}</div></div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold mb-3 flex items-center gap-2"><User size={18} /> Partes</h4><p>Reclamante: <span className="font-medium">{selectedPericia.reclamante}</span></p><p>Reclamada(s):</p>{selectedPericia.reclamadas.map((r: string) => <p key={r} className="font-medium ml-2">• {r}</p>)}</div>
                <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold mb-3 flex items-center gap-2"><Calendar size={18} /> Datas</h4><p>Data da Perícia: <span className="font-medium">{new Date(selectedPericia.data).toLocaleDateString('pt-BR')}</span></p>{selectedPericia.prazoLaudo && <p>Prazo do Laudo: <span className="font-medium">{new Date(selectedPericia.prazoLaudo).toLocaleDateString('pt-BR')}</span></p>}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
