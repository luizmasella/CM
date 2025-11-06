// src/services/periciaService.ts
import apiClient from './apiClient';
import { Pericia } from '../types';

// Busca todas as perícias associadas a um userId
async function getPericias(userId: number): Promise<Pericia[]> {
  try {
    const { data } = await apiClient.get<Pericia[]>(`/pericias?userId=${userId}`);
    return data;
  } catch (error) {
    console.error(`Erro ao buscar perícias para o usuário ${userId}:`, error);
    throw error; // Propaga o erro para ser tratado no hook
  }
}

// Cria uma nova perícia
async function createPericia(periciaData: Omit<Pericia, 'id'>, userId: number): Promise<Pericia> {
  try {
    const dataToSend = { ...periciaData, userId };
    const { data } = await apiClient.post<Pericia>('/pericias', dataToSend);
    return data;
  } catch (error) {
    console.error('Erro ao criar perícia:', error);
    throw error;
  }
}

// Atualiza uma perícia existente
async function updatePericia(periciaId: number, periciaData: Pericia): Promise<Pericia> {
  try {
    const { data } = await apiClient.put<Pericia>(`/pericias/${periciaId}`, periciaData);
    return data;
  } catch (error) {
    console.error(`Erro ao atualizar perícia ${periciaId}:`, error);
    throw error;
  }
}

// Deleta uma perícia
async function deletePericia(periciaId: number): Promise<void> {
  try {
    await apiClient.delete(`/pericias/${periciaId}`);
  } catch (error) {
    console.error(`Erro ao deletar perícia ${periciaId}:`, error);
    throw error;
  }
}

export const periciaService = {
  getPericias,
  createPericia,
  updatePericia,
  deletePericia,
};
