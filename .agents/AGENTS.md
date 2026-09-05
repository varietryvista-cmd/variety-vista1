# Variety Vista — Core Agent Rules & Standards

The following 5 core skills and operating rules are mandatory and must be strictly adhered to across all tasks, planning, and development in this project.

---

## 1. AI Agents Architect (`@ai-agents-architect` / `@architect`)
- **Think Before Building**: Decompose complex requirements into structured implementation steps, align on terminology, and evaluate dependencies before writing code.
- **Graceful Failure & Controllability**: Design tools and system workflows with explicit boundaries, actionable logging, and clear failure modes.
- **Controlled Autonomy**: Balance proactive problem-solving with transparent checkpoints when making major architectural or irreversible decisions.

---

## 2. AWS & Security Best Practices (`@aws-iam-best-practices`)
- **Principle of Least Privilege**: Grant only the minimum permissions, scopes, and database access required for a given service, role, or query.
- **Zero Secrets Exposure**: Never log, hardcode, or persist sensitive credentials, API keys, service role secrets, or tokens in git repositories, documentation, or client-side bundles.
- **Defense in Depth**: Enforce role-based access control (RBAC), Row Level Security (RLS) on database tables, and robust validation on all API endpoints.

---

## 3. Independently Recoverable Step Execution (`@autonomous-agents` / `@recover`)
- **Atomic, Testable Steps**: Structure work into discrete, independently verifiable units of change.
- **Fast Failure & Safe Rollback**: When a failure or regression occurs, diagnose the exact failure category before acting:
  - *Targeted Fix*: For isolated errors with clear cause.
  - *Rollback / Hard Reset*: Revert corrupted state immediately before compounding errors.
  - *Full Rethink*: Re-evaluate approach if fundamental assumptions were invalid.
- **Prevent Error Compounding**: Never build on top of unverified or broken intermediate steps.

---

## 4. Context Preservation & Memory (`@remember` / `@crewai`)
- **Preserve Essential State**: Retain architectural decisions, resolved edge cases, and active state across sessions and turns.
- **Continuity Without Drift**: Maintain consistent design patterns, data contracts, and component APIs across features.
- **Sanitized Retention**: Ensure memory artifacts and handover notes preserve context while strictly excluding sensitive credentials and secrets.

---

## 5. Post-Review & Contract Verification (`@atlas-contract` / `@review`)
- **Post-Implementation Audit**: Always verify the completed feature against the original requirements, architectural plan, and design standards.
- **Verification Gates**: Validate code with static typing, linting (`npm run lint`), build checks (`npm run build`), and automated/manual testing before marking tasks as complete.
- **Explicit Deviation Reporting**: Clearly highlight any necessary trade-offs, deviations, or follow-up items.
