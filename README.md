# Google Forms Lite - https://googlecloneq.netlify.app/

A simplified Google Forms clone built with a **monorepo** structure using pnpm workspaces.

## Features

- Create, edit, delete forms with title, description, and questions
- Supported question types: Text, Date, Radio, Checkbox
- Fill forms with validation for required questions
- Submit responses and calculate scores (if applicable)
- View responses per form
- Clean UI with TailwindCSS
- Monorepo with shared scripts for client & server

---

## Tech Stack

### Frontend (client)

- React 18
- TypeScript
- Redux Toolkit & RTK Query
- React Router DOM
- TailwindCSS
- Vite

### Backend (server)

- Node.js
- Express
- GraphQL with express-graphql
- In-memory storage (no database required for test task)

### Tooling

- pnpm (workspaces, monorepo management)
- nodemon (dev backend)
- concurrently (run client & server together)

---

## Why pnpm?

This project uses **pnpm** instead of npm or yarn mainly because:

- **Best support for monorepos** — built-in workspace management, no extra tools needed.
- Much faster installs (clever package store, hard links).
- Saves disk space (no duplicate copies of the same packages).

👉 You _could_ run it with npm/yarn, but all scripts here are tested with pnpm.

---

## Project Structure

```
google-forms-lite/
├── package.json           # root config (workspaces)
├── pnpm-lock.yaml
├── client/                # frontend (React + Vite + TS)
│   ├── package.json
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── services/
│       ├── app/
│       └── main.tsx
└── server/                # backend (Express + GraphQL)
    ├── package.json
    └── src/
        ├── index.js
        ├── schema.js
        ├── resolvers.js
        └── data.js
```

---

## Environment variables (`.env`)

### Backend (`server/.env`)

The backend uses [`dotenv`](https://www.npmjs.com/package/dotenv).  
Create a `.env` file inside `server/`:

```env
PORT=4000
```

- `PORT` — the port where Express + GraphQL server will run.

The server reads it in `src/index.js`:

```js
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;
```

### Frontend (`client/.env`)

The frontend is built with **Vite**, so all variables must start with `VITE_`.  
Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:4000/graphql
```

- `VITE_API_URL` — URL of your backend GraphQL API.
- In production you will change it, for example:
  ```env
  VITE_API_URL=https://backend.up.railway.app/graphql
  ```

Usage in code (`formsApi.ts`):

```ts
const baseUrl = import.meta.env.VITE_API_URL;
```

---

## Getting Started

### 1. Install pnpm

If you don’t have pnpm:

```bash
npm install -g pnpm
```

### 2. Install dependencies

At the root of the project:

```bash
pnpm install
```

### 3. Run backend

```bash
cd server
pnpm dev
```

Backend will run at [http://localhost:4000/graphql](http://localhost:4000/graphql).

### 4. Run frontend

```bash
cd client
pnpm dev
```

Frontend will run at [http://localhost:5173](http://localhost:5173).

### 5. Run both (from root)

```bash
pnpm dev
```

This uses `concurrently` to start both client and server.

---

## GraphQL Examples

### Query all forms

```graphql
query {
  forms {
    id
    title
    description
  }
}
```

### Create a form

```graphql
mutation {
  createForm(input: { title: "Sample Form", description: "Hello World" }) {
    id
    title
  }
}
```

### Submit a response

```graphql
mutation {
  submitResponse(
    formId: "1"
    answers: [{ questionId: "1", value: "My Answer" }]
  ) {
    id
    answers {
      questionId
      value
    }
  }
}
```
