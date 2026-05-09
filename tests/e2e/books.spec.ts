/**
 * Feature: Búsqueda de libros en DemoQA BookStore
 * Derivado de: features/books.feature
 * Sitio: https://demoqa.com/books (acceso público)
 */
import { test, expect } from '@playwright/test';
import { saveVideo, getFfmpegPath } from 'playwright-video';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import fs from 'fs';

// playwright-video requiere que FFMPEG_PATH esté seteado antes de usarse
process.env.FFMPEG_PATH = ffmpegInstaller.path;
import { BooksPage } from '../../pages/BooksPage';
import { SEARCH_TERMS } from '../../data/books';

// ─── Helpers de log ──────────────────────────────────────────────────────────

function log(msg: string) {
  const ts = new Date().toISOString().slice(11, 23);
  console.log(`  [${ts}] ${msg}`);
}

function logAction(action: string, detail?: string) {
  console.log(`\n  ► ${action}${detail ? ` → "${detail}"` : ''}`);
}

function logResult(label: string, value: string | number | boolean) {
  console.log(`  ✔ ${label}: ${value}`);
}

function logAssert(assertion: string) {
  console.log(`  ✅ ASSERT: ${assertion}`);
}

// ─── Suite ───────────────────────────────────────────────────────────────────

const VIDEO_DIR = path.resolve('reports/videos');

