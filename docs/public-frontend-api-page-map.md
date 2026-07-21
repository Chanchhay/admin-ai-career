# Public Frontend API Page Map

OpenAPI source: `docs/api/openapi.json`.

The API includes moderator endpoints. They are intentionally excluded from this public frontend repository.

## Public

| Screen | Route | Endpoint | Method | Request | Response | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Home | `/` | `/api/v1/public/jobs`, `/api/v1/public/job-categories`, `/api/v1/public/industries`, `/api/v1/public/skills` | GET | none | `ApiResponsePagePublicJobResponse`, list category/industry/skill responses | Use static API-shaped featured jobs/categories/industries/skills. |
| Public job list | `/jobs` | `/api/v1/public/jobs` | GET | query params from OpenAPI operation | `ApiResponsePagePublicJobResponse` | Job cards use `PublicJobResponse`. |
| Public job detail | `/jobs/[jobId]` | `/api/v1/public/jobs/{jobId}` | GET | path `jobId` | `ApiResponsePublicJobResponse` | Apply action opens job-seeker apply dialog only in static UI. |
| Job categories | `/jobs` filters | `/api/v1/public/job-categories` | GET | none | `ApiResponseListPublicJobCategoryResponse` | Category shape: `id`, `name`, `description`. |
| Skills | `/jobs` filters, forms | `/api/v1/public/skills` | GET | none | `ApiResponseListPublicSkillResponse` | Skill shape: `id`, `name`, `skillType`. |
| Industries | `/jobs` filters, company forms | `/api/v1/public/industries` | GET | none | `ApiResponseListPublicIndustryResponse` | Industry shape: `id`, `name`, `description`. |
| Company detail | `/companies/[companyId]` | no public company detail endpoint in OpenAPI | none | none | none | Build only if supported by public job/company data. Do not invent private fields. |
| Login UI | `/login` | no login endpoint in OpenAPI | none | none | none | Static UI only. |
| Registration UI | `/register` | `/api/v1/auth/register` | POST | `RegisterRequest` | `RegisterResponse` | Role enum is `SEEKER` or `RECRUITER`; required fields include username, password, confirmPassword, email, firstName, lastName, role. |

## Job Seeker

