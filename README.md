# Interview Practice Tracker

A responsive, client-side web application designed for students and job seekers to systematically track, organize, and monitor weekly technical interview preparation.

Built in accordance with the [Software Requirements Specification (SRS.md)](./SRS.md).

---

## 🚀 Live Demo & Links

- **Live Deployment:** [Deploy on Vercel / Netlify](https://vercel.com) *(Update with your production URL)*
- **Demo Video:** [1–2 Minute Demo Video](https://loom.com) *(Update with your video URL)*

---

## 🛠 Tech Stack

- **UI Framework:** [React 18](https://react.dev/) (Hooks, Reusable Components)
- **Tooling & Bundler:** [Vite 5+](https://vitejs.dev/)
- **Language:** JavaScript (ES Modules)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Utility-first, responsive, WCAG-compliant status badges)
- **Routing:** [React Router v6 / v7](https://reactrouter.com/) (Data routing with `createBrowserRouter`, `RouterProvider`, nested routes, and layout `Outlet`)
- **Persistence:** Browser `localStorage` (Isolated service layer with error handling and fallback)
- **Testing:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) + `@testing-library/jest-dom` + `jsdom`

---

## ✨ Features

- **Responsive Dashboard:** Weekly progress overview with key metrics (Total, Completed, Pending) and progress visualization.
- **Weekly Boundary Tracking:** Timezone-safe local date arithmetic tracking Monday–Sunday boundaries.
- **Activity Management:**
  - Create activities with Title, Date, Category, and optional Notes.
  - Inline input validation with accessible error indicators.
  - Toggle activity completion directly from cards with combined color + text badges.
  - Delete activities with immediate state and storage synchronization.
  - Edit existing activities via deep-linkable `/activities/:activityId/edit` route.
- **Filtering:** Filter all logged preparation items by status (*All*, *Pending*, *Completed*).
- **Client-Side Persistence:** Seamless persistence in `localStorage` across page reloads and browser sessions.
- **Robust Error Handling:** Informative empty states, 404 Not Found fallback, and resilient handling for missing or malformed storage data.

---

## 📁 Architecture & Separation of Concerns

The application adheres to a clean, **feature-based architecture**:

```text
client/
├── public/
│   └── _redirects              # Netlify client-side routing redirect
├── src/
│   ├── app/
│   │   └── AppRoute.jsx        # Data Router configuration & route provider
│   ├── layouts/
│   │   └── DashboardLayout.jsx # Application layout shell (Navigation & Outlet)
│   ├── features/
│   │   ├── activities/
│   │   │   ├── components/     # ActivityCard, ActivityList, ActivityForm
│   │   │   ├── hooks/          # useActivities hook (isolated stateful logic)
│   │   │   ├── pages/          # ActivitiesPage, NewActivityPage, EditActivityPage
│   │   │   ├── services/       # activityService (isolated localStorage access)
│   │   │   ├── utils/          # Pure activityValidation
│   │   │   └── activity.constants.js # Categories and badge styling
│   │   └── dashboard/
│   │       ├── components/     # WeeklySummary, WeekNavigator
│   │       └── pages/          # DashboardPage
│   ├── shared/
│   │   ├── components/         # Reusable Button, Input, Select, EmptyState, NotFound
│   │   ├── constants/          # App constants & STORAGE_KEY
│   │   └── utils/              # dateUtils (Monday-Sunday bounds) & idUtils
│   ├── styles/
│   │   └── index.css           # Tailwind CSS imports
│   ├── test/                   # Comprehensive unit & component test suites
│   └── main.jsx                # Application root entry point
├── vercel.json                 # Vercel client-side routing rewrite rules
└── vite.config.js              # Vite & Vitest configuration
```

### Architectural Principles:
1. **Pages coordinate**, rather than implementing lower-level UI details.
2. **Components handle presentation**; never interact with `localStorage` directly.
3. **Hooks encapsulate stateful workflows** (`useActivities`).
4. **Services isolate persistence** (`activityService`).
5. **Utilities are pure functions** with zero React or browser dependencies (`dateUtils`).
6. **Derived values are never duplicated in state** (e.g., weekly totals are calculated on render).

---

## 🚦 Getting Started

### Prerequisites

- **Node.js:** `>= 18.x` (Tested on `v22.x`)
- **npm:** `>= 9.x`

### Installation & Setup

1. Clone repository and navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing

Run automated tests via Vitest:

```bash
# Run test suite once
npm test

# Run tests in watch mode
npm run test:watch
```

**Test Coverage Highlights:**
- `TC-001 – TC-005`: Pure date utility & Monday–Sunday boundary logic.
- `TC-006 – TC-007`: Activity validation functions.
- `TC-008 – TC-010`: Storage service hydration, parsing resilience, and error handling.
- `TC-011 – TC-013`: Component interaction and validation behavior for `ActivityForm`.

---

## 📦 Production Build & Deployment

Build optimized static bundle:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

### Deployment Configuration:
- **Vercel:** `vercel.json` rewrite configured for SPA HTML5 History API.
- **Netlify:** `public/_redirects` configured for SPA routing.

---

## 🔍 Key Assumptions

1. **Week Boundaries:** The week starts on **Monday** and ends on **Sunday** (`BR-004`).
2. **Date Format:** Dates are stored as local `YYYY-MM-DD` strings to prevent UTC midnight date shift bugs.
3. **Persistence:** Client-side only; relies on browser `localStorage` under key `ipt_activities`.
4. **Authentication:** Not required for MVP scope as per problem statement.

---

## ⚠️ Known Limitations

- Single-browser persistence (no cloud sync across devices).
- Data export/import (CSV/JSON) is not included in the 2.5-hour machine-coding scope.
- Historical week browsing is ready for extension, while current focus is on the active preparation week.
