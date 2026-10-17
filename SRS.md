# Software Requirements Specification (SRS)

## Interview Practice Tracker

---

| Field             | Value                                          |
|-------------------|------------------------------------------------|
| **Document ID**   | SRS-IPT-001                                    |
| **Version**       | 1.0.0                                          |
| **Status**        | Draft – Ready for Implementation               |
| **Date**          | 2026-10-10                                     |
| **Author**        | Senior Software Architect / Technical PM       |
| **Project**       | Interview Practice Tracker                     |
| **Time Budget**   | 150 minutes (2.5-hour machine-coding round)    |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Document Purpose and Scope](#2-document-purpose-and-scope)
3. [Technology Stack](#3-technology-stack)
4. [Architecture and Folder Structure](#4-architecture-and-folder-structure)
5. [React Router Data Routing](#5-react-router-data-routing)
6. [Tailwind CSS Requirements](#6-tailwind-css-requirements)
7. [Functional Requirements](#7-functional-requirements)
8. [Data Model and Business Rules](#8-data-model-and-business-rules)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [UI/UX Specification](#10-uiux-specification)
11. [Technical Design and State Management](#11-technical-design-and-state-management)
12. [Error Handling and Edge Cases](#12-error-handling-and-edge-cases)
13. [Testing Strategy](#13-testing-strategy)
14. [Project Setup and Commands](#14-project-setup-and-commands)
15. [Deliverables](#15-deliverables)
16. [150-Minute Implementation Plan](#16-150-minute-implementation-plan)
17. [Acceptance Criteria and Definition of Done](#17-acceptance-criteria-and-definition-of-done)
18. [Requirements Traceability Matrix](#18-requirements-traceability-matrix)
19. [Risks and Trade-Offs](#19-risks-and-trade-offs)
20. [MVP Recommendation and Priority List](#20-mvp-recommendation-and-priority-list)
21. [Open Clarification Questions](#21-open-clarification-questions)

---

## 1. Executive Summary

The **Interview Practice Tracker** is a responsive, single-page frontend application built for students preparing for technical job interviews. It allows a user to log, view, and track interview-preparation activities on a week-by-week basis. All data is persisted locally in the browser via `localStorage`; no backend, database, or authentication is required.

The application must be completed within **150 minutes** (a 2.5-hour machine-coding round), delivered as a public GitHub repository with a live deployment and a 1–2 minute demo video. The technology stack is fixed: **React + Vite + JavaScript (ES modules) + Tailwind CSS + React Router (Data Routing) + browser localStorage**.

This SRS defines every aspect of the system that a developer needs to build the application systematically — from architecture and data model to routing, UI, testing, and submission checklist — without guessing requirements.

**MVP Core:** A working dashboard that lets a student create, view, and mark as complete preparation activities for the current week, with data persisted across browser refreshes.

---

## 2. Document Purpose and Scope

### 2.1 Purpose

This document specifies the functional requirements, non-functional requirements, data model, architecture, UI design, and implementation plan for the Interview Practice Tracker. It serves as the authoritative reference during development and the basis for the post-build acceptance checklist.

### 2.2 Project Scope

**In scope:**

- Responsive weekly dashboard displaying current-week activities.
- Activity creation form with validation.
- Mark-complete / mark-incomplete toggle per activity.
- Weekly summary metrics (total activities, completed count).
- Client-side data persistence via `localStorage`.
- React Router v6 Data Routing with nested routes.
- Mobile-first responsive layout using Tailwind CSS.

**Out of scope:**

- Backend API, server-side rendering, or database.
- User authentication or authorization.
- Multi-user support.
- Push notifications or reminders.
- Data export or import.
- Offline service worker / PWA features.
- Third-party analytics.

### 2.3 Definitions and Abbreviations

| Term              | Definition                                                                                  |
|-------------------|---------------------------------------------------------------------------------------------|
| **Activity**      | A single interview-preparation task logged by the user (e.g., "Solved 2 LeetCode problems"). |
| **Week**          | A 7-day period running **Monday–Sunday** (see Business Rule BR-004).                         |
| **Current week**  | The week containing today's local date.                                                     |
| **MVP**           | Minimum Viable Product — the smallest feature set that satisfies the brief.                  |
| **FR**            | Functional Requirement.                                                                     |
| **NFR**           | Non-Functional Requirement.                                                                 |
| **BR**            | Business Rule.                                                                              |
| **TC**            | Test Case.                                                                                  |
| **RTM**           | Requirements Traceability Matrix.                                                           |
| **Explicit**      | Directly stated in the original problem brief.                                              |
| **Inferred**      | Not stated explicitly but necessary to make the application useful.                          |
| **Optional**      | Valuable enhancement; implement only if time remains after MVP.                             |

---

## 2.4 Original Problem Statement (Authoritative)

> Build a responsive dashboard where a student can track weekly interview-preparation work.
>
> **Constraints:** Time limit 2.5 hours · Frontend only · No backend required.
> **Deliverables:** GitHub repository · Live deployed application · 1–2 minute demo video.
> **README:** Setup instructions, features, and assumptions.
> **The developer must understand and be able to explain the implementation.**

All requirements in this SRS are mapped to this brief in Section 18 (RTM). Features not traceable to this brief are clearly labelled **Inferred** or **Optional**.

---

## 3. Technology Stack

### 3.1 Stack Overview

| Technology                  | Role                                              | Justification                                                                     |
|-----------------------------|---------------------------------------------------|-----------------------------------------------------------------------------------|
| **React 18**                | UI component library                              | Required by brief; component model fits the activity-list/dashboard pattern.       |
| **Vite 5+**                 | Build tool and dev server                         | Required by brief; fast HMR speeds up the 150-minute window.                      |
| **JavaScript (ES modules)** | Application logic                                 | Required by brief; avoids TypeScript setup overhead.                              |
| **Tailwind CSS**            | Utility-first styling                             | Required by brief; enables rapid responsive layout without a custom stylesheet.    |
| **React Router v6**         | Client-side routing (Data Routing API)            | Required by brief; `createBrowserRouter` / `RouterProvider` provide nested routing.|
| **browser localStorage**    | Client-side persistence                           | Required by brief; no backend needed; survives page refresh.                      |
| **Vitest + RTL**            | Unit and component testing                        | Recommended; integrates natively with Vite; optional if time is short.            |

### 3.2 Tailwind CSS Version Warning

> **IMPORTANT:** Tailwind CSS v3 and v4 have different installation procedures.
> - **Tailwind CSS v3:** Uses `tailwind.config.js`, PostCSS, and `@tailwind` directives in CSS.
> - **Tailwind CSS v4:** Uses a CSS-first configuration model (`@import "tailwindcss"`); no `tailwind.config.js` by default.
>
> **Check `npm info tailwindcss version` before following any setup guide.** This SRS does not assume a specific major version. Section 14 provides both variants. The developer must choose one and follow the corresponding official docs at [tailwindcss.com](https://tailwindcss.com/docs/installation).

### 3.3 React Router Data Routing vs. Declarative Routing

React Router v6 offers two patterns:

| Pattern              | API                                            | When to use                                             |
|----------------------|------------------------------------------------|---------------------------------------------------------|
| **Declarative**      | `<BrowserRouter>`, `<Routes>`, `<Route>`       | Simple flat routes; no loaders or actions needed.       |
| **Data Routing**     | `createBrowserRouter`, `RouterProvider`, `Outlet` | Nested layouts; optional loaders/actions; better error boundaries. |

This project uses **Data Routing** as required by the brief. However, loaders and actions should only be added where they provide genuine value:

- **Loader beneficial:** Loading the activity list on `/activities` from localStorage before the component mounts (prevents flash of empty state).
- **Action beneficial:** Submitting the new-activity form via React Router's `Form` component + `action` function.
- **Loaders/actions NOT needed:** Routes that only display derived state or have no async work.

If time is limited, omit loaders/actions and use hook-based state management instead. The route hierarchy with `Outlet` is mandatory regardless.

### 3.4 Packages NOT to Install

Do not install the following unless explicitly noted as Optional:

- Redux / Zustand / any global state library.
- Axios / fetch wrappers (no API calls needed).
- UI component libraries (MUI, Chakra, shadcn/ui) — see below.
- date-fns / dayjs — date logic is simple enough for vanilla JS.
- React Hook Form — the single form is simple enough for controlled components.
- Any authentication library.

**Optional:** A component library like `shadcn/ui` can accelerate UI polish but adds setup time (~10–15 min). Classify as **Optional**; do not assume it is available.

---

## 4. Architecture and Folder Structure

### 4.1 Architectural Principles

| Principle                            | Rule                                                                                                        |
|--------------------------------------|-------------------------------------------------------------------------------------------------------------|
| **Pages coordinate, not implement**  | Page components compose feature components; they do not contain form logic or business calculations.        |
| **Components = presentation**        | Components receive props and fire callbacks; they do not call localStorage.                                 |
| **Hooks = stateful logic**           | Custom hooks encapsulate `useState`, `useEffect`, and derived values related to a specific concern.         |
| **Services = data access**           | Service functions read/write localStorage; they are plain JS, not React components or hooks.               |
| **Utilities = pure functions**       | Utilities have no React imports; they are testable in isolation with zero mocking.                         |
| **No circular dependencies**         | Features may import from `shared/`; `shared/` must not import from any feature.                            |
| **No redundant state**               | Derived values (e.g., completion count) must be computed from the source list, never stored separately.    |
| **Stable IDs over array indexes**    | All update and delete operations must identify activities by their `id`, not their array position.          |
| **Business rules ≠ Tailwind classes**| Conditional styling is acceptable; business logic must not live inside className expressions.               |

### 4.2 Proposed Folder Structure

```
src/
├── app/
│   ├── router.jsx              # createBrowserRouter config
│   └── providers.jsx           # Future-proof: wraps RouterProvider (and any future context)
│
├── layouts/
│   └── DashboardLayout.jsx     # Shared shell: nav bar + <Outlet /> for child routes
│
├── features/
│   ├── activities/
│   │   ├── components/
│   │   │   ├── ActivityCard.jsx        # Single activity display (title, date, category, status)
│   │   │   ├── ActivityList.jsx        # Renders list of ActivityCard components
│   │   │   └── ActivityForm.jsx        # Controlled form for create (and optional edit)
│   │   ├── pages/
│   │   │   ├── ActivitiesPage.jsx      # /activities — list + link to new
│   │   │   ├── NewActivityPage.jsx     # /activities/new — renders ActivityForm
│   │   │   └── EditActivityPage.jsx    # /activities/:id/edit — optional
│   │   ├── hooks/
│   │   │   └── useActivities.js        # CRUD state, calls activityService
│   │   ├── services/
│   │   │   └── activityService.js      # localStorage read/write for activities
│   │   └── activity.constants.js       # CATEGORIES array, STATUS values
│   │
│   └── dashboard/
│       ├── components/
│       │   ├── WeeklySummary.jsx        # Completion count, total, progress bar
│       │   └── WeekNavigator.jsx        # Display current week label; optional prev/next
│       └── pages/
│           └── DashboardPage.jsx        # /dashboard — summary + current-week activity list
│
├── shared/
│   ├── components/
│   │   ├── Button.jsx                  # Reusable button with variant props
│   │   ├── Input.jsx                   # Reusable labeled input with error state
│   │   ├── Select.jsx                  # Reusable labeled select
│   │   ├── EmptyState.jsx              # Icon + message + optional CTA
│   │   └── NotFound.jsx                # 404 / error boundary UI
│   ├── constants/
│   │   └── index.js                    # App-wide constants (APP_NAME, STORAGE_KEYS)
│   └── utils/
│       ├── dateUtils.js                # getWeekBounds, formatDate, isSameWeek
│       └── idUtils.js                  # generateId using crypto.randomUUID or fallback
│
├── styles/
│   └── index.css                       # Tailwind directives + minimal base styles
│
├── App.jsx                             # Root component (may just render <RouterProvider />)
└── main.jsx                            # ReactDOM.createRoot entry point
```

> **Note on empty folders:** Do not create directories without at least one file planned for them. The structure above corresponds to actual planned files.

### 4.3 Responsibility Boundary Summary

| Layer       | Can import from    | Cannot import from                     |
|-------------|--------------------|-----------------------------------------|
| `pages/`    | `components/`, `hooks/`, `shared/`, `utils/` | Other pages          |
| `components/` | `shared/components/`, `shared/utils/` | `services/`, localStorage |
| `hooks/`    | `services/`, `utils/`, `shared/`     | Direct DOM/localStorage access          |
| `services/` | `shared/utils/`, `shared/constants/` | React, components, hooks               |
| `utils/`    | Nothing (pure JS)  | React, services, components            |
| `shared/`   | `shared/` only     | Any `features/` folder                 |

---

## 5. React Router Data Routing

### 5.1 Route Map

```
/                         →  Redirect to /dashboard
/dashboard                →  DashboardPage       (child of DashboardLayout)
/activities               →  ActivitiesPage      (child of DashboardLayout)
/activities/new           →  NewActivityPage     (child of DashboardLayout)
/activities/:activityId/edit  →  EditActivityPage (optional; child of DashboardLayout)
*                         →  NotFound            (fallback, outside DashboardLayout)
```

### 5.2 Router Configuration (`src/app/router.jsx`)

```jsx
// Illustrative structure — do not copy blindly; verify API against installed version
import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage   from '../features/dashboard/pages/DashboardPage';
import ActivitiesPage  from '../features/activities/pages/ActivitiesPage';
import NewActivityPage from '../features/activities/pages/NewActivityPage';
import NotFound        from '../shared/components/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'activities', element: <ActivitiesPage /> },
      { path: 'activities/new', element: <NewActivityPage /> },
      // Optional:
      // { path: 'activities/:activityId/edit', element: <EditActivityPage /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
```

### 5.3 Route Priority Classification

| Route                        | Priority   | Classification |
|------------------------------|------------|----------------|
| `/dashboard`                 | **Must**   | Explicit       |
| `/activities`                | **Must**   | Inferred       |
| `/activities/new`            | **Must**   | Inferred       |
| `/activities/:id/edit`       | **Should** | Optional       |

### 5.4 DashboardLayout and Outlet

`DashboardLayout.jsx` provides:

- Top navigation bar with links: **Dashboard** | **Activities**.
- Active link styling using React Router's `NavLink` and the `isActive` prop (apply a distinct Tailwind class such as `font-semibold underline` or a highlighted background).
- A `<main>` region that renders `<Outlet />` — child route content is injected here.
- A responsive sidebar or top-nav depending on viewport (mobile: top-nav; desktop: sidebar or top-nav).

### 5.5 Loaders and Actions

| Route                | Loader?  | Action?  | Rationale                                                                 |
|----------------------|----------|----------|---------------------------------------------------------------------------|
| `/dashboard`         | Optional | No       | A loader can pre-populate the week's activities; hook-based is simpler.  |
| `/activities`        | Optional | No       | Same as above.                                                            |
| `/activities/new`    | No       | Optional | An action can handle form submission; controlled component is simpler.   |
| `/activities/:id/edit` | Optional | Optional | Loader fetches existing activity; action handles update.               |

**Decision:** For the 150-minute window, use **hooks and services** instead of loaders/actions unless you have spare time. The route structure (nested layout, `Outlet`, `NavLink`) is mandatory; loaders/actions are optional sophistication.

### 5.6 Not-Found and Error Handling

- The wildcard route `{ path: '*', element: <NotFound /> }` catches all unmatched paths.
- `errorElement: <NotFound />` on the root route catches router-level errors (e.g., a failed loader).
- `NotFound` displays a friendly message and a link back to `/dashboard`.

### 5.7 Deployed Route Refresh

When deployed to a static host (Vercel, Netlify, GitHub Pages):

- `createBrowserRouter` uses the HTML5 History API. Deep links (e.g., `/activities/new`) return a 404 from the static server on refresh unless a redirect rule is configured.
- **Vercel / Netlify:** Add a redirect rule: all paths → `/index.html` with status 200.
  - Netlify: Create `public/_redirects` containing `/* /index.html 200`.
  - Vercel: Create `vercel.json` with `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`.
- **GitHub Pages:** Requires a workaround (404.html trick) or use hash-based routing. **Recommendation:** Use Netlify or Vercel to avoid this complexity.

---

## 6. Tailwind CSS Requirements

### 6.1 Design Principles

| Principle         | Requirement                                                              |
|-------------------|--------------------------------------------------------------------------|
| Color palette     | Neutral base (white/gray-50 background) + one accent color (blue-600).  |
| Typography        | Clear hierarchy: `text-2xl font-bold` headings → `text-base` body.      |
| Spacing           | Consistent spacing scale: `p-4`, `gap-4`, `mb-6` etc.                  |
| Borders           | Subtle: `border border-gray-200 rounded-lg`.                            |
| Cards             | White background, rounded corners, shadow: `bg-white rounded-lg shadow-sm border border-gray-100`. |
| Focus states      | Visible: `focus:outline-none focus:ring-2 focus:ring-blue-500`.         |
| Color contrast    | Text must meet WCAG AA: use `text-gray-900` on light backgrounds.       |
| Responsive        | Mobile-first; use `sm:`, `md:`, `lg:` breakpoints as needed.            |

### 6.2 Responsive Breakpoints

| Breakpoint | Width    | Layout Expectation                                    |
|------------|----------|-------------------------------------------------------|
| default    | < 640px  | Single-column; full-width cards; stacked nav.        |
| `sm:`      | ≥ 640px  | Two-column activity grid possible.                    |
| `md:`      | ≥ 768px  | Sidebar or wider content column.                     |
| `lg:`      | ≥ 1024px | Full dashboard layout; summary + list side by side.  |

### 6.3 Component Styling Contracts

| Component       | Base Classes                                                                     |
|-----------------|----------------------------------------------------------------------------------|
| **Button (primary)** | `bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors` |
| **Button (secondary)** | `bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors` |
| **Button (danger)** | `bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors` |
| **Input**       | `block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500` |
| **Input (error)** | `border-red-500 focus:ring-red-500`                                            |
| **Card**        | `bg-white rounded-lg shadow-sm border border-gray-100 p-4`                      |
| **Label**       | `block text-sm font-medium text-gray-700 mb-1`                                  |
| **Error text**  | `text-red-600 text-xs mt-1`                                                     |
| **Nav link (active)** | `font-semibold text-blue-600 border-b-2 border-blue-600`                 |
| **Empty state** | `text-center text-gray-500 py-12`                                                |

### 6.4 Status Indicators (Accessibility)

Activity completion status must **not rely on color alone**. Use both color and a text/icon indicator:

- **Completed:** Green badge + checkmark icon + text "Completed" (or strikethrough title).
- **Pending:** Gray badge + clock/circle icon + text "Pending".

Example badge:
```html
<!-- Completed -->
<span class="inline-flex items-center gap-1 text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
  ✓ Completed
</span>
<!-- Pending -->
<span class="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
  ○ Pending
</span>
```

---

## 7. Functional Requirements

Each requirement has: **ID · Description · Classification · Priority · Acceptance Criteria**

### 7.1 Core Requirements (Must Implement)

---

**FR-001 — Responsive Weekly Dashboard**

- **Description:** The application must display a responsive dashboard showing the current week's label and activities.
- **Classification:** Explicit
- **Priority:** P0 – Critical
- **Acceptance Criteria:**
  - Dashboard loads at `/dashboard`.
  - The current week label (e.g., "Week of Oct 6 – Oct 12, 2026") is visible.
  - The layout is usable on a 375px-wide mobile viewport and a 1280px desktop viewport.
  - No horizontal scroll on mobile.

---

**FR-002 — Create Activity**

- **Description:** A user can navigate to `/activities/new` and submit a form to create a new interview-preparation activity.
- **Classification:** Inferred (required to make the tracker useful)
- **Priority:** P0 – Critical
- **Acceptance Criteria:**
  - Form is accessible at `/activities/new` (via nav link or button).
  - Submitting a valid form saves the activity and navigates to `/activities` or `/dashboard`.
  - The new activity appears immediately in the list.
  - Activity persists after a browser refresh.

---

**FR-003 — Form Validation**

- **Description:** The activity form must validate required fields before submission.
- **Classification:** Inferred
- **Priority:** P0 – Critical
- **Acceptance Criteria:**
  - Submitting with an empty title shows an inline error message: "Title is required."
  - Submitting with no date (if date is required) shows: "Date is required."
  - Error messages are associated with their inputs via `aria-describedby` or visible label proximity.
  - Valid submission clears errors.
  - Error state is visible without relying on color alone (error text must appear).

---

**FR-004 — View Activities**

- **Description:** A user can view a list of their logged activities at `/activities`.
- **Classification:** Inferred
- **Priority:** P0 – Critical
- **Acceptance Criteria:**
  - All stored activities are displayed.
  - Each card shows: title, date, category, and completion status.
  - Empty state is displayed when no activities exist.

---

**FR-005 — Empty State**

- **Description:** When no activities exist (globally or for the current week), the application displays an informative empty state with a call-to-action.
- **Classification:** Inferred
- **Priority:** P0 – Critical
- **Acceptance Criteria:**
  - Empty state text is visible (e.g., "No activities yet. Start tracking your prep!").
  - A button or link to `/activities/new` is present in the empty state.
  - No error or blank white space is shown.

---

**FR-006 — Mobile-Usable Layout**

- **Description:** All screens are usable on a 375px viewport (iPhone SE / small Android).
- **Classification:** Explicit ("responsive dashboard")
- **Priority:** P0 – Critical
- **Acceptance Criteria:**
  - No content is clipped or horizontally scrollable.
  - Buttons and inputs meet minimum tap target size (44×44px recommended).
  - Navigation links are reachable on mobile.

---

**FR-007 — Mark Activity Complete / Incomplete**

- **Description:** A user can toggle the completion status of an activity without leaving the list.
- **Classification:** Inferred (makes the tracker actionable)
- **Priority:** P1 – High
- **Acceptance Criteria:**
  - Each activity card has a toggle (checkbox, button, or icon).
  - Toggling changes the status immediately and persists after refresh.
  - The UI reflects the new status using both color and text/icon.

---

**FR-008 — Weekly Summary**

- **Description:** The dashboard shows a summary of the current week: total activities, completed activities, and a simple progress indicator.
- **Classification:** Inferred
- **Priority:** P1 – High
- **Acceptance Criteria:**
  - Summary shows "X of Y activities completed this week."
  - Progress bar or similar visual is present.
  - Values update immediately when an activity is toggled or created.
  - Summary is derived from the activity list (no separate stored state).

---

**FR-009 — Persist Data via localStorage**

- **Description:** All activities are stored in `localStorage` under a defined key. Data survives browser refresh, tab close, and reopen.
- **Classification:** Inferred (required for a tracker to be useful)
- **Priority:** P1 – High
- **Acceptance Criteria:**
  - Activities created in one session are present after a hard refresh.
  - Malformed JSON in localStorage is caught gracefully (falls back to empty array).
  - Storage errors (e.g., quota exceeded) are caught and do not crash the app.

---

**FR-010 — Delete Activity**

- **Description:** A user can delete an activity from the list.
- **Classification:** Inferred
- **Priority:** P1 – High
- **Acceptance Criteria:**
  - A delete button is visible on each activity card.
  - Clicking delete removes the activity immediately from the list and from localStorage.
  - (Optional) A confirmation prompt is shown before deletion.
  - Deleting the last activity shows the empty state.

---

**FR-011 — Edit Activity** *(Optional)*

- **Description:** A user can edit an existing activity's title, date, category, or notes.
- **Classification:** Optional
- **Priority:** P2 – Optional
- **Acceptance Criteria:**
  - Navigating to `/activities/:id/edit` pre-fills the form with existing data.
  - Submitting saves the updated activity and navigates back.
  - If `activityId` is not found, the user is redirected to `/activities` with an error message.

---

**FR-012 — Category Assignment** *(Inferred)*

- **Description:** An activity can be assigned one of a fixed set of categories (e.g., DSA, System Design, Behavioral, HR, Frontend, Backend).
- **Classification:** Inferred
- **Priority:** P1 – High
- **Acceptance Criteria:**
  - The create form includes a category selector.
  - Category is displayed on the activity card.
  - Default category is applied if none is selected (see BR-007).

---

**FR-013 — Filter by Status** *(Optional)*

- **Description:** A user can filter the activity list to show only completed or only pending activities.
- **Classification:** Optional
- **Priority:** P2 – Optional
- **Acceptance Criteria:**
  - Filter buttons/tabs are present above the activity list.
  - Selecting a filter updates the visible list immediately.
  - "All" filter is the default.

---

**FR-014 — Week Navigation** *(Optional)*

- **Description:** A user can navigate to the previous week to review past activities.
- **Classification:** Optional
- **Priority:** P2 – Optional
- **Acceptance Criteria:**
  - Prev/next buttons change the displayed week label and filter the activity list.
  - Activities from past weeks are stored and retrievable.
  - Navigation returns to the current week via a "Today" or "Current Week" button.

---

## 8. Data Model and Business Rules

### 8.1 Activity Entity

| Field             | Type      | Required | Default         | Validation                           | Example                      |
|-------------------|-----------|----------|-----------------|--------------------------------------|------------------------------|
| `id`              | `string`  | Yes      | Auto-generated  | Must be unique; non-empty string     | `"a1b2c3d4"`                 |
| `title`           | `string`  | Yes      | —               | Min 1 char; max 200 chars; trimmed   | `"Solved 3 LeetCode mediums"`|
| `date`            | `string`  | Yes      | Today (ISO)     | Valid ISO 8601 date (`YYYY-MM-DD`)   | `"2026-10-10"`               |
| `category`        | `string`  | Yes      | `"DSA"`         | Must be one of `CATEGORIES` constant | `"System Design"`            |
| `completed`       | `boolean` | Yes      | `false`         | Boolean only                         | `false`                      |
| `notes`           | `string`  | No       | `""`            | Max 500 chars                        | `"Struggled with DP"`        |
| `durationMinutes` | `number`  | No       | `null`          | Integer ≥ 1; ≤ 1440                  | `45`                         |
| `createdAt`       | `string`  | Yes      | Now (ISO)       | Valid ISO 8601 datetime              | `"2026-10-10T06:00:00.000Z"` |
| `updatedAt`       | `string`  | No       | `null`          | Valid ISO 8601 datetime if present   | `"2026-10-10T07:00:00.000Z"` |

> **MVP note:** `notes`, `durationMinutes`, and `updatedAt` are optional. Do not implement them unless they fit within the time budget.

### 8.2 Predefined Categories

```js
// src/features/activities/activity.constants.js
export const CATEGORIES = [
  'DSA',
  'System Design',
  'Behavioral',
  'Frontend',
  'Backend',
  'HR',
  'Other',
];

export const DEFAULT_CATEGORY = 'DSA';
```

### 8.3 Business Rules

---

**BR-001 — Unique Activity Identifier**

Use `crypto.randomUUID()` to generate IDs. Provide a fallback for browsers that do not support it:
```js
// src/shared/utils/idUtils.js
export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
```

---

**BR-002 — Title Validation**

A title is invalid if, after trimming whitespace, its length is 0. The trimmed value must be stored (not the raw input).

---

**BR-003 — Date Handling**

- Dates are stored as ISO 8601 date strings (`YYYY-MM-DD`), representing **local** dates.
- Do **not** store full ISO datetimes for the `date` field to avoid timezone-offset bugs (e.g., `new Date("2026-10-10")` in UTC can resolve to Oct 9 in UTC−5).
- To get today's local date string:
  ```js
  function getTodayString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day   = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  ```
- Validate that `date` matches `/^\d{4}-\d{2}-\d{2}$/` and represents a real calendar date.

---

**BR-004 — Week Boundaries (Monday–Sunday)**

**Assumption:** The week starts on **Monday**. This is documented as an assumption; it is not stated in the original brief.

```js
// src/shared/utils/dateUtils.js
export function getWeekBounds(dateString) {
  // Parse as local date to avoid UTC-offset shift
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, …, 6=Sat
  const diffToMonday = (dayOfWeek === 0) ? -6 : 1 - dayOfWeek;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: toDateString(monday),   // "YYYY-MM-DD"
    end:   toDateString(sunday),   // "YYYY-MM-DD"
  };
}

function toDateString(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function isSameWeek(dateString, referenceDate) {
  const bounds = getWeekBounds(referenceDate);
  return dateString >= bounds.start && dateString <= bounds.end;
}
```

---

**BR-005 — Default Completion Status**

New activities are created with `completed: false`.

---

**BR-006 — Update Behavior**

When editing an activity, update only the changed fields. Always set `updatedAt` to the current ISO datetime string. Do not change the `id` or `createdAt`.

---

**BR-007 — Default Category**

If the user submits the form without selecting a category, default to `'DSA'`. The select element should have `'DSA'` pre-selected.

---

**BR-008 — Delete Behavior**

Remove the activity from the in-memory array and immediately persist the new array to localStorage. Deletion is permanent (no undo in MVP).

---

**BR-009 — Summary Derivation**

Weekly summary values must be computed from the filtered activity list at render time. They must never be stored as separate fields.

```js
// Derived in DashboardPage or WeeklySummary component via hook
const weekActivities = activities.filter(a => isSameWeek(a.date, today));
const totalCount     = weekActivities.length;
const completedCount = weekActivities.filter(a => a.completed).length;
```

---

**BR-010 — localStorage Key**

All activities are stored under a single key. Define it as a constant:
```js
// src/shared/constants/index.js
export const STORAGE_KEY = 'ipt_activities';
```

---

**BR-011 — Malformed localStorage Handling**

```js
// src/features/activities/services/activityService.js
export function loadActivities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.warn('Failed to parse activities from localStorage. Resetting.');
    return [];
  }
}
```

---

**BR-012 — localStorage Unavailability**

Wrap all `localStorage` calls in try/catch. If storage is unavailable (e.g., private browsing in some browsers, storage quota exceeded), the app must continue to function for the current session using in-memory state only. Log a warning; do not crash.

---

**BR-013 — Historical Activity Retention**

Activities from previous weeks remain in localStorage indefinitely (no automatic expiry). The MVP does not implement week-based cleanup.

---

**BR-014 — Week Label Formatting**

Display the week as: `"Week of [Mon full date] – [Sun full date]"`, e.g., `"Week of Oct 6 – Oct 12, 2026"`.

---

## 9. Non-Functional Requirements

| ID      | Requirement                | Target / Rule                                                                                     | Source       |
|---------|----------------------------|---------------------------------------------------------------------------------------------------|--------------|
| NFR-001 | Responsiveness             | All screens usable at 375px, 768px, and 1280px viewport widths without horizontal scrolling.      | Explicit     |
| NFR-002 | Accessibility              | All interactive elements have visible focus styles; all form inputs have associated labels; color is not the sole status indicator. | Inferred |
| NFR-003 | Performance                | Initial page load (dev server) under 3 seconds on a standard laptop. Render of ≤100 activities instantaneous for the user. | Assumption |
| NFR-004 | Maintainability            | Each file has a single responsibility. Functions are ≤ 40 lines. Components are ≤ 150 lines.      | Inferred     |
| NFR-005 | Error handling             | No uncaught exceptions propagate to the browser console during normal user workflows.              | Inferred     |
| NFR-006 | Browser compatibility      | Works in the latest stable releases of Chrome, Firefox, and Edge (evergreen).                     | Assumption   |
| NFR-007 | Code readability           | Variable and function names are descriptive; no single-letter variables outside loop indexes.      | Inferred     |
| NFR-008 | Developer explainability   | The developer can verbally explain any component, hook, or service chosen for the demo.            | Explicit     |
| NFR-009 | Persistence reliability    | localStorage read/write succeeds on Chrome 120+, Firefox 120+, Edge 120+ under normal quota limits. | Assumption |
| NFR-010 | Production build           | `npm run build` completes without errors; `npm run preview` serves the app correctly.              | Inferred     |
| NFR-011 | No TypeScript errors       | N/A (project uses JS). ESLint (if configured) must show 0 errors at submission.                   | Inferred     |
| NFR-012 | Semantic HTML              | Page structure uses `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, and `<button>` appropriately. | Inferred |

---

## 10. UI/UX Specification

### 10.1 Screen: Dashboard (`/dashboard`)

| Aspect              | Specification                                                                           |
|---------------------|-----------------------------------------------------------------------------------------|
| **Purpose**         | Entry point; shows current week's progress and activity list.                          |
| **Main components** | `WeekNavigator`, `WeeklySummary`, `ActivityList` (filtered to current week).           |
| **Primary action**  | "Add Activity" button → navigates to `/activities/new`.                                |
| **Secondary actions** | Toggle activity completion inline; (optional) delete from card.                     |
| **Empty state**     | "No activities this week. Ready to start?" + "Add Activity" button.                   |
| **Validation state** | N/A (no form on this page).                                                           |
| **Responsive**      | Mobile: single column list. Desktop: summary panel + list side by side (`lg:grid-cols-3`). |

### 10.2 Screen: Activity List (`/activities`)

| Aspect              | Specification                                                                           |
|---------------------|-----------------------------------------------------------------------------------------|
| **Purpose**         | Manage all activities (not filtered by week by default).                               |
| **Main components** | `ActivityList`, optional filter tabs.                                                  |
| **Primary action**  | "New Activity" button → `/activities/new`.                                             |
| **Secondary actions** | Toggle complete, delete; (optional) edit → `/activities/:id/edit`.                  |
| **Empty state**     | "No activities yet. Add your first one!" + "New Activity" button.                     |
| **Responsive**      | Same as dashboard list; card grid on wider screens.                                    |

### 10.3 Screen: New Activity (`/activities/new`)

| Aspect              | Specification                                                                           |
|---------------------|-----------------------------------------------------------------------------------------|
| **Purpose**         | Create a new activity.                                                                 |
| **Main components** | `ActivityForm` with Title, Date, Category, (optional Notes, Duration).                |
| **Primary action**  | "Save Activity" submit button.                                                         |
| **Secondary actions** | "Cancel" → navigates back (or to `/activities`).                                    |
| **Empty state**     | N/A.                                                                                   |
| **Validation state** | Inline error under each invalid field; submit button remains enabled (validate on submit). |
| **Success state**   | After save, navigate to `/activities` or `/dashboard`; new activity is visible.       |
| **Responsive**      | Single-column form; full-width inputs; large tap targets.                              |

### 10.4 Screen: Edit Activity (`/activities/:id/edit`) — Optional

| Aspect              | Specification                                                                           |
|---------------------|-----------------------------------------------------------------------------------------|
| **Purpose**         | Edit an existing activity.                                                             |
| **Main components** | `ActivityForm` pre-filled with existing data.                                          |
| **Primary action**  | "Update Activity" submit button.                                                       |
| **Secondary actions** | "Cancel" → navigates back.                                                          |
| **Error state**     | If `:id` not found → redirect to `/activities` with optional toast/banner.            |

### 10.5 Screen: Not Found (`*`)

| Aspect              | Specification                                                                           |
|---------------------|-----------------------------------------------------------------------------------------|
| **Purpose**         | Handle unrecognized URLs gracefully.                                                   |
| **Main components** | Large "404" heading, message, link to `/dashboard`.                                    |
| **Primary action**  | "Go to Dashboard" link/button.                                                         |

### 10.6 Navigation Bar

- Present on all routes via `DashboardLayout`.
- Contains: App name/logo (left) + nav links (right on desktop; top row on mobile).
- Links: **Dashboard** (`/dashboard`) · **Activities** (`/activities`).
- Active link highlighted with `NavLink` + active class.
- "Add Activity" CTA button in the nav bar on desktop (optional).

### 10.7 ActivityCard Component

Each activity card displays:

```
┌─────────────────────────────────────────────────────┐
│  [✓ Completed / ○ Pending]  DSA        Oct 10, 2026 │
│  Solved 3 LeetCode mediums                          │
│  Notes: Struggled with DP (optional)                │
│                         [Complete] [Edit] [Delete]  │
└─────────────────────────────────────────────────────┘
```

- Title is the largest text in the card.
- Badge for category (subtle background color per category, or neutral gray if categories exceed color palette).
- Status badge as specified in Section 6.4.
- Action buttons at the bottom right; icon-only on mobile with `title` attribute for accessibility.

---

## 11. Technical Design and State Management

### 11.1 Data Flow

```
User interaction (form submit / toggle / delete)
        ↓
Input validation (pure utility function)
        ↓
State update via useActivities hook (setState)
        ↓
UI re-renders (React reconciliation)
        ↓
Persistence side effect (activityService.saveActivities)
```

### 11.2 State Placement Rules

| State                        | Lives in                          | Why                                                     |
|------------------------------|-----------------------------------|---------------------------------------------------------|
| Activities array             | `useActivities` hook              | Shared across Dashboard and Activities pages.           |
| Form field values            | `ActivityForm` local `useState`   | Form state is local to the form component.              |
| Form validation errors       | `ActivityForm` local `useState`   | Local to the form; reset on mount.                      |
| Selected week (optional nav) | `DashboardPage` or `useWeek` hook | Week selection affects only the dashboard filter.       |
| Active filter tab            | `ActivitiesPage` local `useState` | Affects only the list on that page.                     |
| Completion totals            | Derived in `WeeklySummary`        | Computed from `activities`; never stored.               |

### 11.3 `useActivities` Hook Interface

```js
// src/features/activities/hooks/useActivities.js
const {
  activities,      // Activity[] — full list
  addActivity,     // (activityData) => void
  updateActivity,  // (id, changes) => void
  deleteActivity,  // (id) => void
  toggleComplete,  // (id) => void
} = useActivities();
```

Internally, this hook:
1. Initializes state with `loadActivities()` from `activityService` (runs once on mount via `useState` initializer or `useEffect`).
2. On every mutation, calls the corresponding service function to sync localStorage.
3. Does NOT compute derived values (that happens in the consuming component).

### 11.4 `activityService` Interface

```js
// src/features/activities/services/activityService.js
export function loadActivities()           // → Activity[]
export function saveActivities(activities) // → void (writes to localStorage)
```

### 11.5 Avoiding Common Pitfalls

| Pitfall                                   | Prevention                                                             |
|-------------------------------------------|------------------------------------------------------------------------|
| `new Date("2026-10-10")` in UTC           | Parse dates manually as local (see BR-003).                           |
| Storing derived totals in state           | Compute totals inline from the activity array (see BR-009).           |
| Updating by array index                   | Always find and update by `activity.id` (see Architecture Principle). |
| Direct localStorage in components        | All storage access goes through `activityService`.                    |
| `useEffect` writing on every render      | Only persist inside mutation functions, not in a blanket effect.      |

---

## 12. Error Handling and Edge Cases

| Case                               | Expected Behavior                                                                                |
|------------------------------------|--------------------------------------------------------------------------------------------------|
| Empty activity list                | Display `EmptyState` component; no error or blank space.                                        |
| Blank title                        | Inline error "Title is required." Submission blocked.                                           |
| Invalid date format                | Inline error "Please enter a valid date." Submission blocked.                                   |
| Activity ID not found (edit)       | Redirect to `/activities`; optionally display a banner: "Activity not found."                   |
| Deleting the last activity         | List renders empty state after deletion; no error.                                              |
| Refresh after create/update        | `loadActivities()` hydrates from localStorage; state is consistent.                            |
| Malformed localStorage JSON        | `try/catch` in `loadActivities`; falls back to `[]`; logs a warning.                           |
| localStorage unavailable           | `try/catch` around `saveActivities`; in-memory state still works; user sees no crash.          |
| Week boundary (e.g., Mon Jan 1)    | `getWeekBounds` handles year transitions correctly because it uses local `Date` arithmetic.     |
| Month-end week transition          | Same as above; `setDate` handles overflow (e.g., Oct 31 + 1 day = Nov 1).                      |
| Direct URL access (`/activities/new`) | Works in dev (Vite handles it). Requires redirect config in production (see Section 5.7).  |
| Deployed nested route refresh      | Netlify `_redirects` / Vercel `vercel.json` must be configured (see Section 5.7).              |
| Mobile layout overflow             | `overflow-hidden` or `overflow-x-hidden` on root; test at 375px.                              |
| Missing/invalid `:activityId` param | Redirect to `/activities` with a fallback message.                                            |
| Storage quota exceeded             | Catch the error; warn the user with an inline banner (e.g., "Could not save. Storage full."). |

---

## 13. Testing Strategy

### 13.1 Priority Order (Given Time Constraints)

1. **Pure utility tests** (easiest, highest coverage value per minute).
2. **Activity validation tests**.
3. **Component test for activity creation workflow**.
4. **Persistence tests** (service functions).
5. **Routing / integration tests** (if time permits).

### 13.2 Test Cases

---

**TC-001 — getWeekBounds: Monday input**

- **Precondition:** Date string `"2026-10-12"` (a Monday).
- **Steps:** Call `getWeekBounds("2026-10-12")`.
- **Expected:** `{ start: "2026-10-12", end: "2026-10-18" }`.
- **Priority:** High.

---

**TC-002 — getWeekBounds: Sunday input**

- **Precondition:** Date string `"2026-10-11"` (a Sunday).
- **Steps:** Call `getWeekBounds("2026-10-11")`.
- **Expected:** `{ start: "2026-10-05", end: "2026-10-11" }`.
- **Priority:** High.

---

**TC-003 — getWeekBounds: year boundary**

- **Precondition:** Date string `"2027-01-01"` (a Friday).
- **Steps:** Call `getWeekBounds("2027-01-01")`.
- **Expected:** `{ start: "2026-12-28", end: "2027-01-03" }`.
- **Priority:** High.

---

**TC-004 — isSameWeek: activity within week**

- **Precondition:** Activity date `"2026-10-10"`, reference `"2026-10-10"`.
- **Steps:** Call `isSameWeek("2026-10-10", "2026-10-10")`.
- **Expected:** `true`.
- **Priority:** Medium.

---

**TC-005 — isSameWeek: activity outside week**

- **Precondition:** Activity date `"2026-10-04"`, reference `"2026-10-10"`.
- **Steps:** Call `isSameWeek("2026-10-04", "2026-10-10")`.
- **Expected:** `false`.
- **Priority:** Medium.

---

**TC-006 — Validation: empty title**

- **Precondition:** Activity data `{ title: "  ", date: "2026-10-10", category: "DSA" }`.
- **Steps:** Call validation function.
- **Expected:** Returns `{ title: "Title is required." }` (errors object).
- **Priority:** High.

---

**TC-007 — Validation: valid activity**

- **Precondition:** Activity data `{ title: "Practiced DP", date: "2026-10-10", category: "DSA" }`.
- **Steps:** Call validation function.
- **Expected:** Returns `{}` (no errors).
- **Priority:** High.

---

**TC-008 — loadActivities: valid JSON**

- **Precondition:** `localStorage.getItem(STORAGE_KEY)` returns valid JSON array string.
- **Steps:** Call `loadActivities()`.
- **Expected:** Returns parsed array.
- **Priority:** High.

---

**TC-009 — loadActivities: malformed JSON**

- **Precondition:** `localStorage.getItem(STORAGE_KEY)` returns `"not-json"`.
- **Steps:** Call `loadActivities()`.
- **Expected:** Returns `[]`; no exception thrown.
- **Priority:** High.

---

**TC-010 — loadActivities: empty storage**

- **Precondition:** `localStorage.getItem(STORAGE_KEY)` returns `null`.
- **Steps:** Call `loadActivities()`.
- **Expected:** Returns `[]`.
- **Priority:** Medium.

---

**TC-011 — Component: ActivityForm renders without crash**

- **Precondition:** RTL render of `<ActivityForm onSubmit={vi.fn()} />`.
- **Steps:** Render component.
- **Expected:** Title input, date input, category select, and submit button are in the document.
- **Priority:** High.

---

**TC-012 — Component: ActivityForm shows error on empty submit**

- **Precondition:** RTL render of `<ActivityForm onSubmit={vi.fn()} />`.
- **Steps:** Click submit without filling in title.
- **Expected:** Error message "Title is required." is visible.
- **Priority:** High.

---

**TC-013 — Component: ActivityForm submits valid data**

- **Precondition:** RTL render with `onSubmit` spy.
- **Steps:** Fill in title, date, category; click submit.
- **Expected:** `onSubmit` is called once with an object containing `title`, `date`, `category`, and `completed: false`.
- **Priority:** High.

---

**TC-014 — Component: ActivityCard shows completion badge**

- **Precondition:** Render `<ActivityCard activity={{ ...activityFixture, completed: true }} />`.
- **Steps:** Inspect DOM.
- **Expected:** Element with text "Completed" is present.
- **Priority:** Medium.

---

**TC-015 — Route: NotFound renders for unknown path** *(Integration)*

- **Precondition:** Render app with `MemoryRouter` pointing to `/unknown`.
- **Steps:** Assert page content.
- **Expected:** "404" or "Not Found" text is present.
- **Priority:** Low (manual check acceptable).

---

**TC-016 — Manual: Responsive layout at 375px**

- **Precondition:** Chrome DevTools set to 375×667 (iPhone SE).
- **Steps:** Load dashboard, activities, and new-activity form.
- **Expected:** No horizontal scroll; all content visible; buttons tappable.
- **Priority:** High (manual).

---

**TC-017 — Production build verification**

- **Precondition:** `npm run build` executed.
- **Steps:** Run `npm run preview`; navigate all routes; create and toggle an activity.
- **Expected:** No console errors; activity persists; all routes work.
- **Priority:** High (manual).

---

## 14. Project Setup and Commands

### 14.1 Setup Steps

```bash
# 1. Create React project with Vite
npm create vite@latest interview-practice-tracker -- --template react
cd interview-practice-tracker

# 2. Install core dependencies
npm install
npm install react-router-dom

# 3. Install Tailwind CSS
#    *** CHECK VERSION FIRST ***
npm info tailwindcss version
```

### 14.2 Tailwind v3 Setup (if version is 3.x)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Edit `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
};
```

Edit `src/styles/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 14.3 Tailwind v4 Setup (if version is 4.x)

```bash
npm install tailwindcss @tailwindcss/vite
```

Edit `vite.config.js`:
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

Edit `src/styles/index.css`:
```css
@import "tailwindcss";
```

> **Do not mix v3 and v4 instructions.** Check the installed version and follow one path to completion.

### 14.4 Testing Setup (Optional — add if time permits)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Edit `vite.config.js` to add:
```js
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.js',
}
```

Create `src/test/setup.js`:
```js
import '@testing-library/jest-dom';
```

### 14.5 NPM Scripts

```json
{
  "scripts": {
    "dev":     "vite",
    "build":   "vite build",
    "preview": "vite preview",
    "test":    "vitest run",
    "test:watch": "vitest"
  }
}
```

### 14.6 Deployment

**Recommended: Vercel (fastest)**

```bash
npm install -g vercel
vercel --prod
```

Create `vercel.json` in project root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Alternative: Netlify**

Create `public/_redirects`:
```
/* /index.html 200
```

---

## 15. Deliverables

### 15.1 GitHub Repository

| Item                       | Requirement                                                               |
|----------------------------|---------------------------------------------------------------------------|
| Source code                | All `src/` files committed.                                               |
| Configuration files        | `vite.config.js`, `package.json`, `tailwind.config.js` (v3), `vercel.json` / `_redirects`. |
| README.md                  | All sections specified in 15.2.                                           |
| `.gitignore`               | `node_modules/`, `dist/`, `.env`, `.DS_Store` excluded.                  |
| No secrets                 | No API keys, tokens, or private credentials.                              |

### 15.2 README.md Structure

```markdown
# Interview Practice Tracker

## Overview
Brief description of the application.

## Features
- Bullet list of implemented features.

## Tech Stack
- React, Vite, Tailwind CSS, React Router v6, localStorage.

## Prerequisites
- Node.js (≥ 18.x recommended), npm.

## Installation and Setup
Step-by-step commands.

## Development and Build Commands
npm run dev / build / preview / test.

## Architecture / Folder Structure
Condensed folder tree.

## Key Assumptions
- Week starts on Monday.
- No backend or auth.
- [Other assumptions documented here.]

## Known Limitations
- No data export.
- Storage limited to browser localStorage quota.
- [Other limitations.]

## Live Deployment
[URL]

## Demo Video
[URL — 1–2 minutes]
```

### 15.3 Live Deployment Checklist

- [ ] Application loads at the deployed URL.
- [ ] `/dashboard` is accessible.
- [ ] `/activities/new` is accessible on direct navigation and after refresh.
- [ ] Core activity workflow tested in production (create, view, toggle, delete).

### 15.4 Demo Video (1–2 minutes)

| Segment              | Duration | Content                                                          |
|----------------------|----------|------------------------------------------------------------------|
| Dashboard overview   | 15 sec   | Show the weekly summary and the current week label.             |
| Activity creation    | 20 sec   | Create an activity; show validation; see it appear in the list. |
| Toggle and delete    | 15 sec   | Toggle an activity complete; delete one.                        |
| Mobile responsiveness | 10 sec  | Resize browser or use DevTools to show mobile layout.           |
| Architecture callout | 20 sec   | Briefly explain one decision (e.g., feature-based folder, useActivities hook, or week boundary logic). |

---

## 16. 150-Minute Implementation Plan

> **Total: 150 minutes exactly. Times are cumulative baselines; adjust as work proceeds.**

| Phase | Duration | Cumulative | Task                                                                                         | Fallback if behind                                |
|-------|----------|------------|----------------------------------------------------------------------------------------------|---------------------------------------------------|
| 0     | 5 min    | 5 min      | **Read and scope SRS.** Decide MVP feature set. Mark which Optional features to skip.        | Skip optional features immediately.               |
| 1     | 15 min   | 20 min     | **Vite + Tailwind + Router setup.** Create project, install deps, verify Tailwind works, add router skeleton. | Use CDN Tailwind only as last resort.   |
| 2     | 10 min   | 30 min     | **Folder structure and constants.** Create feature folders, `activity.constants.js`, `STORAGE_KEY`, `generateId`. | Use flat `src/` structure if needed.  |
| 3     | 15 min   | 45 min     | **Router config + Layout.** `router.jsx` with nested routes; `DashboardLayout.jsx` with NavLink nav bar and `<Outlet />`. | Simplify to 2 routes only.            |
| 4     | 15 min   | 60 min     | **activityService + useActivities hook.** `loadActivities`, `saveActivities`, full CRUD hook. | Skip saveActivities; in-memory only.  |
| 5     | 20 min   | 80 min     | **ActivityForm + validation.** Controlled form; title/date/category; inline error display; submit handler. | Drop optional fields (notes, duration).|
| 6     | 15 min   | 95 min     | **ActivityCard + ActivityList + EmptyState.** Render list; toggle-complete button; delete button; empty state. | Remove delete button; add later.      |
| 7     | 15 min   | 110 min    | **DashboardPage + WeeklySummary.** Filter by current week; derived totals; progress bar; week label. | Skip progress bar; show counts only.  |
| 8     | 10 min   | 120 min    | **Responsive polish.** Test at 375px and 1280px. Fix overflow, padding, button sizes.         | Test desktop only; fix mobile later.  |
| 9     | 10 min   | 130 min    | **Critical tests + bug fixes.** Write TC-001–TC-013 (date utils + validation + form). Fix any blockers. | Write only utility tests (TC-001–TC-007). |
| 10    | 10 min   | 140 min    | **Build + GitHub + Deploy.** `npm run build`; push to GitHub; deploy to Vercel; add redirect config; verify live URL. | Skip tests; prioritize deployment.    |
| 11    | 10 min   | 150 min    | **README + Demo video.** Fill in all README sections; record 1–2 min screen recording.        | Write README first; record video last. |

### 16.1 Critical Path

If time is extremely short, the following subset constitutes a working, submittable MVP:

1. Vite + Tailwind + Router setup (Phase 1).
2. Router config with nested layout (Phase 3).
3. `activityService` + `useActivities` (Phase 4).
4. `ActivityForm` (Phase 5).
5. `ActivityList` + `ActivityCard` with toggle (Phase 6, partial).
6. `DashboardPage` with week filter (Phase 7, partial).
7. Build + deploy (Phase 10).
8. README (Phase 11, minimal).

### 16.2 Scope Cut Order (if behind schedule)

Cut features in this order (lowest to highest impact on brief coverage):

1. Edit activity (FR-011).
2. Week navigation (FR-014).
3. Filter by status (FR-013).
4. Duration field.
5. Notes field.
6. Delete confirmation dialog.
7. Unit tests (TC-011 through TC-015).

---

## 17. Acceptance Criteria and Definition of Done

### Pre-Submission Checklist

**Core Functionality**

- [ ] Dashboard loads at `/dashboard` with a visible week label.
- [ ] "Add Activity" navigates to the create form.
- [ ] Activity form validates empty title and shows an error message.
- [ ] Valid form submission creates an activity and redirects to the list.
- [ ] New activity appears in the list and on the dashboard.
- [ ] Toggling completion changes the status badge immediately.
- [ ] Activity data persists after a browser refresh (localStorage).
- [ ] Deleting an activity removes it from the list.
- [ ] Empty state displays when no activities exist.

**Routing**

- [ ] `/dashboard` renders `DashboardPage` inside `DashboardLayout`.
- [ ] `/activities` renders `ActivitiesPage` inside `DashboardLayout`.
- [ ] `/activities/new` renders `NewActivityPage` inside `DashboardLayout`.
- [ ] An unknown URL renders the Not Found page.
- [ ] Active nav link is visually distinguished.

**Responsive Design**

- [ ] Dashboard is usable at 375px width (no horizontal scroll).
- [ ] Dashboard is usable at 1280px width.
- [ ] All buttons and inputs have adequate tap targets on mobile.

**Persistence**

- [ ] Activity list is correct after a hard refresh.
- [ ] Malformed localStorage does not crash the app (manual test: set storage to `"bad"` via DevTools console, reload).

**Production Build**

- [ ] `npm run build` completes with 0 errors.
- [ ] `npm run preview` serves the app; all routes work.
- [ ] Deployed URL loads the application.
- [ ] Navigating to `/activities/new` directly (or after refresh) in the deployed app works.

**Repository**

- [ ] GitHub repository is public and accessible.
- [ ] `package.json`, `vite.config.js`, and all source files are committed.
- [ ] `node_modules/` and `dist/` are in `.gitignore`.
- [ ] README has all sections listed in Section 15.2.
- [ ] Demo video is 1–2 minutes and linked in the README.

**Developer Readiness**

- [ ] Can explain what `createBrowserRouter` does and why `Outlet` is used.
- [ ] Can explain how localStorage persistence is implemented and isolated.
- [ ] Can explain how the week boundary is calculated.
- [ ] Can explain how derived state (totals) differs from stored state.
- [ ] Can explain the feature-based folder structure rationale.

---

## 18. Requirements Traceability Matrix

| Brief Requirement                       | SRS Requirement(s)         | Component(s)                               | Test Case(s)        | Priority | Classification |
|-----------------------------------------|----------------------------|--------------------------------------------|---------------------|----------|----------------|
| Responsive dashboard                    | FR-001, NFR-001            | DashboardPage, DashboardLayout             | TC-016              | P0       | Explicit       |
| Track weekly interview-prep work        | FR-001, FR-008, BR-004     | WeeklySummary, WeekNavigator               | TC-001–TC-005       | P0       | Explicit       |
| Frontend only, no backend               | NFR-009, BR-010–BR-012     | activityService (localStorage)             | TC-008–TC-010       | P0       | Explicit       |
| GitHub repository                       | Section 15.1               | —                                          | Section 17 checklist | P0      | Explicit       |
| Live deployed application               | Section 14.6, Section 15.3 | vercel.json / _redirects                   | TC-017              | P0       | Explicit       |
| 1–2 minute demo video                   | Section 15.4               | —                                          | Section 17 checklist | P0      | Explicit       |
| README with setup, features, assumptions | Section 15.2              | README.md                                  | Section 17 checklist | P0      | Explicit       |
| Developer must understand implementation | NFR-008, Section 17        | All                                        | Section 17 checklist | P0      | Explicit       |
| Create activity                         | FR-002, FR-003             | ActivityForm, NewActivityPage              | TC-011–TC-013       | P0       | Inferred       |
| View activities                         | FR-004, FR-005             | ActivityList, ActivityCard, EmptyState     | TC-014              | P0       | Inferred       |
| Mark complete / incomplete              | FR-007                     | ActivityCard, useActivities                | TC-014              | P1       | Inferred       |
| Delete activity                         | FR-010                     | ActivityCard, useActivities                | —                   | P1       | Inferred       |
| Persist data                            | FR-009, BR-010–BR-013      | activityService                            | TC-008–TC-010       | P1       | Inferred       |
| Weekly summary totals                   | FR-008, BR-009             | WeeklySummary, DashboardPage               | TC-004–TC-005       | P1       | Inferred       |
| Category assignment                     | FR-012, BR-007             | ActivityForm, ActivityCard                 | TC-006–TC-007       | P1       | Inferred       |
| Edit activity                           | FR-011                     | EditActivityPage, ActivityForm             | —                   | P2       | Optional       |
| Filter by status                        | FR-013                     | ActivitiesPage                             | —                   | P2       | Optional       |
| Week navigation                         | FR-014                     | WeekNavigator                              | —                   | P2       | Optional       |

---

## 19. Risks and Trade-Offs

| Risk                                    | Likelihood | Impact | Mitigation                                                                                                |
|-----------------------------------------|------------|--------|-----------------------------------------------------------------------------------------------------------|
| **Scope creep** — adding features beyond MVP | High   | High   | Use Section 16.2 cut order. Revisit scope at each phase boundary.                                        |
| **Tailwind version confusion**          | High       | High   | Run `npm info tailwindcss version` before any setup. Follow one official guide.                           |
| **React Router API confusion** (v5 vs v6 docs) | Medium | High | Pin to installed version; use `react-router-dom` v6 docs only (`reactrouter.com`).                  |
| **Incorrect week calculations**         | Medium     | High   | Write and run TC-001–TC-005 before building dashboard features. Use local date parsing (BR-003).          |
| **localStorage breaks on refresh**      | Low        | High   | Test persistence manually immediately after implementing `activityService`.                              |
| **Route refresh 404 in production**     | Medium     | High   | Add `vercel.json` or `_redirects` before deploying. Verify after deploy.                                |
| **Overengineered folder structure**     | Medium     | Medium | Only create folders with planned files. Start with flat structure; refactor only if files grow.           |
| **Time lost to testing setup**          | Medium     | Medium | Set up Vitest last (Phase 9). If behind, write only utility tests; skip component tests.                 |
| **Incomplete README or demo video**     | Medium     | High   | Reserve Phase 11 time. Write README incrementally (not all at the end).                                  |
| **Using AI-generated code without understanding** | Medium | High | Read every generated block. Be able to explain it. The demo may include questions.                   |
| **Demo video exceeds 2 minutes**        | Low        | Low    | Rehearse once before recording. Stick to the 4-segment script (Section 15.4).                            |
| **Vercel/Netlify account not set up**   | Low        | High   | Create deployment account before starting Phase 10. This is a prerequisite.                              |

---

## 20. MVP Recommendation and Priority List

### 20.1 MVP Feature Set (Must ship in 150 minutes)

1. **Vite + React + Tailwind + Router setup** — functional dev environment.
2. **Nested route layout** — `DashboardLayout` with `NavLink` nav and `Outlet`.
3. **Activity creation form** — title, date, category; inline validation; submit saves.
4. **Activity list with status toggle** — display all activities; toggle complete.
5. **Empty state** — when no activities exist.
6. **localStorage persistence** — survives refresh.
7. **Dashboard with weekly filter and summary** — current-week activities + "X of Y completed."
8. **Mobile-responsive layout** — usable at 375px.
9. **Deployed to Vercel/Netlify** — with redirect config.
10. **README and demo video** — all required sections; 1–2 minutes.

### 20.2 Recommended Enhancements (Implement if time permits)

| Feature               | Estimated Time | Value |
|-----------------------|----------------|-------|
| Delete activity       | 10 min         | High  |
| Activity category badge | 5 min        | Medium |
| Progress bar in summary | 10 min       | Medium |
| Edit activity         | 20 min         | Medium |
| Filter by status      | 15 min         | Low   |
| Week navigation       | 20 min         | Low   |
| Unit tests            | 15 min         | Medium |

### 20.3 Do Not Implement

- Authentication or user accounts.
- Backend API or database.
- Real-time sync or multi-device support.
- Data import/export.
- Redux or global state library.
- A third-party component library (unless already pre-installed).

---

## 21. Open Clarification Questions

The following questions are not answered by the original brief. Assumptions have been documented; these are listed for transparency:

| ID    | Question                                               | Assumption Made                                   |
|-------|--------------------------------------------------------|---------------------------------------------------|
| CQ-01 | Does the week start on Monday or Sunday?               | **Monday** (most common in professional contexts). |
| CQ-02 | Should past weeks' activities be viewable?             | Stored but not displayed by default in MVP.        |
| CQ-03 | Is there a maximum number of activities per week?      | No limit enforced in MVP.                          |
| CQ-04 | Should activities from future dates be allowed?        | Yes; no future-date restriction in MVP.            |
| CQ-05 | Is a confirmation dialog required before deletion?     | Optional; not required for MVP.                    |
| CQ-06 | Should the duration field be visible in the MVP?       | No; optional enhancement only.                    |
| CQ-07 | Is the demo video publicly accessible or private?      | Assumed public (YouTube unlisted or Loom link).   |
| CQ-08 | Which deployment platform is preferred?                | Vercel recommended; Netlify as alternative.        |

---

*End of SRS — Interview Practice Tracker v1.0.0*

*This document was designed to serve as a complete, stand-alone build specification for a 150-minute machine-coding round. Every section is intended to be actionable, not aspirational.*
