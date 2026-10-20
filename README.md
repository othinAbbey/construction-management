# canda-frontend

The C & A Contractors website and apps (Next.js 13 pages router + Tailwind). It is a **separate project**: it talks to one
thing only, the C & A API (`canda-api`), over HTTP. It never connects to a database or to the BOQ service directly.

## Run it

    npm install
    copy .env.local.example .env.local      # macOS/Linux: cp .env.local.example .env.local   (set the API address)
    npm run dev                             # http://localhost:3000

`NEXT_PUBLIC_API_URL` is the only setting. The API must allow this site's address in its `CORS_ORIGINS`.
Production: `npm run build && npm start`, or deploy to any host that runs Next.js (Netlify, Vercel...).

## Pages

| Area | Pages |
|---|---|
| Public site | `/`, `/about`, `/services`, `/gallery`, `/contact` (messages go to the API inbox) |
| Accounts | `/pm/login` (sign in, create account), `/pm/reset`, `/pm/team` (password, and admin user management) |
| Project manager | `/pm` dashboard, `/pm/projects` and `/pm/projects/:id` (one page per project), tasks, schedule, budget, site logs, issues, documents, summary |
| Material sourcing | `/pm/sourcing`, `/pm/suppliers`, `/pm/calculator`, `/pm/contribute` (suggest additions) |
| BOQ | `/boq` (your own jobs, saved to your account) |
| Admin | `/pm/approvals`, `/pm/audit`, `/pm/inbox`, `/pm/billing` (placeholder) |

## How it is organised

    lib/pm.js            the ONLY place that calls the API (api(), useApi(), usePM(), session, can())
    lib/boqApi.js        BOQ calls (also through the API)
    lib/csv.js           CSV export helper
    components/pm/       reusable building blocks:
        ui.jsx           Shell (sidebar, rights-aware menu), Card, Panel, Field, Select, Form, Table...
        ResourcePage     one config-driven list page: search, sort, CSV, add, edit, delete  (projects, tasks, costs, logs, issues)
        DataTable        the list itself            EditDialog   edit one record
        ProjectSummary   the project report         FilesPanel   documents of a project
        LocationPick     region + district picker
    pages/               thin: each page is configuration plus these components
    legacy/              the original prototype screens, kept for reference (not built)

## Rights

The menu and buttons follow `user.permissions` from `GET /api/me` (`can(user, "catalog:write")`). The website never decides who may do what;
the API enforces every right and this only hides what you cannot use. To change rights, edit the API's `src/auth/permissions.js`.

## Add a list page in a few lines

    // pages/pm/mylist.jsx  (after adding the resource to the API)
    <ResourcePage resource="costs" title="My list" fields={({ d, projectId }) => [...]} columns={({ nameOf }) => [...]} searchKeys={["item"]} />

## Not tested in a browser here

The code passes syntax and undefined-name checks. Run `npm run dev` and click through each page once after installing.
