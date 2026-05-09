import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { TEST_USERS } from '../data/users';

type Pages = {
  loginPage: LoginPage;
  homePage: HomePage;
};

type AuthOptions = {
  authenticatedPage: Page;
};

// Fixture base con todas las páginas instanciadas
export const test = base.extend<Pages & AuthOptions>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  // Fixture que provee una página ya autenticada
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'config/auth.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