| Screen | Route | Endpoint | Method | Request | Response | Supported Actions |
| --- | --- | --- | --- | --- | --- | --- |
| Dashboard | `/job-seeker/dashboard` | multiple job-seeker endpoints | GET | none | profile/resumes/portfolios/applications/interviews | Summary only from static mocks. |
| Profile | `/job-seeker/profile` | `/api/v1/job-seeker/profile` | GET, PATCH | `JobSeekerProfileUpdateRequest` | `ApiResponseJobSeekerProfileResponse` | Update profile. |
| Profile publication | `/job-seeker/profile` | `/api/v1/job-seeker/profile/publication` | PATCH | `PublicationRequest` | `ApiResponsePublicationResponse` | Set visibility `PUBLIC`, `PRIVATE`, or `HIDDEN`. |
| Resumes | `/job-seeker/resumes` | `/api/v1/job-seeker/resumes` | GET, POST | `ResumeCreateRequest` | list / `ApiResponseResumeResponse` | Create/list resumes. |
| Resume details | `/job-seeker/resumes/[resumeId]` | `/api/v1/job-seeker/resumes/{resumeId}` | GET, PATCH, DELETE | `ResumeUpdateRequest` | `ApiResponseResumeResponse`, `ApiResponseVoid` | View/update/delete resume. |
| Resume default | `/job-seeker/resumes/[resumeId]` | `/api/v1/job-seeker/resumes/{resumeId}/default` | POST | none | `ApiResponseResumeResponse` | Set default resume. |
| Resume publication | `/job-seeker/resumes/[resumeId]` | `/api/v1/job-seeker/resumes/{resumeId}/publication` | PATCH | `PublicationRequest` | `ApiResponsePublicationResponse` | Set visibility. |
| Portfolios | `/job-seeker/portfolios` | `/api/v1/job-seeker/portfolios` | GET, POST | `PortfolioCreateRequest` | list / `ApiResponsePortfolioResponse` | Create/list portfolios. |
| Portfolio details | `/job-seeker/portfolios/[portfolioId]` | `/api/v1/job-seeker/portfolios/{portfolioId}` | GET, PATCH, DELETE | `PortfolioUpdateRequest` | `ApiResponsePortfolioResponse`, `ApiResponseVoid` | View/update/delete portfolio. |
| Portfolio publication | `/job-seeker/portfolios/[portfolioId]` | `/api/v1/job-seeker/portfolios/{portfolioId}/publication` | PATCH | `PublicationRequest` | `ApiResponsePublicationResponse` | Set visibility. |
| Portfolio projects | `/job-seeker/portfolios/[portfolioId]` | `/api/v1/job-seeker/portfolios/{portfolioId}/projects`, `/projects/{projectId}` | POST, PATCH, DELETE | `PortfolioProjectRequest`, `PortfolioProjectUpdateRequest` | `ApiResponsePortfolioProjectResponse`, `ApiResponseVoid` | Add/update/delete projects. |
| Applications | `/job-seeker/applications` | `/api/v1/job-seeker/applications` | GET | none | `ApiResponseListJobApplicationResponse` | List own applications only. |
| Application detail | `/job-seeker/applications/[applicationId]` | `/api/v1/job-seeker/applications/{applicationId}` | GET | none | `ApiResponseJobApplicationResponse` | View own application. |
| Apply to job | public job detail | `/api/v1/job-seeker/jobs/{jobId}/applications` | POST | `JobApplicationCreateRequest` | `ApiResponseJobApplicationResponse` | Apply with optional resumeId/coverLetter. |
| Application withdrawal | `/job-seeker/applications/[applicationId]` | `/api/v1/job-seeker/applications/{applicationId}/withdraw` | POST | none | `ApiResponseJobApplicationResponse` | Withdraw own application. |
| AI interview list | `/job-seeker/interviews` | `/api/v1/job-seeker/ai-interviews` | GET | none | `ApiResponseListAiInterviewSessionResponse` | List own sessions. |
| AI interview session | `/job-seeker/interviews/[sessionId]` | `/api/v1/job-seeker/ai-interviews/{sessionId}` | GET | none | `ApiResponseAiInterviewSessionResponse` | Show questions/progress. |
| Start AI interview | `/job-seeker/interviews/[sessionId]` | `/api/v1/job-seeker/ai-interviews/{sessionId}/start` | POST | none | `ApiResponseAiInterviewSessionResponse` | Start session. |
| Answer AI question | `/job-seeker/interviews/[sessionId]` | `/api/v1/job-seeker/ai-interviews/{sessionId}/questions/{questionId}/answer` | PUT | `AiInterviewAnswerRequest` | `ApiResponseAiInterviewSessionResponse` | Submit answer text. |
| Complete AI interview | `/job-seeker/interviews/[sessionId]` | `/api/v1/job-seeker/ai-interviews/{sessionId}/complete` | POST | none | `ApiResponseAiInterviewResultResponse` | Complete session. |
| AI interview result | `/job-seeker/interviews/[sessionId]/result` | `/api/v1/job-seeker/ai-interviews/{sessionId}/result` | GET | none | `ApiResponseAiInterviewResultResponse` | Show own result only. |

## Recruiter

