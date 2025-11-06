// src/services/fileService.ts
import apiClient from './apiClient';
import { AttachedFile } from '../types';

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

/**
 * Envia um arquivo para o backend (simulado).
 * Em um app real, o backend processaria o upload para um serviço de nuvem (S3, etc.).
 */
async function uploadFile(file: File): Promise<{ success: boolean; file?: AttachedFile; message: string }> {
  // Validação no lado do cliente
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { success: false, message: `O arquivo excede o limite de ${MAX_FILE_SIZE_MB}MB.` };
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { success: false, message: 'Tipo de arquivo não suportado.' };
  }

  // FormData é o formato padrão para enviar arquivos em requisições HTTP
  const formData = new FormData();
  formData.append('file', file);

  try {
    // json-server não suporta upload de arquivos, então vamos simular o POST
    // para um endpoint que não existe. Em um app real, este endpoint existiria.
    // A resposta será mockada aqui mesmo, simulando o que o backend retornaria.

    console.log('Simulando envio de arquivo para a API:', file.name);

    // Simulação da resposta da API
    const mockApiResponse: AttachedFile = {
      name: file.name,
      // Em um backend real, esta URL apontaria para o arquivo no S3 ou similar
      url: `https://fake-storage.com/${Date.now()}-${file.name}`,
      type: file.type,
    };

    // Simulando um pequeno atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true, file: mockApiResponse, message: 'Upload bem-sucedido!' };

  } catch (error) {
    console.error('Erro ao fazer upload do arquivo (simulado):', error);
    return { success: false, message: 'Ocorreu um erro durante o upload.' };
  }
}

/**
 * Simula a exclusão de um arquivo no backend.
 */
async function deleteFile(fileUrl: string): Promise<{ success: boolean; message: string }> {
  try {
    // Em um app real, você extrairia o nome do arquivo ou ID da URL e enviaria
    // uma requisição DELETE para a API, ex: apiClient.delete(`/files/${fileName}`);

    console.log('Simulando exclusão de arquivo na API:', fileUrl);

    // Simulando um pequeno atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));

    return { success: true, message: 'Arquivo deletado com sucesso.' };

  } catch (error) {
    console.error('Erro ao deletar arquivo (simulado):', error);
    return { success: false, message: 'Ocorreu um erro ao deletar o arquivo.' };
  }
}

export const fileService = {
  uploadFile,
  deleteFile,
};
