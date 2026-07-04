import { expect, test } from '@playwright/test'

test('landing page renders and demos work', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'React 19 starter template' })).toBeVisible()

  const counter = page.getByRole('button', { name: /Zustand counter/ })
  await counter.click()
  await expect(counter).toHaveText('Zustand counter: 1')

  await page.getByRole('link', { name: /Router demo/ }).click()
  await expect(page.getByRole('heading', { name: 'Second route' })).toBeVisible()
})
