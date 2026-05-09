import { Page } from '@playwright/test';

/**
 * Genera un string aleatorio útil para datos de prueba únicos.
 */
export function randomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Genera un email único para evitar colisiones entre tests.
 */
export function uniqueEmail(prefix = 'test'): string {
  return `${prefix}+${Date.now()}@example.com`;
}

/**
 * Espera a que una condición se cumpla con reintentos.
 */
export async function waitFor(
  condition: () => Promise<boolean>,
  options: { timeout?: number; interval?: number } = {},
): Promise<void> {
  const { timeout = 5000, interval = 250 } = options;
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    if (await condition()) return;
    await new Promise((r) => setTimeout(r, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Intercepta y espera una request de red específica.
 */
export async function interceptRequest(
  page: Page,
  urlPattern: string | RegExp,
  action: () => Promise<void>,
) {
  const [request] = await Promise.all([
    page.waitForRequest(urlPattern),
    action(),
  ]);
  return request;
}

/**
 * Intercepta y espera una response de red específica.
 */
export async function interceptResponse(
  page: Page,
  urlPattern: string | RegExp,
  action: () => Promise<void>,
) {
  const [response] = await Promise.all([
    page.waitForResponse(urlPattern),
    action(),
  ]);
  return response;
}
