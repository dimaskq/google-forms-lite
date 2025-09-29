# Google Forms Lite

A simplified clone of Google Forms.  
This project is organized as a **monorepo** using `pnpm workspaces`.  
Both frontend and backend live in the same repository.

---

## Features

- Form creation:
  - Title and description
  - Question types: `TEXT`, `DATE`, `RADIO`, `CHECKBOX`
  - Ability to set correct answers and points
  - Option to show score after submission
- Edit existing forms
- Delete forms
- Fill out a form:
  - Validation (cannot submit until all questions are answered)
  - Highlight and scroll to the first unanswered question
  - Score calculation and result display
- View responses:
  - List of all responses
  - Score for each response (`score / maxScore`)
  - Answers per question
- Clean UI built with **Tailwind CSS**
- Structured codebase: pages → components (FormCard, QuestionList, FormQuestion, ResponseItem, ScoreCard, EmptyState)

---

## Tech Stack

### Frontend

- **React**
- **TypeScript**
- **Redux Toolkit + RTK Query**
- **React Router**
- **Tailwind CSS**
- Components split by responsibility:
  - `components/common` — base components (Button, Input, etc.)
  - `components/layout` — Container, PageTitle
  - `components/form` — form-specific UI

### Backend

- **Node.js + Express**
- **express-graphql**
- **GraphQL** (schema + resolvers)
- In-memory storage (forms, questions, and responses stored in arrays)

---

## Project Structure

```
google-forms-lite/
├── client/           # frontend (React + TS)
│   ├── src/
│   │   ├── pages/    # pages (HomePage, NewFormPage, EditFormPage, FillFormPage, ResponsesPage)
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── form/
│   │   ├── services/ # RTK Query API
│   │   └── app/      # Redux store
│   └── package.json
│
├── server/           # backend (Node.js + GraphQL)
│   ├── index.js
│   ├── schema.js
│   ├── resolvers.js
│   └── data.js
│
├── package.json      # root, with workspaces
└── pnpm-workspace.yaml
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dimaskq/google-forms-lite.git
cd google-forms-lite
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Run everything together from the root

You can start both frontend and backend simultaneously:

```bash
pnpm dev
```

Frontend will run at [http://localhost:5173](http://localhost:5173)
