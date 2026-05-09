import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BooksPage extends BasePage {
  private readonly searchInput = () => this.page.getByPlaceholder('Type to search');
  private readonly tableBody = () => this.page.locator('table tbody');
  private readonly bookRows = () => this.page.locator('table tbody tr');
  private readonly bookLinks = () => this.page.locator('table tbody tr td a');
  private readonly pagination = () => this.page.getByText(/Page \d+ of (\d+)/);

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/books');
    await this.waitForPageLoad();
    await this.page.waitForLoadState('networkidle');
    // Esperar a que el catálogo cargue (tabla visible o paginación)
    await this.page.waitForSelector('table', { timeout: 15000 });
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput().clear();
    await this.searchInput().fill(keyword);
    await this.page.waitForTimeout(800); // debounce del filtro
  }

  async clearSearch(): Promise<void> {
    await this.searchInput().clear();
    await this.page.waitForTimeout(800);
  }

  async assertBookVisible(title: string): Promise<void> {
    await expect(this.page.locator('table').getByText(title)).toBeVisible({ timeout: 10000 });
  }

  async assertNoResults(): Promise<void> {
    // Cuando no hay resultados la tabla muestra "Page 1 of 0" y tbody sin filas
    await expect(this.page.getByText('Page 1 of 0')).toBeVisible({ timeout: 10000 });
  }

  async assertHasResults(): Promise<void> {
    await expect(this.bookLinks().first()).toBeVisible({ timeout: 10000 });
  }

  async assertAllResultsContain(keyword: string): Promise<void> {
    const titles = await this.bookLinks().allTextContents();
    const lower = keyword.toLowerCase();
    for (const title of titles) {
      expect(title.toLowerCase()).toContain(lower);
    }
  }
}
