# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard loads and displays core financial data
- Location: tests\dashboard.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Dashboard' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Dashboard' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "KharchaX" [ref=e6] [cursor=pointer]:
        - /url: /
      - generic [ref=e7]:
        - link "Dashboard" [ref=e8] [cursor=pointer]:
          - /url: /dashboard
        - link "Sign In" [ref=e9] [cursor=pointer]:
          - /url: "#"
  - main [ref=e10]:
    - paragraph [ref=e13]: Loading KharchaX Dashboard...
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Dashboard loads and displays core financial data', async ({ page }) => {
  4  |   // Navigate to Dashboard
  5  |   await page.goto('/dashboard');
  6  | 
  7  |   // Verify Header
> 8  |   await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
     |                                                                  ^ Error: expect(locator).toBeVisible() failed
  9  | 
  10 |   // Verify Data Cards
  11 |   await expect(page.getByText('Total Group Expenses')).toBeVisible();
  12 |   await expect(page.getByText('Remaining Budget')).toBeVisible();
  13 | 
  14 |   // Verify Balance Engine
  15 |   await expect(page.getByText('You Owe')).toBeVisible();
  16 |   await expect(page.getByText('You Get')).toBeVisible();
  17 | 
  18 |   // Verify Ledger
  19 |   await expect(page.getByText('Recent Activity')).toBeVisible();
  20 | });
  21 | 
  22 | test('Navigation flow from Dashboard to Add Expense', async ({ page }) => {
  23 |   await page.goto('/dashboard');
  24 |   
  25 |   // Click Add Expense
  26 |   const addExpenseBtn = page.getByRole('button', { name: 'Add Expense' });
  27 |   await expect(addExpenseBtn).toBeVisible();
  28 |   await addExpenseBtn.click();
  29 | 
  30 |   // Next.js App Router might be fast or slow locally
  31 |   await expect(page).toHaveURL(/.*add-expense/);
  32 |   await expect(page.getByRole('heading', { name: 'Add an Expense' })).toBeVisible();
  33 | });
  34 | 
```