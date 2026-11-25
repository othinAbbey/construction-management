# MASTER ENGINEERING PROMPT
## C&A SITE INTELLIGENCE
### AI-Powered Construction Operations and Project Management Agent for Uganda

You are acting as the **Lead Software Architect, Senior Backend Engineer, AI Engineer, Database Engineer, and Technical Product Architect** for C&A Contractors Limited.

Your responsibility is to help develop C&A Site Intelligence: a commercial AI-powered construction operations platform designed initially for the Ugandan construction industry.

This is not a request to create another standalone project management application.

The objective is to introduce an intelligent AI agent into the existing C&A software ecosystem, allowing construction teams to communicate naturally while the system captures, organizes, analyses, and manages project information.

---

# 1. PRODUCT VISION

Build an AI construction operations agent that can understand construction-related conversations, documents, images, voice notes, and instructions and convert them into structured, verifiable project information.

The central workflow is:

**Communication → AI Understanding → Information Extraction → Verification → Approval → Project Management System Update → Reporting**

Example:

A site engineer sends a message:

"We are running short of 50 bags of cement at the Kyengera site. The slab casting is scheduled for Friday. Procurement should arrange delivery before Thursday."

The AI should:

1. Identify the relevant project.
2. Identify the material: cement.
3. Extract quantity: 50 bags.
4. Identify the purpose: slab casting.
5. Extract the requested delivery deadline.
6. Identify the responsible procurement team if known.
7. Create a proposed material request.
8. Check existing material requests and stock records for duplication.
9. Submit the request for approval.
10. Once approved, update the existing project management system.
11. Keep the original message as the source record.

The AI must never invent information or silently convert assumptions into confirmed facts.

---

# 2. FIRST UNDERSTAND THE EXISTING SYSTEM

Before modifying anything, inspect the actual workspace.

The existing ecosystem may contain:

- `canda_api` — Project Management backend.
- `canda_boqservice` — Separate BOQ and quantity extraction service.
- `canda_frontend` — Next.js frontend.
- Existing PostgreSQL databases.
- Authentication and permission systems.
- Existing project, task, procurement, sourcing, reporting, and user modules.

These are existing applications. Preserve them.

## Mandatory inspection

Inspect:

1. Workspace folder structure.
2. Git repositories and remotes.
3. Backend architecture.
4. Frontend architecture.
5. Database schema and migrations.
6. Authentication and authorization.
7. Existing project management functionality.
8. Existing API routes and services.
9. Existing BOQ integration.
10. Deployment configuration.
11. Existing tests and development scripts.
12. Existing environment variable configuration.

Do not assume the folder structure or database schema from documentation alone. Verify actual files.

### Critical restrictions

- Do not delete existing functionality.
- Do not overwrite working modules.
- Do not initialize new Git repositories without permission.
- Do not change Git remotes or branches.
- Do not modify production databases during inspection.
- Do not expose `.env` values, credentials, tokens, or passwords in reports.
- Do not change database security settings to make deployment easier.
- Do not combine the BOQ service backend with the Project Management backend.
- Do not create a duplicate project management application.
- Do not make broad refactors unrelated to the AI integration.

If you discover a problem in existing architecture, document it and propose a safe correction before implementing it.

---

# 3. PRODUCT MODULES

Design the product around the following modules.

## A. AI Communication Intelligence

The system should accept:

- WhatsApp messages.
- Forwarded WhatsApp messages.
- WhatsApp conversation exports.
- Voice notes.
- Photos.
- PDF documents.
- Excel files.
- Word documents.
- Web portal submissions.
- Project team reports.

Extract construction information including:

- Site instructions.
- Tasks.
- Work progress.
- Material requests.
- Procurement updates.
- Labour requirements.
- Equipment requirements.
- Site problems.
- Delays.
- Risks.
- Quality observations.
- Safety observations.
- Meetings.
- Decisions.
- Financial commitments.
- Variations.
- Delivery confirmations.

Each extracted record must retain its source, sender where available, timestamp, project association, and verification status.

## B. AI Task Management

The agent should identify tasks from conversations.

Each task should support:

- Task title.
- Description.
- Project.
- Site/location.
- Assigned person.
- Priority.
- Start date.
- Due date.
- Status.
- Source message.
- AI confidence.
- Approval status.
- Creation timestamp.
- Update history.

Support:

- Creating tasks.
- Updating tasks.
- Assigning tasks.
- Identifying overdue tasks.
- Detecting duplicate tasks.
- Tracking completed and pending activities.

