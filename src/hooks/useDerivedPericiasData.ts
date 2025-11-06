// src/hooks/useDerivedPericiasData.ts
import { useMemo } from 'react';
import { Pericia } from '../types';
import { errorHandler, ErrorCategory, ErrorSeverity } from '../utils/errorHandler';

// Funções utilitárias de data (poderiam ser movidas para um arquivo utils/date.ts no futuro)
const isPrazoVencido = (prazo: string | null): boolean => {
  try {
    if (!prazo) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataPrazo = new Date(prazo);
    dataPrazo.setHours(0, 0, 0, 0);
    return dataPrazo < hoje;
  } catch (error) {
    errorHandler.logError(ErrorCategory.PROCESSING, ErrorSeverity.LOW, 'IsPrazoVencido', error);
    return false;
  }
};

const diasParaPrazo = (prazo: string | null): number => {
  try {
    if (!prazo) return 999;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataPrazo = new Date(prazo);
    dataPrazo.setHours(0, 0, 0, 0);
    const diffTime = dataPrazo.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    errorHandler.logError(ErrorCategory.PROCESSING, ErrorSeverity.LOW, 'DiasParaPrazo', error);
    return 999;
  }
};

export const getPrazoStatus = (prazo: string | null): 'vencido' | '7dias' | '15dias' | 'normal' => {
  try {
    if (!prazo) return 'normal';
    const dias = diasParaPrazo(prazo);
    if (dias < 0) return 'vencido';
    if (dias >= 0 && dias <= 7) return '7dias';
    if (dias > 7 && dias <= 15) return '15dias';
    return 'normal';
  } catch (error) {
    errorHandler.logError(ErrorCategory.PROCESSING, ErrorSeverity.LOW, 'GetPrazoStatus', error);
    return 'normal';
  }
};

// Hook principal
export function useDerivedPericiasData(
  pericias: Pericia[],
  searchTerm: string,
  filterStatus: string,
  filterDate: string,
  filterPrazo: string
) {
  const periciasAtrasadas = useMemo(() =>
    pericias.filter(p =>
      (p.prazoLaudo && isPrazoVencido(p.prazoLaudo)) ||
      (p.prazoQuesitos && isPrazoVencido(p.prazoQuesitos))
    ), [pericias]
  );

  const prazos7Dias = useMemo(() =>
    pericias.filter(p => {
      const prazos = [p.prazoLaudo, p.prazoQuesitos].filter(Boolean);
      return prazos.some(prazo => {
        const dias = diasParaPrazo(prazo);
        return dias >= 0 && dias <= 7;
      });
    }), [pericias]
  );

  const prazos15Dias = useMemo(() =>
    pericias.filter(p => {
      const prazos = [p.prazoLaudo, p.prazoQuesitos].filter(Boolean);
      return prazos.some(prazo => {
        const dias = diasParaPrazo(prazo);
        return dias > 7 && dias <= 15;
      });
    }), [pericias]
  );

  const filteredPericias = useMemo(() => {
    return pericias.filter(p => {
      const matchesSearch = p.numeroProcesso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.reclamante.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'todos' || p.status === filterStatus;
      const matchesDate = filterDate === '' || p.data === filterDate || p.prazoLaudo === filterDate || p.prazoQuesitos === filterDate;

      let matchesPrazo = true;
      if (filterPrazo === 'vencidos') {
        matchesPrazo = (p.prazoLaudo && isPrazoVencido(p.prazoLaudo)) || (p.prazoQuesitos && isPrazoVencido(p.prazoQuesitos));
      } else if (filterPrazo === '7dias') {
        const prazos = [p.prazoLaudo, p.prazoQuesitos].filter(Boolean);
        matchesPrazo = prazos.some(prazo => diasParaPrazo(prazo) >= 0 && diasParaPrazo(prazo) <= 7);
      } else if (filterPrazo === '15dias') {
        const prazos = [p.prazoLaudo, p.prazoQuesitos].filter(Boolean);
        matchesPrazo = prazos.some(prazo => diasParaPrazo(prazo) > 7 && diasParaPrazo(prazo) <= 15);
      }

      return matchesSearch && matchesStatus && matchesDate && matchesPrazo;
    });
  }, [pericias, searchTerm, filterStatus, filterDate, filterPrazo]);

  const stats = useMemo(() => {
    return {
      total: pericias.length,
      aguarda_ato_pericial: pericias.filter(p => p.status === 'aguarda_ato_pericial').length,
      aguarda_laudo: pericias.filter(p => p.status === 'aguarda_laudo').length,
      aguarda_quesitos: pericias.filter(p => p.status === 'aguarda_quesitos').length,
      aguarda_sentenca: pericias.filter(p => p.status === 'aguarda_sentenca').length,
      aguarda_pagamento: pericias.filter(p => p.status === 'aguarda_pagamento').length,
      concluidas: pericias.filter(p => p.status === 'concluida').length,
      prazosVencidos: periciasAtrasadas.length,
      prazos7Dias: prazos7Dias.length,
      prazos15Dias: prazos15Dias.length,
      hojeAgendadas: pericias.filter(p => p.data === new Date().toISOString().split('T')[0]).length,
      totalHonorariosSolicitados: pericias.reduce((sum, p) => sum + (p.honorariosSolicitados || 0), 0),
      totalHonorariosDeferidos: pericias.reduce((sum, p) => sum + (p.honorariosDeferidos || 0), 0),
      honorariosAReceber: pericias.filter(p => p.status === 'aguarda_pagamento').reduce((sum, p) => sum + (p.honorariosDeferidos || 0), 0),
      totalHonorariosPagos: pericias.filter(p => p.status === 'concluida').reduce((sum, p) => sum + (p.honorariosDeferidos || 0), 0),
    };
  }, [pericias, periciasAtrasadas, prazos7Dias, prazos15Dias]);

  return {
    stats,
    filteredPericias,
    periciasAtrasadas,
    prazos7Dias,
    prazos15Dias,
    isPrazoVencido, // Exportando a função utilitária
  };
}
