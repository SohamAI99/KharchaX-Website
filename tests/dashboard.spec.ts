import { test, expect } from '@playwright/test';

test('Dashboard loads and displays core financial data', async ({ page }) => {
  // Navigate to Dashboard
  await page.goto('/dashboard');

  // Verify Header
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // Verify Data Cards
  await expect(page.getByText('Total Group Expenses')).toBeVisible();
  await expect(page.getByText('Remaining Budget')).toBeVisible();

  // Verify Balance Engine
  await expect(page.getByText('You Owe')).toBeVisible();
  await expect(page.getByText('You Get')).toBeVisible();

  // Verify Ledger
  await expect(page.getByText('Recent Activity')).toBeVisible();
});

test('Navigation flow from Dashboard to Add Expense', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Click Add Expense
  const addExpenseBtn = page.getByRole('button', { name: 'Add Expense' });
  await expect(addExpenseBtn).toBeVisible();
  await addExpenseBtn.click();

  // Next.js App Router might be fast or slow locally
  await expect(page).toHaveURL(/.*add-expense/);
  await expect(page.getByRole('heading', { name: 'Add an Expense' })).toBeVisible();
});