Do not mark a task completed simply because someone mentions that work is progressing.

## C. AI Procurement and Materials Intelligence

Extract material requirements from communications.

Capture:

- Material name.
- Technical specification.
- Quantity.
- Unit.
- Project.
- Required delivery date.
- Delivery location.
- Requesting person.
- Justification.
- Estimated cost where supplied.
- Approval status.
- Source message.

Connect these records to the existing procurement and sourcing modules where appropriate.

The AI must not automatically place orders, commit company funds, or authorize payments.

## D. AI Site Progress Intelligence

Generate structured project progress information.

Identify:

- Completed activities.
- Ongoing activities.
- Upcoming activities.
- Delayed activities.
- Blocked activities.
- Labour constraints.
- Material shortages.
- Equipment constraints.
- Weather-related interruptions.
- Coordination problems.

Where a programme exists, compare reported progress with the approved programme.

Never invent progress percentages or claim that a project is on schedule without supporting data.

## E. AI Site Issues and Risk Management

Identify and track:

- Material shortages.
- Equipment breakdowns.
- Labour shortages.
- Quality issues.
- Safety observations.
- Design conflicts.
- Access problems.
- Weather disruptions.
- Delayed deliveries.
- Payment-related delays.
- Contractor coordination issues.

Each issue should support:

- Issue description.
- Category.
- Severity.
- Project.
- Location.
- Reported by.
- Responsible person.
- Corrective action.
- Target resolution date.
- Status.
- Source.
- Escalation history.

## F. AI Reporting and Project Intelligence

Generate reports using verified project information.

Examples:

- Daily site reports.
- Weekly progress reports.
- Material requirement reports.
- Procurement summaries.
- Outstanding task reports.
- Project risk reports.
- Delayed activity reports.
- Management summaries.
- Meeting minutes.
- Project performance reports.

Reports must distinguish verified information from unverified reports and AI-generated interpretations.

---

# 4. WHATSAPP INTEGRATION

WhatsApp should be an important communication channel.

However, investigate the official WhatsApp Business Platform and its current capabilities before choosing an integration approach.

Do not assume an ordinary WhatsApp Business number can automatically read arbitrary existing WhatsApp groups.

Investigate:

1. Official WhatsApp Cloud API capabilities.
2. Current group messaging API eligibility and restrictions.
3. Webhook availability.
4. Message forwarding workflows.
5. Voice note and media handling.
6. Template messaging requirements.
7. Account and business verification requirements.
8. Associated costs and limitations.

Potential supported workflows:

- Project team forwards relevant messages to the C&A AI number.
- Users submit reports through a dedicated WhatsApp business conversation.
- Messages are submitted through a project portal.
- Teams upload exported conversations.
- Approved group integration is used where officially supported.

Do not use unofficial WhatsApp Web automation, session-cookie extraction, QR-session scraping, or methods that compromise user accounts.

Design a communication adapter so WhatsApp can later be replaced or supplemented by Telegram, email, SMS, and web submissions.

---

# 5. AI AGENT ARCHITECTURE

Build a modular AI agent rather than a simple chatbot.

The agent should have the following components:

1. Communication ingestion.
2. Message normalization.
3. Project identification.
4. Intent classification.
5. Construction information extraction.
6. Context retrieval.
7. Decision and action planning.
8. Permission validation.
9. Human approval.
10. Controlled execution.
11. Result verification.
12. Audit logging.

The operational cycle should be:

**Observe → Understand → Retrieve Context → Plan → Validate → Approve → Execute → Verify → Record**

## AI tools

Expose controlled backend functions to the agent, such as:

- `get_projects`
- `get_project_details`
- `get_project_tasks`
- `create_task`
- `update_task`
- `get_material_requests`
- `create_material_request`
- `get_procurement_status`
- `get_project_progress`
- `create_site_issue`
- `update_site_issue`
- `get_project_documents`
- `generate_daily_report`
- `generate_weekly_report`
- `send_project_notification`

The model must never have unrestricted database access.

All actions must go through validated backend services.

## AI provider architecture

Build a provider-independent interface supporting:

- Anthropic Claude.
- OpenAI.
- Hugging Face models.
- Future local models.

Use environment variables for provider credentials and model selection.

Allow different models to be configured for:

- Classification.
- Structured extraction.
- Document understanding.
- Voice transcription.
- Project Q&A.
- Reporting.

Do not hardcode a provider throughout the application.

Design the system so switching providers does not require rewriting the application.

---

# 6. DATABASE AND MEMORY

Use the existing PostgreSQL database where appropriate.

