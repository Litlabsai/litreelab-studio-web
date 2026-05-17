import { test, expect } from '@playwright/test';

test('Chatbot sends and receives messages', async ({ page }) => {
  await page.goto('/');

  // Simulate user input
  await page.fill('.chatbot-container .input-area input', 'Hello AI');
  await page.click('.chatbot-container .input-area button');

  // Verify AI response
  const aiMessage = await page.textContent('.chatbot-container .message.ai');
  expect(aiMessage).toBeTruthy();
});