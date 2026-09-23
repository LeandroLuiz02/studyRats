import { expect, test } from '@playwright/test'

test.describe('fluxo principal do app no navegador', () => {
  test('grupo existente mostra feed agrupado por data e ranking do mês', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'StudyRats' })).toBeVisible()
    await page.getByText('Concurso TRT 2027').click()

    await expect(page.getByRole('heading', { name: 'Concurso TRT 2027' })).toBeVisible()
    await expect(page.getByText('Hoje')).toBeVisible()

    await page.getByRole('button', { name: 'Ranking' }).click()
    await expect(page.getByText(/Ranking de/)).toBeVisible()

    // Clicar em um membro do ranking abre o calendário mensal dele.
    await page.getByText('Leandro Luiz').click()
    await expect(page.getByRole('dialog', { name: 'Leandro Luiz' })).toBeVisible()

    await page.getByRole('button', { name: 'Ver todas as sessões' }).click()
    await expect(page.getByRole('heading', { name: 'Sessões de Leandro Luiz' })).toBeVisible()
  })

  test('criar grupo, publicar sessão e vê-la no feed do grupo', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: '+ Criar grupo' }).click()
    await page.getByLabel('Nome do grupo').fill('Grupo E2E')
    await page.getByRole('button', { name: 'Criar grupo', exact: true }).click()

    await expect(page.getByRole('heading', { name: 'Grupo E2E' })).toBeVisible()

    await page.getByRole('button', { name: 'Publicar sessão de estudo' }).click()
    await page.getByLabel('Título').fill('Sessão criada no teste E2E')
    await page.getByRole('button', { name: '45min' }).click()
    await page.getByRole('button', { name: 'Publicar', exact: true }).click()

    await expect(page.getByText('Sessão criada no teste E2E')).toBeVisible()
    await expect(page.getByText('⏱ 45min')).toBeVisible()
  })
})