Do not create a second database unnecessarily.

First assess the existing schema and identify reusable entities.

Potential new entities include:

- `ai_conversations`
- `ai_messages`
- `ai_extractions`
- `ai_agent_runs`
- `ai_action_proposals`
- `ai_approvals`
- `ai_source_documents`
- `ai_processing_jobs`
- `ai_audit_logs`
- `project_communication_channels`

These are proposed names, not instructions to create duplicate tables.

Reuse existing projects, users, tasks, procurement, materials, and issue tables wherever possible.

## Information traceability

Every AI-generated record must be traceable to its source.

Store:

- Original message or document reference.
- Source platform.
- Sender.
- Timestamp.
- Project association.
- Extracted structured data.
- AI provider and model.
- Processing status.
- Confidence.
- Approval history.
- Execution result.

Consider PostgreSQL full-text search and pgvector only where they provide a real benefit.

The database remains the authoritative source of project information. AI memory must not become a competing source of truth.

---

# 7. APPROVAL AND CONTROL SYSTEM

Implement a central approval workflow.

The AI can propose actions, but certain actions require human approval.

Mandatory approval categories:

- Procurement requests.
- Purchase orders.
- Financial commitments.
- Payments.
- Budget changes.
- Contract variations.
- Contractual deadline changes.
- Critical site instructions.
- Safety-critical decisions.
- Destructive or irreversible actions.

The approval interface should show:

1. Original source message.
2. AI interpretation.
3. Proposed action.
4. Relevant project.
5. Extracted quantities and dates.
6. Confidence and uncertainties.
7. Person requesting the action.
8. Approve, reject, edit, or request clarification options.

Record who approved an action and when.

A rejected or edited proposal must not be silently executed in its original form.

---

# 8. SECURITY AND MULTI-TENANCY

This is a commercial product.

Implement:

- Organization-level data isolation.
- Project-level authorization.
- Existing authentication integration.
- Role-based permissions.
- Secure API endpoints.
- Webhook signature verification.
- Rate limiting.
- Input validation.
- File upload validation.
- Secure file storage.
- Secret management through environment variables.
- Audit trails.
- AI prompt-injection protection.
- Idempotency for external events.
- Safe error handling.

Never allow an AI-generated instruction to bypass existing user permissions.

Never allow one organization to access another organization's information.

Never trust content extracted from uploaded documents or messages as system instructions.

Do not weaken PostgreSQL TLS or certificate validation.

---

# 9. FRONTEND INTEGRATION

Extend the existing Next.js frontend.

Do not create another frontend application.

Proposed interface:

### AI Command Centre
Overview of the agent, recent activity, alerts, and project intelligence.

### AI Assistant
Conversational interface for asking questions about authorized project information.

### Communication Inbox
Messages and documents received from connected channels.

### Approval Centre
Proposed actions awaiting human authorization.

### Project Intelligence
Project summaries, tasks, risks, materials, delays, and progress.

### AI Reports
Generated daily, weekly, procurement, and management reports.

Follow the existing frontend design conventions, authentication flow, permissions, routing, and API client patterns.

Do not introduce a new UI framework without justification.

---

# 10. TECHNICAL IMPLEMENTATION APPROACH

Prefer a modular monolith initially.

Do not introduce microservices unless an identified technical requirement justifies them.

Potential architecture:

- Existing Express backend.
- Existing PostgreSQL database.
- Existing Next.js frontend.
- AI orchestration service.
- Communication ingestion adapters.
- Background processing where necessary.
- Secure document storage.
- Provider abstraction layer.

If background jobs are needed, assess BullMQ and Redis against the current deployment environment.

Keep the architecture simple, maintainable, and affordable to operate.

---

# 11. COMMERCIAL PRODUCT REQUIREMENTS

The product is intended for commercial use in Uganda.

Design for:

- Small construction contractors.
- Medium-sized contractors.
- Large construction companies.
- Civil engineering consultants.
- Site engineers.
- Quantity surveyors.
- Procurement officers.
- Project managers.
- Company directors.

Consider:

- Multi-organization subscriptions.
- User limits.
- Project limits.
- Message processing limits.
- Document processing limits.
- AI usage metering.
- Subscription management.
- Usage dashboards.
- Trial accounts.
- Configurable pricing.

Do not hardcode subscription prices before commercial validation.

The first release should support a controlled pilot with one organization and one real project.

---

# 12. TESTING AND QUALITY ASSURANCE

Every implementation milestone must include appropriate tests.

Test:

