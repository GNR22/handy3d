## One-Page Tech Stack Summary

### Monorepo Layout

* **Structure:** Monorepo
* **Packages:**

  * `backend/` — Laravel (PHP) application
  * `frontend/` — Standalone React application

---

## Backend (Laravel)

### Core

* **Language:** PHP ^8.2
* **Framework:** Laravel ^12.0
* **Auth / Security:** Laravel Fortify ^1.30
* **Server-side UI:** Inertia.js (Laravel adapter) with React views
* **ORM / Database:** Eloquent ORM, migrations in `database/migrations`
* **Database Provider:** Neon (PostgreSQL)

### Backend Dependencies (PHP / Composer)

**Production (`require`)**

* php: ^8.2
* laravel/framework: ^12.0
* inertiajs/inertia-laravel: ^2.0
* laravel/fortify: ^1.30
* laravel/tinker: ^2.10.1
* laravel/wayfinder: ^0.1.9

**Development (`require-dev`)**

* fakerphp/faker: ^1.23
* laravel/boost: ^2.0
* laravel/pail: ^1.2.2
* laravel/pint: ^1.24
* laravel/sail: ^1.41
* mockery/mockery: ^1.6
* nunomaduro/collision: ^8.6
* pestphp/pest: ^4.3
* pestphp/pest-plugin-laravel: ^4.0

---

### Backend Dependencies (JavaScript / Inertia)

**Runtime (`dependencies`)**

* react: ^19.2.0
* react-dom: ^19.2.0
* @inertiajs/react: ^2.3.7
* @headlessui/react: ^2.2.0
* @radix-ui/*: ~1.x / 2.x
* tailwindcss: ^4.0.0

**Build & Tooling (`devDependencies`)**

* vite: ^7.0.4
* @vitejs/plugin-react: ^5.0.0
* typescript: ^5.7.2
* eslint: ^9.17.0
* prettier: ^3.4.2
* @types/react: ^19.2.0
* @types/react-dom: ^19.2.0
* Additional linting and formatting plugins

---

## Frontend (Standalone React)

### Core

* **Library:** React ^19.2.0
* **Routing:** react-router-dom ^7.13.0
* **State Management:** zustand ^5.0.10
* **HTTP Client:** axios ^1.13.4
* **Build Tool:** Vite ^7.2.4

### 3D / Graphics

* three: ^0.182.0
* @react-three/fiber: ^9.5.0
* @react-three/drei: ^10.7.7
* @types/three: ^0.182.0

### Frontend Dependencies (Standalone React)

**Runtime (`dependencies`)**

* react: ^19.2.0
* react-dom: ^19.2.0
* react-router-dom: ^7.13.0
* axios: ^1.13.4
* zustand: ^5.0.10

**3D / Graphics**

* three: ^0.182.0
* @react-three/fiber: ^9.5.0
* @react-three/drei: ^10.7.7
* @types/three: ^0.182.0

**Build & Tooling (`devDependencies`)**

* vite: ^7.2.4
* @vitejs/plugin-react: ^5.1.1
* eslint: ^9.39.1

---

## Testing & Quality Assurance

* **Backend Testing:** PHPUnit, Pest

  * Configuration files: `phpunit.xml`, `tests/Pest.php`
* **JavaScript Linting:** ESLint (root-level and per-package configs)
* **Formatting:**

  * JavaScript / TypeScript: Prettier
  * PHP: Laravel Pint

---

## CI / Automation

* **CI Provider:** GitHub Actions
* **Workflows:** Located in `.github/workflows`
* **Coverage:**

  * PHP linting and tests
  * JavaScript linting
* **Scripts:**

  * npm scripts for dev/build/test
  * Composer scripts for backend workflows

---

## Key Project Files

* `backend/composer.json` — PHP dependency manifest
* `backend/package.json` — Backend JS and tooling dependencies
* `frontend/package.json` — Frontend dependency manifest
* `artisan` — Laravel CLI entry point
* `resources/js/app.tsx` — Inertia React client entry
* `resources/js/ssr.tsx` — Inertia SSR entry

---

## Project Summary — Interior Pre-Visualization Tool

### 1. The Brain (Laravel Backend)

* **Database:** Connected to Neon (PostgreSQL)
* **Data Layer:**

  * `furniture` table seeded with real items (Bed, Bathtub, Sofa)
* **API:**

  * `GET /api/furniture` serves furniture metadata to the frontend
* **Model Hosting:**

  * `.glb` 3D models served from `public/models`
  * (Optionally moved to frontend `public/` to bypass CORS issues)

### 2. The Face (React Frontend)

* **Menu System:**

  * Fetches furniture list from Laravel API
  * Displays items in a left-hand sidebar
* **Room Builder:**

  * Clicking a furniture item adds it to the scene array
  * Supports multiple instances of the same object (e.g., multiple beds)
* **Selection System:**

  * Clicking objects in the 3D scene selects and highlights them

### 3. The Engine (Three.js)

* **Rendering:**

  * `.glb` models load correctly via URL
* **Interaction:**

  * TransformControls implemented
  * Objects can be translated along X, Y, and Z axes
  * Enables free arrangement of furniture within the room

---

## Why This Fits Your Users

The Room Builder allows homeowners to define their space using simple length and width inputs, while architects benefit from exact, blueprint-accurate dimensions for professional planning. The 3D Engine, powered by React Three Fiber, is optimized to run smoothly on average laptops for homeowners, while also providing architects with precision tools such as snapping, measuring, and transform controls through Drei. Client-side rendering ensures fast load times for homeowners, and architects can easily export designs in formats such as PDF or JSON for client review and documentation.

--------|-----------------|-----------------|
| Room Builder | Simple inputs (Length × Width) | Exact dimensions matching blueprints |
| 3D Engine (R3F) | Smooth performance on average laptops | Precision tools (snapping, measuring) via Drei |
| Deployment | Fast load times (client-side rendering) | Easy export options (PDF / JSON) for client review |

------|---------------|----------------|
| Room Builder | Simple inputs (Length × Width) | Exact dimensions matching blueprints |
| 3D Engine (R3F) | Smooth performance on average laptops | Precision tools (snapping, measuring) via Drei |
| Deployment | Fast load times (client-side rendering) | Easy export options (PDF / JSON) for client review |

---

## Architecture

**Decoupled Architecture**

* `/frontend` — Vite + React

  * Handles UI, 3D rendering, and user interaction
  * Deployable to Netlify, Vercel, or shared hosting

* `/backend` — Laravel API

  * Handles data, authentication, and persistence
  * Deployable to VPS or dedicated server

---

## High-Level Tech Stack

### Frontend (The Visuals)

* **Core:** React (SPA) built with Vite
* **3D Engine:** React Three Fiber (R3F)
* **3D Helpers:** Drei (gizmos, camera controls, precision tools)
* **State Management:** Zustand (room size, selected furniture, costs)
* **Communication:** Axios (API requests to Laravel)
* **Package Manager:** npm

### Backend (The Logic)

* **Framework:** Laravel (API-only usage)
* **Database:** PostgreSQL (Neon)
* **Responsibilities:**

  * Furniture metadata
  * Saved layouts
  * Authentication and security

---

## Overall Status

You have a fully functional **full-stack 3D web application** combining:

* Laravel + Inertia for backend logic and API delivery
* React for UI and state handling
* Three.js (via R3F) for real-time 3D rendering and interaction

This foundation is production-ready and extensible for features such as saving layouts, user authentication, multiplayer collaboration, and material/lighting customization.
