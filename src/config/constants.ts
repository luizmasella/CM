import { Clock, FileText, FileQuestion, Gavel, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const statusConfig = { 
  aguarda_ato_pericial: { label: 'Aguardando Ato Pericial', color: 'bg-blue-100 text-blue-800', icon: Clock }, 
  aguarda_laudo: { label: 'Aguardando Laudo', color: 'bg-purple-100 text-purple-800', icon: FileText }, 
  aguarda_quesitos: { label: 'Aguardando Quesitos Complementares', color: 'bg-orange-100 text-orange-800', icon: FileQuestion }, 
  aguarda_sentenca: { label: 'Aguardando Sentença', color: 'bg-indigo-100 text-indigo-800', icon: Gavel }, 
  aguarda_pagamento: { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-800', icon: DollarSign }, 
  concluida: { label: 'Concluída', color: 'bg-green-100 text-green-800', icon: CheckCircle }, 
  cancelada: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: XCircle }, 
  recusada: { label: 'Recusada', color: 'bg-gray-100 text-gray-800', icon: AlertCircle } 
};

export const tiposPericia = ['Médica', 'Psiquiátrica', 'Ortopédica', 'Cardiológica', 'Neurológica'];

// regioesList foi REMOVIDO - agora usa RegioesContext
