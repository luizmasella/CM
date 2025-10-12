// FILE: src/components/NotificacoesPage.tsx
import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { Bell } from 'lucide-react';

export default function NotificacoesPage() {
    const { periciasAtrasadas } = usePericias();
    const { openProcessPage } = useUI();

    const notifications = periciasAtrasadas.map((p, index) => ({
        id: p.id,
        titulo: '🔴 Prazo Vencido!',
        mensagem: `Processo ${p.numeroProcesso}`,
        pericia: p,
    }));

    if (notifications.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold">Nenhuma Notificação</h2>
                <p className="text-gray-500">Você está em dia!</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Bell className="text-blue-600" />Central de Notificações</h2>
            <div className="space-y-3">
                {notifications.map(notif => (
                    <div key={notif.id} onClick={() => openProcessPage(notif.pericia)} className="p-4 rounded-lg bg-red-50 border border-red-200 cursor-pointer hover:bg-red-100">
                        <p className="font-bold text-red-800">{notif.titulo}</p>
                        <p className="text-gray-700">{notif.mensagem}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
