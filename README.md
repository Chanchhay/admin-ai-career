# AI-Powered Hybrid Career Platform & Interview Simulator

A multi-role career platform that combines public job discovery, recruiter job management, candidate preparation, AI interview simulation, moderator verification, and controlled candidate forwarding.

This README currently focuses on the **frontend static UI implementation**.

---

## Project Overview

The platform is designed for four main user groups:

- **Job Seeker** — manages a professional profile, resumes, portfolios, applications, and AI interviews.
- **Recruiter** — manages a verified company, publishes jobs, discovers public talent, and reviews candidates forwarded by moderators.
- **Moderator** — verifies companies, reviews candidate applications and AI results, conducts human interviews, and forwards approved candidates.
- **Admin / Finance** — manages platform-level operations, permissions, settings, and financial responsibilities according to the confirmed project scope.

The platform separates public talent discovery from private job applications. A recruiter may view information that a job seeker explicitly publishes, but private application and interview information is hidden until a moderator explicitly forwards the candidate.

---

## Main Recruitment Workflow

```text
Recruiter creates company
        ↓
Moderator verifies company
        ↓
Verified recruiter publishes jobs directly
        ↓
Job seeker discovers and applies to a job
        ↓
Job seeker completes the AI interview
        ↓
Moderator reviews the application and AI result
        ↓
Moderator conducts or schedules a human interview
        ↓
Moderator approves or rejects the candidate
        ↓
Moderator explicitly forwards an approved candidate
        ↓
Recruiter can view the forwarded application
```

Public profile discovery remains independent:

```text
Job seeker publishes profile, resume, or portfolio
        ↓
Recruiter may discover the published content
```

---

## Frontend Technology

- Next.js with App Router
- React and TypeScript
- Tailwind CSS
- Reusable design tokens and shared UI components
- OpenAPI-shaped frontend types and mock data
- Figma as the visual design reference
- Spring Boot OpenAPI contract as the field and workflow reference

---

## Frontend Static UI Progress

| Area | Estimated Completion |
|---|---:|
| Shared UI foundation | **85%** |
| Public and authentication UI | **90%** |
| Job seeker UI | **80%** |
| Recruiter UI | **80%** |
| Moderator UI | **60%** |
| Admin and Finance UI | **60%** |
| Final responsive and Figma polish | **55%** |
| **Overall static UI progress** | **about 60%** |

```text
Overall frontend static UI progress: approximately 60%
```

This percentage measures visible static interfaces only. It excludes backend integration, authentication functionality, persistence, file storage, AI processing, and production deployment.

---

## Completed Static UI Work

### Shared foundation

- Design tokens and UI rules
- Reusable role shells and page containers
- Page headers and section headers
- Buttons and form controls
- Cards and status badges
- Dialogs and confirmation states
- Tables and pagination
- Search and filter controls
- Loading, empty, and error states
- API-shaped mocks and frontend models
- Responsive foundation

### Public and authentication pages

- Landing or public home page
- Login page
- Registration page
- Public job list
- Public job detail
- Public company information page
- Job search and filter interface
- Static application action/dialog presentation

The implemented public pages are API-aligned and responsive. Some final Figma visual polishing remains.

---

## Current Implementation Status

### Public visitor

- [x] Public navigation and layout
- [x] Landing page
- [x] Job listing page
- [x] Job detail page
- [x] Public company information
- [x] Static job filters
- [ ] Final Figma comparison and polish

### Authentication

- [x] Login UI
- [x] Registration UI
- [ ] Real Keycloak login connection
- [ ] Session and role redirect behavior

Real authentication is outside the static UI estimate.

### Job seeker

- [ ] Job seeker dashboard
- [ ] Profile view and edit UI
- [ ] Profile publication controls
- [ ] Resume list
- [ ] Resume create and edit
- [ ] Default resume control
- [ ] Resume publication control
- [ ] Portfolio list
- [ ] Portfolio create and edit
- [ ] Portfolio project management
- [ ] Portfolio publication control
- [ ] Application list and detail
- [ ] AI interview flow
- [ ] AI interview result screen

### Recruiter

- [ ] Recruiter profile
- [ ] Recruiter dashboard completion
- [ ] Company onboarding
- [ ] Company document management
- [ ] Verification status interface
- [ ] Job list
- [ ] Create and edit job
- [ ] Publish, pause, resume, and close controls
- [ ] Public talent discovery
- [ ] Forwarded candidate list and detail

### Moderator

- [ ] Moderator dashboard
- [ ] Company verification queue
- [ ] Company verification detail
- [ ] Candidate review queue
- [ ] Candidate application detail
- [ ] AI interview result review
- [ ] Human interview scheduling
- [ ] Candidate approval and rejection
- [ ] Explicit candidate forwarding

### Admin and Finance

- [ ] Confirm final Admin frontend scope
- [ ] Confirm final Finance frontend scope
- [ ] Implement approved Admin interfaces
- [ ] Implement approved Finance interfaces

---

## Frontend Source Priority

Frontend implementation should follow this order of authority:

1. Current OpenAPI contract
2. Confirmed business workflows
3. Existing API-shaped mocks and shared frontend types
4. Existing reusable UI foundation
5. Figma visual design

The OpenAPI contract controls fields, request shapes, response shapes, actions, and enum values. Figma controls appearance and layout only.

---

## Confirmed Privacy and Ownership Rules

- Job seekers manage only their own profiles, resumes, portfolios, applications, and interviews.
- Profile, resume, and portfolio publication must be explicit.
- Published talent information is separate from job applications.
- Recruiters cannot view private applications or AI interview results before moderator forwarding.
- Recruiters may publish and manage jobs directly only after their company is verified.
- Moderator approval and moderator forwarding are separate actions.
- Admin, Moderator, Recruiter, Finance, and Job Seeker interfaces must remain separated by role.

---

## Planned Frontend Build Order

### Build 3

Job seeker dashboard, profile, resume, portfolio, publication controls, and portfolio projects.

### Build 4

Applications, application detail, AI interview sessions, question-and-answer flow, and interview result.

### Build 5

Recruiter profile, company onboarding, documents, job management, talent discovery, and forwarded applications.

### Build 6

Moderator company verification, candidate review, human interview scheduling, decisions, and forwarding.

### Build 7

Admin, Finance, responsive review, accessibility, empty states, permission states, and final Figma polishing.

---

## Static UI Completion Rule

A frontend page should be marked complete only when it includes:

- Correct route and role ownership
- OpenAPI-aligned fields and enum values
- Responsive structure
- Reusable shared components
- Empty state
- Loading state where applicable
- Error state where applicable
- Confirmation for destructive actions
- Accessible dialog and keyboard behavior
- No private data exposure
- Figma comparison completed or clearly recorded as pending polish

---

## Current Summary

The frontend foundation is strong and the public/authentication static interface is mostly complete. Most protected job seeker, recruiter, moderator, Admin, and Finance screens remain to be built.

```text
Frontend static UI progress: approximately 60%
```

