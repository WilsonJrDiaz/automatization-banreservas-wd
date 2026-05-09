import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput = () => this.page.locator('#userName');
  private readonly passwordInput = () => this.page.locator('#password');
  private readonly loginButton = () => this.page.locator('#login');
  private readonly errorMessage = () => this.page.locator('#name');
  private readonly newUserButton = () => this.page.locator('#newUser');

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  async clickLoginWithoutCredentials(): Promise<void> {
    await this.loginButton().click();
  }

  async assertErrorMessage(message: string): Promise<void> {
    await expect(this.errorMessage()).toBeVisible({ timeout: 8000 });
    await expect(this.errorMessage()).toContainText(message);
  }

  async assertFieldsInvalid(): Promise<void> {
    await expect(this.usernameInput()).toHaveClass(/is-invalid/);
    await expect(this.passwordInput()).toHaveClass(/is-invalid/);
  }

  async assertLoginFormVisible(): Promise<void> {
    await expect(this.usernameInput()).toBeVisible();
    await expect(this.passwordInput()).toBeVisible();
    await expect(this.loginButton()).toBeEnabled();
  }
}
