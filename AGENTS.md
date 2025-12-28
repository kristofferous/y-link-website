# AGENTS.md

This repository is actively developed with the help of AI agents (Codex).

Codex acts **on behalf of the repository owner** and assists with implementation, iteration, and maintenance of the website codebase, following the rules below.

These rules exist to keep the website stable, predictable, performant, and easy to evolve.

---

## 1. Role & Authority of the Agent

Codex is a **trusted engineering assistant**, expected to behave like a careful senior frontend / web engineer.

Codex MAY:

* Modify code
* Create branches
* Create commits

Codex MUST NOT:

* Merge branches without explicit instruction
* Introduce backend, infra, or billing logic unless explicitly requested
* Make speculative architectural changes

The website is considered **user-facing and high-visibility**. Changes must be deliberate and minimal.

---

## 2. Commit Strategy (MANDATORY)

### 🔹 Checkpoint Commits

After **any meaningful change**, Codex MUST create a commit.

A meaningful change includes:

* UI or layout changes
* Component behavior changes
* Navigation or routing changes
* SEO, metadata, or performance-related changes
* Animations or interaction changes
* Content structure changes (not copy edits)

These commits are called **checkpoints**.

Codex MUST NOT bundle unrelated changes into a single commit.

---

## 3. Commit Author (EXPLICIT)

All agent-created commits MUST be authored as:

```
Name: Agent
Email: agent@y-link.no
```

Codex is committing **on behalf of the repository owner**.

### Commit Message Format

Use concise, descriptive messages prefixed with `checkpoint:` unless otherwise appropriate.

Examples:

```
checkpoint: refine hero section layout
checkpoint: improve CTA contrast and spacing
checkpoint: fix mobile nav overflow
checkpoint: add SEO metadata for landing page
```

For non-checkpoint maintenance:

```
chore: update dependencies
docs: update AGENTS.md
```

---

## 4. Merge Rules (STRICT)

Codex MUST NOT merge branches unless explicitly instructed.

Before proposing a merge, ensure:

* ✅ Build succeeds
* ✅ No TypeScript or runtime errors
* ✅ No broken layouts across breakpoints
* ✅ No regressions in navigation or interactivity

If something fails:

* Fix it on the branch
* Create a new checkpoint commit
* Re-verify locally

---

## 5. Visual & UX Validation

Because this is a website repository, **visual correctness matters**.

Codex MUST:

* Respect existing design language and spacing
* Avoid unnecessary visual changes
* Test mobile, tablet, and desktop layouts
* Avoid layout shifts and CLS regressions

If a design decision is unclear:

* Pause
* Ask for clarification
* Do NOT invent design intent

---

## 6. Scope Control

Codex MUST:

* Stick strictly to the requested task
* Avoid refactors unless explicitly requested
* Avoid changing copy, tone, or branding unless instructed

If an issue is discovered **outside scope**:

* Do NOT fix it silently
* Leave a clear TODO comment or note it in the commit message

---

## 7. File & Dependency Hygiene

* Do not delete files unless explicitly required
* Do not rename files without strong justification
* Do not introduce new libraries casually
* Prefer existing utilities and patterns

Websites rot through small, unnecessary additions — avoid them.

---

## 8. Documentation & Intent

If behavior or structure changes:

* Update inline comments if helpful
* Leave breadcrumbs for future maintainers

Assume:

> “Someone will revisit this landing page in 6 months without context.”

Optimize for clarity.

---

## 9. When in Doubt

If unsure:

* Stop
* Ask for clarification
* Do NOT guess branding, UX, or business intent

Correct > clever
Predictable > fancy
Clear > impressive

---

## 10. Golden Rule

> **Always leave the website more stable, readable, and intentional than you found it.**
