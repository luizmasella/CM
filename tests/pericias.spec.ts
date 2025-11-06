// tests/pericias.spec.ts
import { test, expect } from '@playwright/test';

// Gera um e-mail único para cada execução de teste para garantir o isolamento
const generateUniqueEmail = () => `testuser_${Date.now()}@example.com`;

test('Fluxo completo: Registro, Login e CRUD de Perícias', async ({ page }) => {
  const userEmail = generateUniqueEmail();
  const userPassword = 'password123';

  // --- 1. Registro do Usuário ---
  await page.goto('/register');
  await expect(page).toHaveURL('/register');

  await page.locator('input[id="email"]').fill(userEmail);
  await page.locator('input[id="password"]').fill(userPassword);
  await page.getByRole('button', { name: 'Registrar' }).click();

  // --- 2. Login ---
  // Após o registro, o usuário é redirecionado para a página de login
  await expect(page).toHaveURL('/login');

  await page.locator('input[id="email"]').fill(userEmail);
  await page.locator('input[id="password"]').fill(userPassword);
  await page.getByRole('button', { name: 'Entrar' }).click();

  // --- 3. Acessar a página de Perícias ---
  // Após o login, o usuário deve ser redirecionado para o dashboard
  await expect(page).toHaveURL('/dashboard');

  // Clica no link de navegação para 'Perícias'
  await page.getByRole('link', { name: 'Perícias' }).click();
  await expect(page).toHaveURL('/pericias');

  // --- 4. CRUD de Perícias ---

  // 4a. Verificar Estado Vazio
  await expect(page.getByText('Comece a organizar suas perícias')).toBeVisible();

  // 4b. Adicionar uma nova Perícia
  await page.getByRole('button', { name: 'Nova Perícia' }).click();

  // Preenche o formulário
  await page.locator('input[name="numeroProcesso"]').fill('PROCESSO-E2E-123');
  await page.locator('input[name="reclamante"]').fill('Reclamante E2E Test');
  await page.locator('input[name="reclamadas"]').fill('Reclamada E2E Test');
  await page.getByRole('button', { name: 'Adicionar' }).click(); // Supondo que o nome do botão de salvar é 'Adicionar'

  // 4c. Verificar se a Perícia está na tabela
  await expect(page.getByText('PROCESSO-E2E-123')).toBeVisible();
  await expect(page.getByText('Reclamante E2E Test')).toBeVisible();

  // 4d. Deletar a Perícia
  // Encontra a linha da tabela que contém o texto do processo e clica no botão de deletar dentro dela
  const periciaRow = page.locator('tr', { hasText: 'PROCESSO-E2E-123' });
  await periciaRow.getByRole('button', { name: 'Excluir' }).click();

  // Confirma a exclusão no modal
  await page.getByRole('button', { name: 'Sim, excluir' }).click();

  // 4e. Verificar o Estado Vazio novamente
  await expect(page.getByText('Comece a organizar suas perícias')).toBeVisible();
});
