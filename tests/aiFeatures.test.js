import { test, expect } from '@playwright/test';

test('Chatbot interaction works correctly', async ({ page }) => {
  await page.goto('/');

  // Open chatbot and send a message
  await page.fill('.chatbot-wrapper input', 'Hello AI');
  await page.click('.chatbot-wrapper button');

  // Verify AI response
  const response = await page.textContent('.chatbot-wrapper .message.ai');
  expect(response).toBeTruthy();
});

test('Recommendations are displayed', async ({ page }) => {
  await page.goto('/');

  // Check recommendations section
  const recommendations = await page.locator('.recommendations-wrapper .recommendation-item');
  await expect(recommendations).toHaveCountGreaterThan(0);
});