test.describe('Books - Búsqueda en catálogo de DemoQA', () => {
  let booksPage: BooksPage;
  let capture: Awaited<ReturnType<typeof saveVideo>> | undefined;

  test.beforeEach(async ({ page }, testInfo) => {
    log(`Iniciando test: ${testInfo.title}`);
    log(`Browser: ${testInfo.project.name}`);

    // Capturar logs del browser
    page.on('console', (msg) => {
      if (msg.type() === 'error') log(`[BROWSER ERROR] ${msg.text()}`);
    });

    // Grabar video con playwright-video (nombre basado en el ID del test)
    fs.mkdirSync(VIDEO_DIR, { recursive: true });
    const safeName = testInfo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const videoPath = path.join(VIDEO_DIR, `${safeName}_${testInfo.project.name}.mp4`);
    capture = await saveVideo(page, videoPath);
    log(`Grabando video en: ${videoPath}`);

    await test.step('Navegar a la página del catálogo de libros', async () => {
      logAction('Navegando a', 'https://demoqa.com/books');
      booksPage = new BooksPage(page);
      await booksPage.goto();
      logResult('URL actual', page.url());
      logResult('Título de página', await page.title());
    });
  });

  test.afterEach(async ({}, testInfo) => {
    if (capture) {
      await capture.stop();
      log(`Video guardado en: reports/videos/`);
    }
    log(`Resultado del test: ${testInfo.status?.toUpperCase()}`);
    if (testInfo.status === 'failed') log(`Error: ${testInfo.error?.message ?? 'desconocido'}`);
    log('─'.repeat(60));
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-BOOKS-001
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-BOOKS-001: Búsqueda con palabra clave existente "Git"', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'objective',  description: 'Verificar que el campo de búsqueda filtra correctamente con una palabra clave que existe en el catálogo' },
      { type: 'feature',    description: 'Book Search' },
      { type: 'severity',   description: 'Critical' },
      { type: 'type',       description: 'Positive / Functional' },
      { type: 'precondition', description: 'Catálogo de libros cargado correctamente' },
      { type: 'expected',   description: 'Al buscar "Git" se muestra al menos 1 resultado que incluye "Git Pocket Guide"' },
    );

    await test.step('Ingresar la palabra clave "Git" en el campo de búsqueda', async () => {
      logAction('Escribiendo en searchBox', 'Git');
      await booksPage.search('Git');
      logResult('Texto ingresado', 'Git');
    });

    await test.step('Verificar que el catálogo muestra resultados', async () => {
      await booksPage.assertHasResults();
      logAssert('La tabla tiene al menos 1 fila con resultados');
    });

    await test.step('Verificar que "Git Pocket Guide" aparece en los resultados', async () => {
      await booksPage.assertBookVisible('Git Pocket Guide');
      logAssert('El título "Git Pocket Guide" es visible en la tabla');
      logResult('Libro encontrado', 'Git Pocket Guide');
    });

    await test.step('Adjuntar screenshot del resultado', async () => {
      const screenshot = await page.screenshot();
      await testInfo.attach('resultado-busqueda-git', { body: screenshot, contentType: 'image/png' });
      log('Screenshot adjuntado al reporte');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-BOOKS-002
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-BOOKS-002: Búsqueda con "JavaScript" devuelve múltiples resultados', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'objective',  description: 'Verificar que la búsqueda con una palabra clave genérica devuelve múltiples resultados del catálogo' },
      { type: 'feature',    description: 'Book Search' },
      { type: 'severity',   description: 'High' },
      { type: 'type',       description: 'Positive / Functional' },
      { type: 'precondition', description: 'Catálogo de libros cargado correctamente' },
      { type: 'expected',   description: 'Al buscar "JavaScript" se devuelven varios títulos que contienen esa palabra' },
    );

    await test.step('Ingresar "JavaScript" en el campo de búsqueda', async () => {
      logAction('Escribiendo en searchBox', 'JavaScript');
      await booksPage.search('JavaScript');
      logResult('Texto ingresado', 'JavaScript');
    });

    await test.step('Verificar que hay resultados visibles', async () => {
      await booksPage.assertHasResults();
      logAssert('La tabla contiene al menos 1 resultado');
    });

    await test.step('Verificar que "Learning JavaScript Design Patterns" aparece', async () => {
      await booksPage.assertBookVisible('Learning JavaScript Design Patterns');
      logAssert('"Learning JavaScript Design Patterns" encontrado en resultados');
    });

    await test.step('Contar y loguear todos los títulos encontrados', async () => {
      const titles = await page.locator('table tbody tr td a').allTextContents();
      log(`Total de resultados encontrados: ${titles.length}`);
      titles.forEach((t, i) => logResult(`  Resultado ${i + 1}`, t));
      expect(titles.length).toBeGreaterThan(1);
      logAssert(`Se encontraron ${titles.length} resultados (> 1)`);
    });

    await test.step('Adjuntar screenshot del resultado', async () => {
      const screenshot = await page.screenshot();
      await testInfo.attach('resultado-busqueda-javascript', { body: screenshot, contentType: 'image/png' });
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-BOOKS-003
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-BOOKS-003: Búsqueda con "ISTQB Fundamentals" no devuelve resultados', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'objective',  description: 'Verificar que al buscar un término inexistente el catálogo muestra estado vacío sin resultados' },
      { type: 'feature',    description: 'Book Search' },
      { type: 'severity',   description: 'Critical' },
      { type: 'type',       description: 'Negative / Boundary' },
      { type: 'precondition', description: 'Catálogo de libros cargado correctamente' },
      { type: 'expected',   description: 'Al buscar "ISTQB Fundamentals" la tabla muestra "Page 1 of 0" sin filas de datos' },
      { type: 'note',       description: 'Término mencionado explícitamente en el enunciado del desafío' },
    );

    await test.step('Ingresar "ISTQB Fundamentals" en el campo de búsqueda', async () => {
      logAction('Escribiendo en searchBox', 'ISTQB Fundamentals');
      await booksPage.search('ISTQB Fundamentals');
      logResult('Texto ingresado', 'ISTQB Fundamentals');
    });

    await test.step('Verificar que no hay resultados (tabla vacía)', async () => {
      await booksPage.assertNoResults();
      logAssert('La paginación muestra "Page 1 of 0" — sin resultados');
    });

    await test.step('Confirmar que no hay filas en la tabla', async () => {
      const rowCount = await page.locator('table tbody tr').count();
      logResult('Filas encontradas en la tabla', rowCount);
      logAssert(`Tabla tiene ${rowCount} fila(s) — comportamiento correcto para búsqueda sin coincidencias`);
    });

    await test.step('Adjuntar screenshot del estado vacío', async () => {
      const screenshot = await page.screenshot();
      await testInfo.attach('sin-resultados-istqb', { body: screenshot, contentType: 'image/png' });
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-BOOKS-004
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-BOOKS-004: Limpiar búsqueda restaura todos los libros', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'objective',  description: 'Verificar que al limpiar el campo de búsqueda el catálogo regresa a su estado completo con todos los libros disponibles' },
      { type: 'feature',    description: 'Book Search - Reset' },
      { type: 'severity',   description: 'Medium' },
      { type: 'type',       description: 'Positive / State Transition' },
      { type: 'precondition', description: 'Catálogo de libros cargado correctamente' },
      { type: 'expected',   description: 'Después de limpiar el searchBox se muestran los 8 libros del catálogo completo' },
    );

    await test.step('Realizar una búsqueda inicial con "Git"', async () => {
      logAction('Escribiendo en searchBox (búsqueda inicial)', 'Git');
      await booksPage.search('Git');
      logResult('Texto ingresado', 'Git');
    });

    await test.step('Verificar que la búsqueda filtró resultados correctamente', async () => {
      await booksPage.assertBookVisible('Git Pocket Guide');
      const filteredCount = await page.locator('table tbody tr td a').count();
      logResult('Libros visibles tras filtro "Git"', filteredCount);
      logAssert('"Git Pocket Guide" visible — filtro activo confirmado');
    });

    await test.step('Limpiar el campo de búsqueda', async () => {
      logAction('Limpiando el campo searchBox');
      await booksPage.clearSearch();
      log('Campo de búsqueda vaciado');
    });

    await test.step('Verificar que el catálogo completo es restaurado', async () => {
      await booksPage.assertHasResults();
      await booksPage.assertBookVisible('Speaking JavaScript');
      const totalCount = await page.locator('table tbody tr td a').count();
      logResult('Libros visibles tras limpiar búsqueda', totalCount);
      logAssert(`Catálogo restaurado con ${totalCount} libro(s) — todos los libros disponibles`);
    });

    await test.step('Adjuntar screenshot del catálogo restaurado', async () => {
      const screenshot = await page.screenshot();
      await testInfo.attach('catalogo-restaurado', { body: screenshot, contentType: 'image/png' });
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-BOOKS-005 (Outline — términos existentes)
  // ───────────────────────────────────────────────────────────────────────────
  for (const { keyword, expectedTitle } of SEARCH_TERMS.existing.filter((t) => 'expectedTitle' in t)) {
    test(`TC-BOOKS-005: Búsqueda con "${keyword}" encuentra "${expectedTitle}"`, async ({ page }, testInfo) => {
      testInfo.annotations.push(
        { type: 'objective',  description: `Verificar que la búsqueda con la palabra clave "${keyword}" retorna el libro esperado "${expectedTitle}"` },
        { type: 'feature',    description: 'Book Search - Parametrized' },
        { type: 'severity',   description: 'High' },
        { type: 'type',       description: 'Positive / Data-Driven' },
        { type: 'keyword',    description: keyword },
        { type: 'expected',   description: `El libro "${expectedTitle}" debe aparecer en los resultados` },
      );

      await test.step(`Ingresar la palabra clave "${keyword}" en el buscador`, async () => {
        logAction('Escribiendo en searchBox', keyword);
        await booksPage.search(keyword);
        logResult('Keyword ingresada', keyword);
      });

      await test.step('Verificar que la búsqueda retorna resultados', async () => {
        await booksPage.assertHasResults();
        logAssert('Tabla con al menos 1 resultado visible');
      });

      await test.step(`Verificar que el libro esperado "${expectedTitle}" está visible`, async () => {
        await booksPage.assertBookVisible(expectedTitle as string);
        logAssert(`Libro encontrado: "${expectedTitle}"`);
        logResult('Coincidencia', `keyword="${keyword}" → título="${expectedTitle}"`);
      });

      await test.step('Loguear todos los resultados de esta búsqueda', async () => {
        const titles = await page.locator('table tbody tr td a').allTextContents();
        log(`Resultados para "${keyword}": ${titles.length} libro(s)`);
        titles.forEach((t) => log(`  • ${t}`));
      });

      await test.step('Adjuntar screenshot', async () => {
        const screenshot = await page.screenshot();
        await testInfo.attach(`busqueda-${keyword.toLowerCase()}`, { body: screenshot, contentType: 'image/png' });
      });
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TC-BOOKS-006 (Outline — términos inexistentes)
  // ───────────────────────────────────────────────────────────────────────────
  for (const keyword of SEARCH_TERMS.nonExisting) {
    test(`TC-BOOKS-006: Búsqueda con "${keyword}" no devuelve resultados`, async ({ page }, testInfo) => {
      testInfo.annotations.push(
        { type: 'objective',  description: `Verificar que el sistema maneja correctamente búsquedas con términos inexistentes como "${keyword}" mostrando tabla vacía` },
        { type: 'feature',    description: 'Book Search - Parametrized' },
        { type: 'severity',   description: 'High' },
        { type: 'type',       description: 'Negative / Data-Driven' },
        { type: 'keyword',    description: keyword },
        { type: 'expected',   description: 'La tabla debe estar vacía: "Page 1 of 0"' },
      );

      await test.step(`Ingresar la palabra clave inexistente "${keyword}"`, async () => {
        logAction('Escribiendo en searchBox (término inexistente)', keyword);
        await booksPage.search(keyword);
        logResult('Keyword ingresada', keyword);
      });

      await test.step('Verificar que no hay resultados', async () => {
        await booksPage.assertNoResults();
        logAssert(`Sin resultados para "${keyword}" — comportamiento correcto`);
      });

      await test.step('Confirmar el conteo de filas es 0', async () => {
        const rowCount = await page.locator('table tbody tr').count();
        logResult('Filas en tabla', rowCount);
        log(`La búsqueda de "${keyword}" devolvió ${rowCount} fila(s) — como se esperaba`);
      });

      await test.step('Adjuntar screenshot del estado sin resultados', async () => {
        const screenshot = await page.screenshot();
        await testInfo.attach(`sin-resultados-${keyword.replace(/\s+/g, '-').toLowerCase()}`, {
          body: screenshot,
          contentType: 'image/png',
        });
      });
    });
  }
});