| Screen | Route | Endpoint | Method | Request | Response | Supported Actions |
| --- | --- | --- | --- | --- | --- | --- |
| Dashboard | `/recruiter/dashboard` | recruiter endpoints | GET | none | jobs/company/forwarded application summaries | Static summary only. |
| Recruiter profile | `/recruiter/profile` | `/api/v1/recruiter/profile` | PATCH | `RecruiterProfileUpdateRequest` | `ApiResponseRecruiterProfileResponse` | Update position/linkedinUrl. |
| Company profile | `/recruiter/company` | `/api/v1/recruiter/companies/me`, `/api/v1/recruiter/companies`, `/api/v1/recruiter/companies/{id}` | GET, POST, PUT | `CompanyCreateRequest`, `CompanyUpdateRequest` | `ApiResponseCompanyResponse` | Create/update company. |
| Company verification submission | `/recruiter/company` | `/api/v1/recruiter/companies/{companyId}/submit-verification` | POST | none | `ApiResponseCompanyResponse` | Submit company for verification. |
| Company documents | `/recruiter/company/documents` | `/api/v1/recruiter/companies/{companyId}/documents` | GET, POST | `CompanyDocumentRequest` | list / `ApiResponseCompanyDocumentResponse` | List/add documents. |
| Delete company document | `/recruiter/company/documents` | `/api/v1/recruiter/companies/{companyId}/documents/{documentId}` | DELETE | none | `ApiResponseVoid` | Delete document. |
| Recruiter job list | `/recruiter/jobs` | `/api/v1/recruiter/jobs` | GET | none | `ApiResponseListJobPostResponse` | List own company jobs. |
| Create job | `/recruiter/jobs/new` | `/api/v1/recruiter/jobs` | POST | `JobPostRequest` | `ApiResponseJobPostResponse` | Create draft. |
| Job detail | `/recruiter/jobs/[jobId]` | `/api/v1/recruiter/jobs/{id}` | GET | none | `ApiResponseJobPostResponse` | View own job. |
| Update job | `/recruiter/jobs/[jobId]/edit` | `/api/v1/recruiter/jobs/{id}` | PUT | `JobPostRequest` | `ApiResponseJobPostResponse` | Update own job. |
| Publish job | `/recruiter/jobs/[jobId]` | `/api/v1/recruiter/jobs/{id}/publish` | POST | none | `ApiResponseJobPostResponse` | Publish. |
| Pause job | `/recruiter/jobs/[jobId]` | `/api/v1/recruiter/jobs/{id}/pause` | POST | none | `ApiResponseJobPostResponse` | Pause. |
| Resume job | `/recruiter/jobs/[jobId]` | `/api/v1/recruiter/jobs/{id}/resume` | POST | none | `ApiResponseJobPostResponse` | Resume paused job. |
| Close job | `/recruiter/jobs/[jobId]` | `/api/v1/recruiter/jobs/{id}/close` | POST | none | `ApiResponseJobPostResponse` | Close. |
| Public talent search | `/recruiter/talent` | `/api/v1/recruiter/talent` | GET | query params from OpenAPI operation | `ApiResponsePagePublicTalentListItemResponse` | Only public talent discovery. |
| Public talent details | `/recruiter/talent/[publicProfileSlug]` | `/api/v1/recruiter/talent/{publicProfileSlug}` | GET | path slug | `ApiResponsePublicTalentDetailResponse` | Public profile, public resumes, public portfolios. |
| Published resume download | `/recruiter/talent/[publicProfileSlug]` | `/api/v1/recruiter/talent/{publicProfileSlug}/resumes/{resumeId}/download` | GET | slug/resumeId | `ApiResponsePublicResumeDownloadResponse` | Download URL for published resume. |
| Forwarded candidate list | `/recruiter/forwarded-candidates` | `/api/v1/recruiter/forwarded-applications` | GET | none | `ApiResponseListForwardedApplicationResponse` | Forwarded applications only. |
| Forwarded candidate details | `/recruiter/forwarded-candidates/[applicationId]` | `/api/v1/recruiter/forwarded-applications/{applicationId}` | GET | path applicationId | `ApiResponseForwardedApplicationResponse` | May show private application, submitted resume, AI result only after forwarding. |

## Important Enums

- `JobPostResponse.status`: `DRAFT`, `PENDING`, `APPROVED`, `REJECTED`, `PUBLISHED`, `PAUSED`, `CLOSED`, `EXPIRED`
- `JobApplicationResponse.status`: `SUBMITTED`, `UNDER_REVIEW`, `AI_INTERVIEW_REQUIRED`, `AI_INTERVIEW_IN_PROGRESS`, `AI_INTERVIEW_FAILED`, `MODERATOR_REVIEW_PENDING`, `AI_INTERVIEW_PASSED`, `SHORTLISTED`, `HUMAN_INTERVIEW_SCHEDULED`, `HIRED`, `REJECTED`, `WITHDRAWN`
- `AiInterviewSessionResponse.status`: `PREPARING`, `READY`, `PENDING`, `IN_PROGRESS`, `COMPLETED`, `FAILED`, `CANCELLED`
- AI/human result: `PASSED`, `FAILED`, `NEEDS_REVIEW`
- publication visibility: `PUBLIC`, `PRIVATE`, `HIDDEN`
- company verification status: `PENDING_VERIFICATION`, `APPROVED`, `REJECTED`, `SUSPENDED`
- generic status: `ACTIVE`, `INACTIVE`, `PENDING`, `SUSPENDED`
- salary visibility: `PRIVATE`, `RECRUITERS_ONLY`, `PUBLIC`
- register role: `SEEKER`, `RECRUITER`
- register gender: `MALE`, `FEMALE`, `OTHER`, `UNSPECIFIED`

## Excluded API Areas

Do not create frontend routes for:

- `/api/v1/moderator/*`
- `CurrentUserProfilesResponse.adminProfileId`
- `CurrentUserProfilesResponse.moderatorProfileId`
- `CurrentUserProfilesResponse.financeProfileId`
