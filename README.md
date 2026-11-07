# MMS Platform — Mpumalanga Mining Solutions

**Training and operations platform | Next.js / React / Supabase**

**CI evidence (2026-11-07):** [Verify Next.js application run 42393763372](https://github.com/lx-obsidian-labs/mms-platform/actions/runs/42393763372) completed successfully at commit `02add610525562a12aa89100458308d8cc552653`. Supabase authorization and live training workflows remain unverified.  
**Stage:** To confirm from current releases and deployment evidence.  
**Verification:** Source manifests inspected; build, lint, live integrations and user workflows have not been independently executed in this documentation review.  
**Next milestone:** Verify a clean build, Supabase authentication/data boundaries and core training workflows.

## Purpose

This repository contains a web application associated with Mpumalanga Mining Solutions' training ecosystem. The codebase includes a Next.js application, Supabase integration dependencies, email tooling and PDF generation dependencies. These are **declared technical dependencies**, not evidence that every planned business process is complete.

## Technical stack

Based on the checked-in `package.json`:

- Next.js 16, React 19, TypeScript and Tailwind CSS 4
- Supabase JavaScript and SSR clients
- Nodemailer and Resend for potential communication integrations
- PDFKit for document/PDF capabilities
- ESLint for static checks

## Local development

Requires a compatible Node.js version and environment configuration for whichever Supabase and email features are exercised.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Review source references to `process.env` before configuring credentials; do not commit secrets.

## Verification commands

```bash
npm run lint
npm run build
```

These scripts are present in the manifest. **No automated test script is declared in the inspected package manifest.** A successful build alone does not validate database policies, authorization, email delivery or business workflows.

## Documentation and architecture review

The repository contains extensive project specification PDFs covering requirements, student portal, administration, database architecture, security, design, marketing and operational procedures. Treat these documents as **planning/specification material** until each requirement is mapped to implemented code and acceptance tests.

Before publishing a production case study:

1. Map the implemented routes, roles and data tables to the specifications.
2. Verify Supabase row-level security and authorization on privileged operations.
3. Test enrolment, student and administration workflows with controlled data.
4. Verify email/PDF behavior, including failure and privacy cases.
5. Run lint/build and record CI run links and deployment evidence.
6. Confirm client approval to publish project-specific screenshots and business documents.

## Portfolio and attribution

Maintained in the [LX Obsidian Labs engineering portfolio](https://github.com/lx-obsidian-labs/lx-obsidian-labs). The repository's licensing and third-party attribution should be reviewed before reuse or redistribution. Client-specific documents must not be copied into public marketing without permission.
