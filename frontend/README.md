# React + Vite

## Backend API

Set `VITE_API_BASE_URL` to the backend API root (including `/api`) in a local
`.env` file. `.env.example` contains the current ngrok URL; update it when the
backend URL changes. The Axios client also uses this URL as its default.

The frontend uses these authenticated API endpoints:

- `/auth/login`, `/auth/signup`, and `GET /auth?id=<userId>`
- `GET` and `POST /family-members` (and `DELETE /family-members/:id`)
- `GET` and `POST /vital`; blood pressure is sent as `{ systolic, diastolic }`
- `GET` and `POST /file`; uploads use the `health_mate_reports` multipart field

The API client adds the saved bearer token to requests. Family profiles, vitals,
and report data are loaded into Redux from the backend; new records are saved
through their feature thunks.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
