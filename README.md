# Taxmaro Frontend Assessment

## 🧱 Overview

A **multi-tab form** to manage **personal**, **bank**, **tax**, and **insurance** data.  
Each tab validates its fields and submits only the relevant data to `/api/me` (`PUT`).

Data is initially fetched from `/api/me` (`GET`) and synced with local reactive state via composables.

---

## ⚙️ Tech Stack

- **Nuxt 3** (Vue 3, Composition API)
- **Vuetify 3** (UI components)
- **TypeScript**
- **Vitest + Vue Test Utils** (unit testing)
- **Zod** (server-side validation)
- **Custom client-side validation utils**
- **Global Snackbar System** (Vuetify + composable)

---

## 🧩 Architecture Highlights

### 🧠 Data Flow
- `useMe()` composable handles both `GET` and `PUT /api/me`.
- Each form (Personal, Bank, Tax, Insurance) updates only its own subset of fields.
- The global state auto-refreshes after every successful update.

### ✅ Validation
- Reusable validation rules from `utils/validation.ts`:
  - `required`, `email`, `postalLite`, `phoneLite`, `minLen`, `combine`, etc.
- Conditional field logic:
  - `taxId` required only if `noTaxId` is false.
  - `ssn` required only if `noSsn` is false.
- Matches the backend Zod schema (`server/api/me.ts`) for consistency.

### 🔔 Notifications
- Centralized notification system using **Vuetify Snackbar** + `useSnackbar()` composable.
- Supports:
  - `notify.success()`
  - `notify.error()`
  - `notify.info()`
  - `notify.warning()`
- Provides unified and testable UX feedback for all form submissions.

### 🧪 Testing
- Tests implemented with **Vitest + Vue Test Utils**.
- Each form component tested for:
  - Validation rules
  - Submit behavior (valid vs invalid)
  - Snackbar feedback triggers
- `$fetch` calls mocked for isolated logic testing.

To generate coverage:
pnpm test -- --coverage


## 🚀 Run Locally
```bash
pnpm install
pnpm dev

app/
 ├─ components/
 │   ├─ PersonalForm.vue
 │   ├─ BankForm.vue
 │   ├─ TaxForm.vue
 │   ├─ InsuranceForm.vue
 │   ├─ ui/BaseTabs.vue
 │   └─ GlobalSnackbar.vue
 ├─ composables/
 │   ├─ useMe.ts
 │   └─ useSnackbar.ts
 ├─ utils/validation.ts
 ├─ pages/personal-data/[tab].vue
 └─ types/me.ts

tests/
 ├─ unit/component/*.test.ts
 ├─ unit/composables/*.test.ts
 └─ helpers/
     ├─ mountWithVuetify.ts
     └─ vForm-stub.ts
