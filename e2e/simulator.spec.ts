import { expect, test } from '@playwright/test'

test('simulator renders and turns slider drives the ledger', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /LLM token & cost simulator/ })).toBeVisible()

  const rows = page.getByTestId('ledger-body').locator('tr')
  await expect(rows).toHaveCount(8) // SWE preset default

  await page.getByLabel('Total turns in session').fill('12')
  await expect(rows).toHaveCount(12)
})
