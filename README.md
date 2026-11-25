# Project Assistant: frontend

The multi-company website and apps (Next.js 13 pages router + Tailwind). Every company that signs up gets a private workspace
shown with its own name and logo (set on **Company Settings**). It is a **separate project**: it talks to one
thing only, the API, over HTTP. It never connects to a database or to the BOQ service directly.

## Run it

    npm install
    copy .env.local.example .env.local      # macOS/Linux: cp .env.local.example .env.local   (set the API address)
    npm run dev                             # http://localhost:3000

`NEXT_PUBLIC_API_URL` is the only setting. The API must allow this site's address in its `CORS_ORIGINS`.
Production: `npm run build && npm start`, or deploy to any host that runs Next.js (Netlify, Vercel...).

## Pages

| Area | Pages |
|---|---|
| Public site | `/` (neutral landing page: sign in or create a company account) |
| Accounts | `/pm/login` (sign in, create account), `/pm/reset`, `/pm/team` (password, and admin user management) |
| Project manager | `/pm` dashboard, `/pm/projects` and `/pm/projects/:id` (one page per project), tasks, **schedule (MS Project style Gantt)**, budget, site logs, issues, documents, summary |
| Material sourcing | `/pm/sourcing`, `/pm/suppliers`, `/pm/calculator`, `/pm/contribute` (suggest additions) |
| BOQ | `/boq` (your drawings are saved to your account: list, open, download, try again, delete) |
| Business | `/pm/tenders`: search tenders, a pipeline with value in UGX and totals, **assign a task to a project manager (general project manager copied)**, and My assignments |
| Admin | `/pm/roles` (create roles and choose their rights), `/pm/team` (create accounts with a role), `/pm/company` (company name and logo), `/pm/approvals`, `/pm/audit`, `/pm/billing` (placeholder) |

## How it is organised

    lib/pm.js            the ONLY place that calls the API (api(), useApi(), usePM(), session, can())
    lib/boqApi.js        BOQ calls (also through the API)
    lib/csv.js           CSV export helper     lib/dates.js   date helpers
    components/pm/       reusable building blocks:
        ui.jsx           Shell (sidebar, rights-aware menu), Card, Panel, Field, Select, Form, Table...
        ResourcePage     one config-driven list page: search, sort, CSV, add, edit, delete  (projects, tasks, costs, logs, issues)
        DataTable        the list itself            EditDialog   edit one record
        ProjectSummary   the project report         FilesPanel   documents of a project
        LocationPick     region + district picker
        Gantt, TaskEditor  the schedule chart and the task/links dialog
        PasswordField    password box with Show/Hide and "make a strong password"
        MusicPlayer      the "Play music" button in the header (set NEXT_PUBLIC_MUSIC_URL; use https:// on an https site)
    pages/               thin: each page is configuration plus these components

## Rights

The menu and buttons follow `user.permissions` from `GET /api/me` (`can(user, "catalog:write")`). The website never decides who may do what;
the API enforces every right and this only hides what you cannot use. To change rights, edit the API's `src/auth/permissions.js`.

## Add a list page in a few lines

    // pages/pm/mylist.jsx  (after adding the resource to the API)
    <ResourcePage resource="costs" title="My list" fields={({ d, projectId }) => [...]} columns={({ nameOf }) => [...]} searchKeys={["item"]} />

## Not tested in a browser here

The code passes syntax and undefined-name checks. Run `npm run dev` and click through each page once after installing.

## Branding

No company name or logo is hard-coded. Signed out, the site shows the product name (`PRODUCT` in `lib/pm.js`).
Signed in, the header, sidebar, footer and browser tab show the company from `GET /api/me` (`organization.name`, `organization.logo_url`);
`components/Brand.jsx` draws the logo, or the company's initials until an admin uploads one.
