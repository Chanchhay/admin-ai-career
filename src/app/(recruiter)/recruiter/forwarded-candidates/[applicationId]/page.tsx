"use client";

import { resolveFileUrl } from "@/lib/file-url";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  Briefcase,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  HelpCircle,
  MapPin,
  MessageSquare,
  Sparkles,
  User,
  UsersRound,
  Video,
  XCircle,
} from "lucide-react";
import { PageIntro, StatusPill } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { ReportHireDialog } from "@/components/finance/ReportHireDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetForwardedApplicationQuery } from "@/services/recruiterApi";

export default function ForwardedCandidateDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const forwardedQuery = useGetForwardedApplicationQuery(applicationId);

  if (forwardedQuery.isLoading) return <LoadingState rows={8} />;
  if (forwardedQuery.isError || !forwardedQuery.data) {
    return (
      <div className="space-y-4">
        <Button
          render={<Link href="/recruiter/forwarded-candidates" />}
          variant="outline"
          size="sm"
          className="rounded-lg"
        >
          <ArrowLeft className="mr-1.5 size-4" /> Back to Forwarded Candidates
        </Button>
        <ErrorState message="Unable to load this forwarded candidate profile." />
      </div>
    );
  }

  const forwarded = forwardedQuery.data;
  const { application, candidate, submittedResume, aiResult, humanInterviews } = forwarded;
  const feedback = aiResult?.feedback;
  const session = aiResult?.session;

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div>
        <Button
          render={<Link href="/recruiter/forwarded-candidates" />}
          variant="outline"
          size="sm"
          className="mb-4 rounded-xl text-slate-600 border-border"
        >
          <ArrowLeft className="mr-1.5 size-4" />
          Back to Forwarded Candidates
        </Button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              Forwarded Candidate Review
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-heading">
              {candidate.headline || "Candidate Profile"}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {candidate.availabilityStatus && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {candidate.availabilityStatus}
              </span>
            )}
            <StatusPill>{application.status}</StatusPill>
            <ReportHireDialog
              applicationId={application.id}
              alreadyReported={application.status === "HIRED"}
            />
          </div>
        </div>
      </div>

      {/* Candidate Overview Card */}
      <Card className="overflow-hidden border border-border shadow-sm">
        <CardContent className="space-y-5 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2 min-w-0">
              {candidate.currentPosition && (
                <p className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                  <Briefcase className="size-4 text-brand" />
                  Current Position: {candidate.currentPosition}
                </p>
              )}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
                {candidate.preferredLocation && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4 text-slate-400" />
                    Location: {candidate.preferredLocation}
                  </span>
                )}
                <span className="flex items-center gap-1.5 font-medium text-brand">
                  <Briefcase className="size-4" />
                  Target Role: {application.jobTitle}
                </span>
                {forwarded.forwardedAt && (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="size-4 text-slate-400" />
                    Forwarded Date: {new Date(forwarded.forwardedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cover Letter (if any) */}
          {application.coverLetter && (
            <div className="rounded-xl border border-border/70 bg-surface-muted/40 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Cover Letter
              </h4>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {application.coverLetter}
              </p>
            </div>
          )}

          {/* Submitted Resume Attachment */}
          {submittedResume && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand/20 bg-brand-tint/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-primary-foreground shadow-sm">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-heading">
                    {submittedResume.title || "Submitted Resume"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Attached application resume
                  </p>
                </div>
              </div>
              {submittedResume.resumeFileUrl && (
                <Button
                  render={
                    <a
                      href={resolveFileUrl(submittedResume.resumeFileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-brand/40 bg-surface text-brand hover:bg-brand-tint/50"
                >
                  <ExternalLink className="mr-1.5 size-3.5" />
                  Open Resume Document
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Interview Results Card */}
      {feedback && (
        <Card className="border border-border shadow-sm">
          <CardHeader className="bg-surface-muted/40 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-heading">
                <Sparkles className="size-5 text-brand" />
                AI Interview Screening Results
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Overall Score:</span>
                <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  {feedback.overallScore} / 100
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                    feedback.result === "PASSED"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                      : feedback.result === "FAILED"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                  }`}
                >
                  {feedback.result}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Score Breakdown Grid */}
            <div className="grid gap-3 sm:grid-cols-4">
              <ScoreCard
                label="Communication"
                score={feedback.communicationScore}
              />
              <ScoreCard
                label="Technical"
                score={feedback.technicalScore}
              />
              <ScoreCard
                label="Confidence"
                score={feedback.confidenceScore}
              />
              <ScoreCard
                label="Problem Solving"
                score={feedback.problemSolvingScore}
              />
            </div>

            {/* Recommendation & Assessment */}
            {feedback.recommendation && (
              <div className="rounded-xl border border-border/80 bg-surface p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  AI Recommendation
                </h4>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {feedback.recommendation}
                </p>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid gap-4 md:grid-cols-2">
              {feedback.strengths && (
                <div className="rounded-xl border border-border/80 bg-surface-muted/40 p-4">
                  <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    <CheckCircle2 className="size-4" />
                    Key Strengths
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                    {feedback.strengths}
                  </p>
                </div>
              )}

              {feedback.weaknesses && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                  <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1.5">
                    <AlertCircle className="size-4" />
                    Areas of Improvement
                  </h4>
                  <p className="text-xs leading-relaxed text-amber-950 dark:text-amber-200 whitespace-pre-wrap">
                    {feedback.weaknesses}
                  </p>
                </div>
              )}
            </div>

            {/* Questions & Answers Detail */}
            {session?.questions && session.questions.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-semibold text-heading">
                  Questions & Candidate Answers ({session.questions.length})
                </h4>
                <div className="space-y-3">
                  {session.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="rounded-xl border border-border bg-surface p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm text-heading">
                          Q{idx + 1}. {q.questionText}
                        </span>
                        {q.answer?.score !== undefined && (
                          <span className="shrink-0 rounded bg-brand-tint px-2 py-0.5 text-xs font-bold text-brand">
                            {q.answer.score} / {q.maxScore} pts
                          </span>
                        )}
                      </div>
                      {q.answer?.answerText ? (
                        <div className="rounded-lg bg-surface-muted/50 p-3 text-xs text-slate-700 dark:text-slate-300">
                          <p className="font-medium text-slate-500 mb-1">Answer:</p>
                          <p className="leading-relaxed">{q.answer.answerText}</p>
                        </div>
                      ) : (
                        <p className="text-xs italic text-slate-400">Unanswered</p>
                      )}
                      {q.answer?.feedback && (
                        <p className="text-xs text-slate-500 italic">
                          Feedback: {q.answer.feedback}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Human Interviews Card (if any) */}
      {humanInterviews && humanInterviews.length > 0 && (
        <Card className="border border-border shadow-sm">
          <CardHeader className="bg-surface-muted/40 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-heading">
              <Video className="size-5 text-brand" />
              Human Interview Sessions ({humanInterviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {humanInterviews.map((interview) => (
              <div
                key={interview.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusPill>{interview.status}</StatusPill>
                    {interview.result && <StatusPill>{interview.result}</StatusPill>}
                  </div>
                  {interview.scheduledAt && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar className="size-3.5" />
                      Scheduled: {new Date(interview.scheduledAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  )}
                  {interview.note && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Note: {interview.note}
                    </p>
                  )}
                </div>
                {interview.meetingUrl && (
                  <Button
                    render={
                      <a
                        href={interview.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-brand"
                  >
                    <Video className="mr-1.5 size-3.5" />
                    Join Meeting
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score?: number }) {
  const displayScore = score !== undefined ? `${score}/100` : "—";
  return (
    <div className="rounded-xl border border-border/80 bg-surface-muted/30 p-3.5 text-center">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <p className="mt-1 text-lg font-bold text-heading">{displayScore}</p>
    </div>
  );
}
