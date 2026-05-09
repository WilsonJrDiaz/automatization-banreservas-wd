<div align="center">
  <img src="docs/banreservas-logo.png" alt="Banreservas Logo" width="280"/>

  # Automatización Web — Desafío #1

  **DemoQA BookStore** | Playwright + TypeScript

  ![Playwright](https://img.shields.io/badge/Playwright-1.56+-2EAD33?logo=playwright&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
  ![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
  ![License](https://img.shields.io/badge/License-ISC-blue)
</div>

---

## Descripción General

Suite de automatización de pruebas E2E para el sitio [https://demoqa.com/books](https://demoqa.com/books), desarrollada con **Playwright** y **TypeScript** siguiendo el patrón **Page Object Model (POM)** y estándares de calidad de software. El proyecto cubre los requerimientos del desafío de automatización web asignado, incluyendo casos de prueba en formato **Gherkin**, reportes, grabación de video por ejecución y documentación técnica.

---

## Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución de Tests](#ejecución-de-tests)
- [Casos de Prueba](#casos-de-prueba)
- [Diseño Gherkin](#diseño-gherkin)
- [Page Object Model](#page-object-model)
- [Reportes y Evidencias](#reportes-y-evidencias)
- [Estudio de Factibilidad — New User](#estudio-de-factibilidad--new-user)
- [CI/CD](#cicd)

---

## Tecnologías

| Herramienta | Versión | Propósito |
|---|---|---|
| [Playwright](https://playwright.dev) | ^1.56 | Framework de automatización E2E multi-browser |
| TypeScript | ^5.x | Tipado estático y mantenibilidad del código |
| Node.js | ≥ 18 | Runtime de ejecución |
| playwright-video | latest | Grabación de video MP4 por test |
| @ffmpeg-installer/ffmpeg | latest | Codificación de video |
| GitHub Actions | — | Pipeline de integración continua |

---

## Estructura del Proyecto

```
playwright/
│
├── features/                        # Casos de prueba en formato Gherkin (BDD)
│   ├── login.feature                # Escenarios de autenticación
│   └── books.feature                # Escenarios de búsqueda de libros
│
├── pages/                           # Page Object Model (POM)
│   ├── BasePage.ts                  # Clase abstracta con métodos comunes
│   ├── LoginPage.ts                 # POM — página de inicio de sesión
│   ├── ProfilePage.ts               # POM — perfil del usuario autenticado
│   └── BooksPage.ts                 # POM — catálogo y búsqueda de libros
│
├── tests/
│   └── e2e/
│       ├── login.spec.ts            # Tests de autenticación (TC-LOGIN-*)
│       └── books.spec.ts            # Tests de búsqueda (TC-BOOKS-*) con steps, logs y video
│
├── data/
│   ├── users.ts                     # Datos de prueba tipados para usuarios
│   └── books.ts                     # Catálogo de libros y términos de búsqueda
│
├── fixtures/
│   └── index.ts                     # Fixtures personalizados de Playwright
│
├── utils/
│   ├── api.ts                       # Cliente HTTP genérico para API tests
│   └── helpers.ts                   # Utilidades: uniqueEmail, waitFor, intercept
│
├── docs/
│   ├── Estudio-de-Factibilidad.md   # Análisis técnico de automatización "New User"
│   └── banreservas-logo.png         # Logotipo institucional
│
├── .github/
│   └── workflows/
│       └── playwright.yml           # Pipeline CI/CD con GitHub Actions
│
├── playwright.config.ts             # Configuración central: browsers, reporters, video
├── tsconfig.json                    # Configuración TypeScript
├── .env.example                     # Variables de entorno requeridas
└── README.md                        # Este documento
```

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd playwright

# 2. Instalar dependencias
npm install

# 3. Instalar browsers de Playwright
npx playwright install chromium firefox webkit

# 4. Configurar variables de entorno
cp .env.example .env
```

---

## Configuración

Edita el archivo `.env` con tus credenciales:

```env
BASE_URL=https://demoqa.com
DEMOQA_USERNAME=tu_usuario
DEMOQA_PASSWORD=tu_password
```

> Las credenciales son requeridas únicamente para el test TC-LOGIN-001 (inicio de sesión exitoso). Los demás tests son completamente **públicos** y no requieren autenticación.

---

## Ejecución de Tests

```bash
# Ejecutar todos los tests en Chromium
npm test

# Solo tests de búsqueda de libros
npx playwright test tests/e2e/books.spec.ts --project=chromium

# Solo tests de autenticación
npx playwright test tests/e2e/login.spec.ts --project=chromium

# Interfaz visual interactiva (UI Mode)
npm run test:ui

# Con browser visible (headed)
npm run test:headed

# Modo debug paso a paso
npm run test:debug

# Abrir reporte HTML
npm run test:report
```

---

## Casos de Prueba

### Módulo: Autenticación (`login.spec.ts`)

| ID | Escenario | Tipo | Requiere credenciales |
|---|---|---|---|
| TC-LOGIN-001 | Inicio de sesión exitoso con credenciales válidas | Positivo | Sí |
| TC-LOGIN-002 | Error al ingresar usuario incorrecto | Negativo | No |
| TC-LOGIN-003 | Error al ingresar contraseña incorrecta | Negativo | No |
| TC-LOGIN-004 | Validación de campos vacíos | Borde | No |

### Módulo: Búsqueda de Libros (`books.spec.ts`)

| ID | Escenario | Tipo | Keyword |
|---|---|---|---|
| TC-BOOKS-001 | Búsqueda con término existente "Git" | Positivo | `Git` |
| TC-BOOKS-002 | Búsqueda con término genérico retorna múltiples resultados | Positivo | `JavaScript` |
| TC-BOOKS-003 | Búsqueda con "ISTQB Fundamentals" sin resultados | Negativo | `ISTQB Fundamentals` |
| TC-BOOKS-004 | Limpiar búsqueda restaura el catálogo completo | Transición de estado | — |
| TC-BOOKS-005 | Outline: términos existentes únicos | Positivo / Data-Driven | `Speaking`, `Eloquent` |
| TC-BOOKS-006 | Outline: términos inexistentes únicos | Negativo / Data-Driven | `TerminoQueNoExiste`, `12345XYZ` |

Cada test de books incluye:
- **Annotations** con objetivo, feature, severidad, tipo, precondición y resultado esperado
- **`test.step()`** para cada acción (navegación, input, verificación, screenshot)
- **Logs detallados** con timestamps, acciones (`►`), resultados (`✔`) y assertions (`✅`)
- **Screenshot** adjunto al reporte HTML en cada ejecución
- **Video MP4** individual guardado en `reports/videos/`

---

## Diseño Gherkin

Los escenarios de prueba están diseñados en formato **Gherkin** (Given / When / Then) en la carpeta `features/`:

### `features/login.feature` — 5 escenarios

```gherkin
Scenario: Inicio de sesión exitoso con credenciales válidas
  Given que estoy en la página de inicio de sesión
  When ingreso el usuario y la contraseña válidos
  And hago clic en el botón de inicio de sesión
  Then debería ser redirigido al perfil del usuario
```

### `features/books.feature` — 4 escenarios + 1 Scenario Outline

```gherkin
Scenario: Búsqueda con palabra clave inexistente
  Given que estoy en la página del catálogo de libros
  When busco el libro con la palabra clave "ISTQB Fundamentals"
  Then no debería ver resultados de búsqueda

Scenario Outline: Validación de búsqueda con diferentes términos
  When busco el libro con la palabra clave "<termino>"
  Then el resultado de búsqueda debería ser "<resultado>"
  Examples: ...
```

---

## Page Object Model

La arquitectura POM centraliza los selectores y acciones por página, evitando duplicación y facilitando el mantenimiento:

```
BasePage (abstracta)
    └── LoginPage    → #userName, #password, #login, #name (error)
    └── ProfilePage  → #userName-value, #submit (logout)
    └── BooksPage    → placeholder "Type to search", table tbody tr, "Page 1 of 0"
```

Cada página expone **únicamente métodos de acción y assertion** — los selectores son privados. Los tests interactúan solo con métodos de alto nivel como `booksPage.search('Git')` o `loginPage.assertErrorMessage('...')`.

---

## Reportes y Evidencias

Los reportes se generan automáticamente en `reports/` tras cada ejecución:

| Formato | Ruta | Descripción |
|---|---|---|
| HTML | `reports/html/` | Reporte visual interactivo con steps, screenshots y videos |
| JSON | `reports/results.json` | Integración con dashboards externos |
| JUnit XML | `reports/junit.xml` | Compatible con CI/CD (Jenkins, GitHub Actions) |
| Videos MP4 | `reports/videos/` | Un video por test, nombrado con el ID del caso |
| Trace | `reports/test-results/*/trace.zip` | Timeline completo de cada test (abrir con `npx playwright show-trace`) |

```bash
# Ver reporte HTML
npm run test:report

# Ver trace de un test específico
npx playwright show-trace reports/test-results/<carpeta>/trace.zip
```

---

## Estudio de Factibilidad — New User

> **Ver documento completo:** [`docs/Estudio-de-Factibilidad.md`](docs/Estudio-de-Factibilidad.md)

Se realizó un análisis técnico sobre la viabilidad de automatizar el formulario **"New User"** disponible en [https://demoqa.com/register](https://demoqa.com/register).

### Resumen Ejecutivo

| Criterio | Evaluación |
|---|---|
| Automatizable vía UI (Playwright) | ❌ No viable |
| Razón principal | reCAPTCHA v2 de Google bloquea la automatización headless |
| Automatizable vía API REST | ✅ Viable y recomendado |
| Incluir en suite de regresión E2E | ❌ No aplica para UI |

### Conclusión

El formulario de registro implementa **reCAPTCHA v2 (checkbox)** que analiza el comportamiento humano y detecta automatización. En entornos headless/CI, la tasa de fallo es del ~99%. La alternativa recomendada es la creación de usuarios mediante el endpoint REST `POST /Account/v1/User`, que no requiere CAPTCHA y es completamente automatizable.

📄 **[Leer el estudio completo con análisis de campos, alternativas evaluadas e implementación recomendada →](docs/Estudio-de-Factibilidad.md)**

---

## CI/CD

La suite está configurada para ejecutarse automáticamente en **GitHub Actions** en cada `push` a `main` o `develop` y en cada Pull Request:

```yaml
# .github/workflows/playwright.yml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

- Instala browsers de forma automatizada (`playwright install --with-deps`)
- Ejecuta los tests en Chromium por defecto
- Publica el reporte HTML como **artifact** con retención de 7 días
- Usa `secrets` de GitHub para las credenciales (`DEMOQA_USERNAME`, `DEMOQA_PASSWORD`)

---

## Libros en el Catálogo

| Título | Autor |
|---|---|
| Git Pocket Guide | Richard E. Silverman |
| Learning JavaScript Design Patterns | Addy Osmani |
| Designing Evolvable Web APIs with ASP.NET | Glenn Block et al. |
| Speaking JavaScript | Axel Rauschmayer |
| You Don't Know JS | Kyle Simpson |
| Programming JavaScript Applications | Eric Elliott |
| Eloquent JavaScript, Second Edition | Marijn Haverbeke |
| Understanding ECMAScript 6 | Nicholas C. Zakas |

---

<div align="center">

Desarrollado por **Wilson Díaz** — Desafío de Automatización Web #1

<img src="docs/banreservas-logo.png" alt="Banreservas" width="160"/>

*El banco de los dominicanos*

</div>