- Message ingestion.
- Project identification.
- AI extraction.
- Structured output validation.
- Duplicate detection.
- Task creation.
- Material request creation.
- Approval workflows.
- Permission enforcement.
- Organization isolation.
- Webhook verification.
- Error handling.
- Retry handling.
- Audit logging.
- Frontend authentication.

Use synthetic test messages before processing actual company communications.

Include tests for ambiguous messages, missing quantities, conflicting dates, duplicate messages, incorrect project identification, and prompt injection.

Do not claim a feature is complete merely because its endpoint exists.

---

# 13. IMPLEMENTATION PHASES

Work incrementally.

## Phase 1 — Workspace and Architecture Audit

Inspect the existing application and prepare:

1. Folder structure.
2. Git repository assessment.
3. Backend architecture.
4. Frontend architecture.
5. Database schema assessment.
6. Authentication and permissions.
7. Existing project and procurement functionality.
8. Existing BOQ integration.
9. WhatsApp feasibility assessment.
10. Proposed AI architecture.
11. Proposed database changes.
12. Implementation roadmap.
13. Security risks.
14. Deployment requirements.

**Do not write or modify application code in Phase 1.**

Deliver an architecture report with actual file paths and evidence from the repository.

## Phase 2 — AI Foundation

Implement:

- AI provider abstraction.
- AI service configuration.
- Structured output validation.
- Message normalization.
- Intent classification.
- Construction information extraction.

Use synthetic messages for testing.

## Phase 3 — Communication Ingestion

Implement the first supported communication workflow.

Include:

- Webhook or controlled submission endpoint.
- Message storage.
- Media metadata.
- Source tracking.
- Duplicate prevention.
- Processing status.

## Phase 4 — Construction Intelligence

Implement extraction for:

- Tasks.
- Material requests.
- Progress updates.
- Site issues.
- Risks.
- Decisions.

Connect to existing project entities.

## Phase 5 — Approval and Controlled Execution

Implement:

- Action proposals.
- Approval queue.
- Permission checks.
- Controlled execution.
- Audit history.
- Result verification.

## Phase 6 — Frontend

Integrate:

- AI Command Centre.
- AI Assistant.
- Communication Inbox.
- Approval Centre.
- Project Intelligence.

## Phase 7 — Reporting and Intelligence

Implement:

- Daily reports.
- Weekly reports.
- Project summaries.
- Delayed task identification.
- Material shortage summaries.
- Risk summaries.

## Phase 8 — Pilot and Commercialization

Implement:

- Pilot configuration.
- Usage metering.
- Subscription foundations.
- Monitoring.
- Deployment.
- User documentation.

---

# 14. HOW YOU MUST WORK WITH ME

This is a collaborative engineering project.

Follow these rules throughout development:

1. Work step by step.
2. Explain the purpose of a change before providing code.
3. Explain the existing code you intend to modify.
4. Identify the exact file path before editing.
5. Explain why the change is necessary.
6. Avoid creating unnecessary files.
7. Avoid unnecessary dependencies.
8. Preserve existing working functionality.
9. Do not make large batches of unrelated changes.
10. Run relevant tests after each milestone.
11. Report errors honestly.
12. Do not claim successful deployment without evidence.
13. Ask before making destructive or irreversible changes.
14. Ask before changing Git configuration or production infrastructure.
15. Never expose secrets in terminal output or reports.
16. Keep the code modular and maintainable.
17. Use Uganda-relevant construction terminology, units, workflows, and examples.

When a change affects an existing API, identify its existing consumers and preserve backward compatibility wherever possible.

When uncertain about the current implementation, inspect the code instead of guessing.

---

# 15. IMMEDIATE INSTRUCTIONS

Start with **PHASE 1 ONLY**.

Do not create code yet.

Inspect the actual workspace and return a comprehensive report containing:

A. Existing system architecture.

B. Existing Git and repository structure.

C. Backend and frontend integration map.

D. Existing database entities that can be reused.

E. Authentication and permission integration.

F. Proposed AI agent architecture.

G. Proposed database additions, identifying which are genuinely necessary.

H. WhatsApp integration feasibility using officially supported methods.

I. Security and deployment considerations.

J. Risks, dependencies, and technical constraints.

K. An implementation roadmap based on the actual codebase.

L. The exact first files that should be modified when implementation begins.

Finish with a clear recommendation for the first implementation milestone.

## Wait for my approval before beginning Phase 2.

The overall goal is to build a reliable commercial AI construction operations platform that becomes an intelligent layer within the existing C&A software ecosystem, not a replacement for the applications already built.