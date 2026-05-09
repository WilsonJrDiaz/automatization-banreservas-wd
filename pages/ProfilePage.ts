import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  private readonly userNameLabel = () => this.page.locator('#userName-value');
  private readonly logoutButton = () => this.page.locator('#submit');
  private readonly profileHeading = () => this.page.getByText('Profile');

  constructor(page: Page) {
    super(page);
  }

  async assertUserLoggedIn(username: string): Promise<void> {
    await expect(this.userNameLabel()).toBeVisible({ timeout: 10000 });
    await expect(this.userNameLabel()).toHaveText(username);
  }

  async logout(): Promise<void> {
    await this.logoutButton().click();
    await this.assertUrl(/login/);
  }

  async assertOnProfilePage(): Promise<void> {
    await this.assertUrl(/profile/);
    await expect(this.profileHeading()).toBeVisible();
  }
}
