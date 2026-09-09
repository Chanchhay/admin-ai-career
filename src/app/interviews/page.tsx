"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, useEffect } from "react";
import {
  ArrowUpRight,
  Calendar as CalendarIcon,
  CalendarDays,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  List,
  Search,
  User,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import {
  InterviewStatusChip,
  ResultChip,
} from "@/components/console/StatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-picker";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { GhostChip, Panel } from "@/components/workspace/primitives";
import type {
  ApplicationSummaryResponse,
  CandidateProfileResponse,
  HumanInterviewResponse,
  InterviewResult,
} from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDateTime, humanizeEnum, orDash, toInstant } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  useCancelHumanInterviewMutation,
  useCompleteHumanInterviewMutation,
  useGetApplicationQuery,
  useGetApplicationsQuery,
  useRescheduleHumanInterviewMutation,
  useScheduleHumanInterviewMutation,
} from "@/services/moderationApi";

export type EnrichedInterview = HumanInterviewResponse & {
  candidateHeadline?: string;
  candidateCurrentPosition?: string;
  jobTitle?: string;
  applicationId: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toLocalDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDateKey(isoString: string): string {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";
  return toLocalDateKey(d);
}

function formatDisplayDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  if (!y || !m || !d) return dateKey;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeOnly(isoString: string): string {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function isInterviewActive(status: string): boolean {
  return status !== "COMPLETED" && status !== "CANCELLED" && status !== "FAILED";
}

/* ------------------------------------------------ interview fetcher item --- */

function ApplicationInterviewCollector({
  applicationId,
  candidate,
  application,
  onInterviewsLoaded,
}: {
  applicationId: string;
  candidate: CandidateProfileResponse;
  application: ApplicationSummaryResponse;
  onInterviewsLoaded: (appId: string, items: EnrichedInterview[]) => void;
}) {
  const { data } = useGetApplicationQuery(applicationId);

  useEffect(() => {
    if (data?.humanInterviews) {
      const enriched: EnrichedInterview[] = data.humanInterviews.map((i) => ({
        ...i,
        candidateHeadline: candidate?.headline,
        candidateCurrentPosition: candidate?.currentPosition,
        jobTitle: application?.jobTitle,
        applicationId,
      }));
      onInterviewsLoaded(applicationId, enriched);
    }
  }, [data, applicationId, candidate, application, onInterviewsLoaded]);

  return null;
}

/* ---------------------------------------------------- main page --- */

export default function InterviewSchedulePage() {
  useSetPageHeading("Interview schedule");

  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => toLocalDateKey(today), [today]);

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [filterQuery, setFilterQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");

  // Scheduling modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [scheduleDateTime, setScheduleDateTime] = useState(`${todayKey}T09:00`);
  const [scheduleMeetingUrl, setScheduleMeetingUrl] = useState("");

  // Rescheduling modal state
  const [reschedulingInterview, setReschedulingInterview] = useState<EnrichedInterview | null>(null);
  const [rescheduleDateTime, setRescheduleDateTime] = useState("");
  const [rescheduleMeetingUrl, setRescheduleMeetingUrl] = useState("");

  // Query applications
  const {
    data: appsData,
    isLoading: isAppsLoading,
    isError: isAppsError,
    refetch,
  } = useGetApplicationsQuery({ size: 100 });

  // Mutations
  const [scheduleInterview, { isLoading: isScheduling }] = useScheduleHumanInterviewMutation();
  const [rescheduleInterview, { isLoading: isRescheduling }] = useRescheduleHumanInterviewMutation();
  const [completeInterview] = useCompleteHumanInterviewMutation();
  const [cancelInterview] = useCancelHumanInterviewMutation();

  // Map of interviews per application ID
  const [interviewsMap, setInterviewsMap] = useState<Record<string, EnrichedInterview[]>>({});

  const handleInterviewsLoaded = useCallback((appId: string, items: EnrichedInterview[]) => {
    setInterviewsMap((prev) => {
      // Shallow check to avoid unnecessary state updates
      const current = prev[appId];
      if (current && current.length === items.length && JSON.stringify(current) === JSON.stringify(items)) {
        return prev;
      }
      return { ...prev, [appId]: items };
    });
  }, []);

  // Flatten all interviews across all applications
  const allInterviews = useMemo(() => {
    const list: EnrichedInterview[] = [];
    for (const items of Object.values(interviewsMap)) {
      list.push(...items);
    }
    // Sort chronologically ascending
    return list.sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
  }, [interviewsMap]);

  // Group interviews by YYYY-MM-DD
  const interviewsByDate = useMemo(() => {
    const map = new Map<string, EnrichedInterview[]>();
    for (const interview of allInterviews) {
      const key = parseDateKey(interview.scheduledAt);
      if (!key) continue;
      const list = map.get(key) ?? [];
      list.push(interview);
      map.set(key, list);
    }
    return map;
  }, [allInterviews]);

  // Filtered interviews for the search & status filter
  const filteredInterviews = useMemo(() => {
    return allInterviews.filter((i) => {
      if (statusFilter === "ACTIVE" && !isInterviewActive(i.status)) return false;
      if (statusFilter === "COMPLETED" && i.status !== "COMPLETED") return false;

      if (filterQuery.trim()) {
        const needle = filterQuery.toLowerCase();
        const candidate = (i.candidateHeadline ?? "").toLowerCase();
        const job = (i.jobTitle ?? "").toLowerCase();
        return candidate.includes(needle) || job.includes(needle);
      }
      return true;
    });
  }, [allInterviews, filterQuery, statusFilter]);

  // Interviews on the selected date
  const selectedDayInterviews = useMemo(() => {
    const onDate = interviewsByDate.get(selectedDateKey) ?? [];
    if (!filterQuery.trim()) return onDate;
    const needle = filterQuery.toLowerCase();
    return onDate.filter(
      (i) =>
        (i.candidateHeadline ?? "").toLowerCase().includes(needle) ||
        (i.jobTitle ?? "").toLowerCase().includes(needle),
    );
  }, [interviewsByDate, selectedDateKey, filterQuery]);

  // Calendar cells
  const calendarCells = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDayIndex = firstDay.getDay(); // 0 = Sun
    const start = new Date(currentYear, currentMonth, 1 - startDayIndex);

    return Array.from({ length: 42 }, (_, index) => {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
      const key = toLocalDateKey(d);
      const isOutside = d.getMonth() !== currentMonth;
      const isToday = key === todayKey;
      const isSelected = key === selectedDateKey;
      const dayInterviews = interviewsByDate.get(key) ?? [];

      return {
        date: d,
        key,
        dayNumber: d.getDate(),
        isOutside,
        isToday,
        isSelected,
        interviews: dayInterviews,
      };
    });
  }, [currentYear, currentMonth, todayKey, selectedDateKey, interviewsByDate]);

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDateKey(todayKey);
  };

  // Schedule new interview
  const handleScheduleSubmit = async () => {
    if (!selectedApplicationId) {
      toast.error("Please select a candidate application.");
      return;
    }
    if (!scheduleDateTime || !scheduleMeetingUrl.trim()) {
      toast.error("Both a date/time and a meeting link are required.");
      return;
    }

    try {
      await scheduleInterview({
        applicationId: selectedApplicationId,
        body: {
          scheduledAt: toInstant(scheduleDateTime),
          meetingUrl: scheduleMeetingUrl.trim(),
        },
      }).unwrap();

      toast.success("Interview scheduled successfully.");
      setIsScheduleModalOpen(false);
      setScheduleMeetingUrl("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to schedule the interview."));
    }
  };

  // Start reschedule modal
  const openRescheduleModal = (interview: EnrichedInterview) => {
    const parsed = new Date(interview.scheduledAt);
    const localValue = Number.isNaN(parsed.getTime())
      ? ""
      : new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60_000)
          .toISOString()
          .slice(0, 16);
    setReschedulingInterview(interview);
    setRescheduleDateTime(localValue);
    setRescheduleMeetingUrl(interview.meetingUrl ?? "");
  };

  const handleRescheduleSubmit = async () => {
    if (!reschedulingInterview) return;
    if (!rescheduleDateTime || !rescheduleMeetingUrl.trim()) {
      toast.error("Both date and meeting link are required.");
      return;
    }

    try {
      await rescheduleInterview({
        interviewId: reschedulingInterview.id,
        applicationId: reschedulingInterview.applicationId,
        body: {
          scheduledAt: toInstant(rescheduleDateTime),
          meetingUrl: rescheduleMeetingUrl.trim(),
        },
      }).unwrap();

      toast.success("Interview rescheduled.");
      setReschedulingInterview(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to reschedule the interview."));
    }
  };

  const handleComplete = async (interview: EnrichedInterview, result: InterviewResult) => {
    try {
      await completeInterview({
        interviewId: interview.id,
        applicationId: interview.applicationId,
        body: { result },
      }).unwrap();
      toast.success(`Interview marked ${humanizeEnum(result).toLowerCase()}.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to complete the interview."));
    }
  };

  const handleCancel = async (interview: EnrichedInterview) => {
    try {
      await cancelInterview({
        interviewId: interview.id,
        applicationId: interview.applicationId,
      }).unwrap();
      toast.success("Interview cancelled.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to cancel the interview."));
    }
  };

  const applicationsList = appsData?.content ?? [];

  // Active interviews count
  const activeCount = allInterviews.filter((i) => isInterviewActive(i.status)).length;
  const completedCount = allInterviews.filter((i) => i.status === "COMPLETED").length;

  if (isAppsLoading) return <LoadingState rows={6} />;
  if (isAppsError) {
    return <ErrorState message="Unable to load interview schedule." onRetry={refetch} />;
  }

  return (
    <div className="flex flex-col gap-4 max-lg:min-w-0 max-lg:shrink-0">
      {/* Invisible collectors for all applications */}
      {applicationsList.map((app) => (
        <ApplicationInterviewCollector
          key={app.application.id}
          applicationId={app.application.id}
          candidate={app.candidate}
          application={app.application}
          onInterviewsLoaded={handleInterviewsLoaded}
        />
      ))}

      {/* Top statistics and schedule action */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-ws-line/70 bg-ws-panel p-4 shadow-xs">
          <p className="type-eyebrow">
            Upcoming interviews
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-ws-fg">
              {activeCount}
            </span>
            <span className="text-sm text-ws-muted">active</span>
          </div>
        </div>

        <div className="rounded-2xl border border-ws-line/70 bg-ws-panel p-4 shadow-xs">
          <p className="type-eyebrow">
            Completed interviews
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-ws-fg">
              {completedCount}
            </span>
            <span className="text-sm text-emerald-600 dark:text-emerald-400">finished</span>
          </div>
        </div>

        <div className="rounded-2xl border border-ws-line/70 bg-ws-panel p-4 shadow-xs">
          <p className="type-eyebrow">
            Total candidate queue
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-ws-fg">
              {applicationsList.length}
            </span>
            <span className="text-sm text-ws-muted">applications</span>
          </div>
        </div>

        <div className="flex items-center justify-end rounded-2xl border border-ws-line/70 bg-ws-panel p-4 shadow-xs">
          <Button
            onClick={() => {
              if (applicationsList.length > 0) {
                setSelectedApplicationId(applicationsList[0].application.id);
              }
              setScheduleDateTime(`${selectedDateKey}T09:00`);
              setIsScheduleModalOpen(true);
            }}
            className="w-full h-11 text-base font-semibold"
          >
            <CalendarPlus aria-hidden="true" className="size-4" />
            Schedule interview
          </Button>
        </div>
      </div>

      {/* Main Panel */}
      <Panel className="max-lg:min-w-0 max-sm:p-3">
        {/* Controls: Search, Status filter, View switch */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ws-line/60 pb-4">
          <div className="flex flex-wrap items-center gap-2 max-lg:min-w-0 max-sm:w-full">
            {/* Search */}
            <div className="relative min-w-56 max-sm:min-w-0 max-sm:w-full">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ws-faint"
              />
              <Input
                type="search"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search candidate or job…"
                className="pl-9 text-sm"
              />
            </div>

            {/* Status filters */}
            <div className="flex items-center rounded-lg bg-ws-card-hover p-1 text-sm max-sm:max-w-full max-sm:flex-wrap">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition-colors",
                  statusFilter === "ALL"
                    ? "bg-ws-panel text-ws-fg shadow-xs font-semibold"
                    : "text-ws-muted hover:text-ws-fg",
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("ACTIVE")}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition-colors",
                  statusFilter === "ACTIVE"
                    ? "bg-ws-panel text-ws-fg shadow-xs font-semibold"
                    : "text-ws-muted hover:text-ws-fg",
                )}
              >
                Scheduled
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("COMPLETED")}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition-colors",
                  statusFilter === "COMPLETED"
                    ? "bg-ws-panel text-ws-fg shadow-xs font-semibold"
                    : "text-ws-muted hover:text-ws-fg",
                )}
              >
                Completed
              </button>
            </div>
          </div>

          {/* View switcher */}
          <div className="flex items-center rounded-lg bg-ws-card-hover p-1 text-sm max-sm:w-full max-sm:flex-wrap">
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-colors",
                viewMode === "calendar"
                  ? "bg-ws-panel text-ws-fg shadow-xs font-semibold"
                  : "text-ws-muted hover:text-ws-fg",
              )}
            >
              <CalendarDays aria-hidden="true" className="size-3.5" />
              Calendar view
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-colors",
                viewMode === "list"
                  ? "bg-ws-panel text-ws-fg shadow-xs font-semibold"
                  : "text-ws-muted hover:text-ws-fg",
              )}
            >
              <List aria-hidden="true" className="size-3.5" />
              Agenda list ({filteredInterviews.length})
            </button>
          </div>
        </div>

        {viewMode === "calendar" ? (
          /* Calendar view: Month grid + Day agenda */
          <div className="mt-4 grid gap-6 lg:grid-cols-12 max-lg:min-w-0 max-lg:grid-cols-1">
            {/* Calendar on left (7 cols) */}
            <div className="rounded-2xl border border-ws-line/70 bg-ws-card-hover/40 p-5 lg:col-span-7 max-lg:min-w-0 max-sm:p-2">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between max-lg:flex-wrap max-lg:gap-3">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-ws-fg">
                    {MONTH_NAMES[currentMonth]} {currentYear}
                  </h3>
                  <p className="text-sm text-ws-faint">
                    Click any day to view scheduled interviews and candidate details
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={goToToday}
                    className="h-8 px-2.5 text-sm font-medium"
                  >
                    Today
                  </Button>
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={prevMonth}
                    className="flex size-8 items-center justify-center rounded-lg text-ws-muted transition-colors hover:bg-ws-card hover:text-ws-fg"
                  >
                    <ChevronLeft aria-hidden="true" className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={nextMonth}
                    className="flex size-8 items-center justify-center rounded-lg text-ws-muted transition-colors hover:bg-ws-card hover:text-ws-fg"
                  >
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </div>

              {/* Weekday headers */}
              <div className="mb-1.5 grid grid-cols-7 gap-1.5 text-center max-sm:gap-0.5">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="py-1 type-eyebrow"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1.5 max-sm:gap-0.5">
                {calendarCells.map((cell) => {
                  const hasInterviews = cell.interviews.length > 0;
                  const activeInterviews = cell.interviews.filter((i) =>
                    isInterviewActive(i.status),
                  );

                  return (
                    <button
                      key={cell.key}
                      type="button"
                      onClick={() => setSelectedDateKey(cell.key)}
                      className={cn(
                        "group relative flex min-h-[68px] flex-col justify-between rounded-xl p-2 text-left transition-all outline-none max-lg:min-w-0 max-sm:min-h-11 max-sm:justify-center max-sm:rounded-lg max-sm:p-0.5",
                        cell.isOutside
                          ? "text-ws-faint/50 hover:bg-ws-card-hover/40"
                          : "text-ws-fg hover:bg-ws-card-hover",
                        cell.isToday && "ring-1 ring-primary/50 font-bold",
                        cell.isSelected &&
                          "bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary",
                      )}
                    >
                      <div className="relative flex w-full items-center justify-center">
                        <span
                          className={cn(
                            "flex size-6 items-center justify-center rounded-full text-sm",
                            cell.isToday &&
                              !cell.isSelected &&
                              "bg-primary/15 text-primary font-bold",
                          )}
                        >
                          {cell.dayNumber}
                        </span>

                        {hasInterviews ? (
                          <span
                            className={cn(
                              "absolute right-0 top-0 size-2 rounded-full",
                              cell.isSelected
                                ? "bg-white"
                                : activeInterviews.length > 0
                                  ? "bg-brand"
                                  : "bg-emerald-500",
                            )}
                          />
                        ) : null}
                      </div>

                      {hasInterviews ? (
                        <div className="mt-1 flex flex-col gap-0.5">
                          <span
                            className={cn(
                              "truncate rounded px-1 py-0.5 text-xs font-bold leading-tight",
                              cell.isSelected
                                ? "bg-white/20 text-white"
                                : activeInterviews.length > 0
                                  ? "bg-brand/15 text-primary font-semibold"
                                  : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                            )}
                          >
                            {cell.interviews[0].candidateHeadline || "Candidate"}
                          </span>
                          {cell.interviews.length > 1 ? (
                            <span
                              className={cn(
                                "text-xs font-medium",
                                cell.isSelected ? "text-white/80" : "text-ws-faint",
                              )}
                            >
                              +{cell.interviews.length - 1} more
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <span className="h-4 max-sm:hidden" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Day Agenda on right (5 cols) */}
            <div className="flex flex-col gap-4 lg:col-span-5 max-lg:min-w-0">
              <div className="rounded-2xl border border-ws-line/70 bg-ws-card-hover/40 p-5">
                <div className="mb-4 flex items-center justify-between border-b border-ws-line/60 pb-3 max-lg:flex-wrap max-lg:gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon aria-hidden="true" className="size-4 text-primary" />
                    <div>
                      <h4 className="text-base font-bold text-ws-fg">
                        {formatDisplayDate(selectedDateKey)}
                      </h4>
                      <p className="text-xs text-ws-faint">
                        {selectedDayInterviews.length}{" "}
                        {selectedDayInterviews.length === 1 ? "interview" : "interviews"} scheduled
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (applicationsList.length > 0) {
                        setSelectedApplicationId(applicationsList[0].application.id);
                      }
                      setScheduleDateTime(`${selectedDateKey}T09:00`);
                      setIsScheduleModalOpen(true);
                    }}
                    className="h-8 gap-1 text-sm"
                  >
                    <CalendarPlus aria-hidden="true" className="size-3.5" />
                    Add
                  </Button>
                </div>

                {selectedDayInterviews.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {selectedDayInterviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="rounded-xl border border-ws-line/70 bg-ws-panel p-4 shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2 max-lg:flex-wrap">
                          <div className="flex items-start gap-2.5 max-lg:min-w-0 max-lg:max-w-full">
                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                              <User aria-hidden="true" className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/applications/${interview.applicationId}`}
                                className="inline-flex items-center gap-1 text-sm font-bold text-ws-fg hover:text-primary transition-colors"
                              >
                                <span className="truncate">
                                  {orDash(interview.candidateHeadline)}
                                </span>
                                <ArrowUpRight aria-hidden="true" className="size-3 shrink-0" />
                              </Link>
                              {interview.jobTitle ? (
                                <p className="truncate text-xs text-ws-muted">
                                  Role: {interview.jobTitle}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <InterviewStatusChip status={interview.status} />
                            <ResultChip result={interview.result} />
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-ws-muted">
                          <span className="font-semibold text-primary">
                            {formatTimeOnly(interview.scheduledAt)}
                          </span>
                          <span>·</span>
                          <span>{formatDateTime(interview.scheduledAt)}</span>
                        </div>

                        {interview.meetingUrl ? (
                          <a
                            href={interview.meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2.5 flex items-center gap-2 truncate rounded-lg bg-ws-card-hover px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-ws-card hover:underline"
                          >
                            <Video aria-hidden="true" className="size-3.5 shrink-0" />
                            <span className="truncate">{interview.meetingUrl}</span>
                            <ExternalLink aria-hidden="true" className="size-3 shrink-0 opacity-70" />
                          </a>
                        ) : null}

                        {/* Actions for live interview */}
                        {isInterviewActive(interview.status) ? (
                          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-ws-line/50 pt-2.5">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => openRescheduleModal(interview)}
                              className="h-7 text-sm"
                            >
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => void handleComplete(interview, "PASSED")}
                              className="h-7 text-sm"
                            >
                              Passed
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => void handleComplete(interview, "NEEDS_REVIEW")}
                              className="h-7 text-sm"
                            >
                              Needs review
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => void handleComplete(interview, "FAILED")}
                              className="h-7 text-sm"
                            >
                              Failed
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => void handleCancel(interview)}
                              className="h-7 text-sm text-destructive hover:bg-destructive/10"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ws-line/80 py-10 text-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-ws-card text-ws-faint">
                      <CalendarDays aria-hidden="true" className="size-5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-ws-fg">
                      No interviews scheduled on this date
                    </p>
                    <p className="mt-1 max-w-xs text-xs text-ws-faint">
                      Pick another date from the calendar or schedule a new interview with any candidate.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (applicationsList.length > 0) {
                          setSelectedApplicationId(applicationsList[0].application.id);
                        }
                        setScheduleDateTime(`${selectedDateKey}T09:00`);
                        setIsScheduleModalOpen(true);
                      }}
                      className="mt-4 gap-1 text-sm"
                    >
                      <CalendarPlus aria-hidden="true" className="size-3.5" />
                      Schedule on this date
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* List / Agenda View */
          <div className="mt-4 flex flex-col gap-3">
            {filteredInterviews.length > 0 ? (
              <ul className="flex flex-col gap-2.5">
                {filteredInterviews.map((interview) => (
                  <li
                    key={interview.id}
                    className="rounded-xl border border-ws-line/70 bg-ws-card-hover/70 p-4 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 max-lg:min-w-0 max-lg:max-w-full max-lg:break-words">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                          <Video aria-hidden="true" className="size-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 max-lg:flex-wrap">
                            <Link
                              href={`/applications/${interview.applicationId}`}
                              className="text-base font-bold text-ws-fg hover:text-primary transition-colors flex items-center gap-1"
                            >
                              {orDash(interview.candidateHeadline)}
                              <ArrowUpRight aria-hidden="true" className="size-3.5" />
                            </Link>
                            <GhostChip>{formatDateTime(interview.scheduledAt)}</GhostChip>
                          </div>
                          {interview.jobTitle ? (
                            <p className="text-sm text-ws-muted">
                              Role: {interview.jobTitle}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <InterviewStatusChip status={interview.status} />
                        <ResultChip result={interview.result} />
                      </div>
                    </div>

                    {interview.meetingUrl ? (
                      <a
                        href={interview.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2.5 inline-flex items-center gap-1.5 truncate text-sm text-primary hover:underline"
                      >
                        <Video aria-hidden="true" className="size-3.5" />
                        {interview.meetingUrl}
                        <ExternalLink aria-hidden="true" className="size-3" />
                      </a>
                    ) : null}

                    {isInterviewActive(interview.status) ? (
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ws-line/40 pt-2.5">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openRescheduleModal(interview)}
                        >
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => void handleComplete(interview, "PASSED")}
                        >
                          Passed
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => void handleComplete(interview, "NEEDS_REVIEW")}
                        >
                          Needs review
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => void handleComplete(interview, "FAILED")}
                        >
                          Failed
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => void handleCancel(interview)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ws-line py-12 text-center">
                <CalendarDays aria-hidden="true" className="size-8 text-ws-faint" />
                <p className="mt-2 text-base font-semibold text-ws-fg">
                  No matching interviews found
                </p>
                <p className="mt-1 text-sm text-ws-muted">
                  Try adjusting your search or status filter.
                </p>
              </div>
            )}
          </div>
        )}
      </Panel>

      {/* Schedule Interview Modal */}
      <Dialog
        open={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
        title="Schedule an interview"
        description="Select a candidate and set the date, time, and meeting link."
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ws-muted">
              Select Candidate Application
            </label>
            <Select
              value={selectedApplicationId}
              onChange={(value) => setSelectedApplicationId(value)}
              options={applicationsList.map((app) => ({
                value: app.application.id,
                label: `${app.candidate?.headline || "Candidate"} — ${app.application.jobTitle || "Job"}`,
              }))}
            />
          </div>

          <DateTimePicker
            label="Date & Time (your local time)"
            value={scheduleDateTime}
            onChange={setScheduleDateTime}
            disabled={isScheduling}
          />

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ws-muted">
            Meeting link
            <Input
              type="url"
              value={scheduleMeetingUrl}
              onChange={(e) => setScheduleMeetingUrl(e.target.value)}
              placeholder="https://meet.example.com/abc-defg"
              disabled={isScheduling}
            />
          </label>

          <div className="flex items-center justify-end gap-2 border-t border-ws-line/60 pt-3">
            <Button
              type="button"
              variant="ghost"
              disabled={isScheduling}
              onClick={() => setIsScheduleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isScheduling || !selectedApplicationId || !scheduleMeetingUrl.trim()}
              onClick={() => void handleScheduleSubmit()}
            >
              <CalendarPlus aria-hidden="true" className="size-3.5" />
              {isScheduling ? "Scheduling…" : "Schedule interview"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog
        open={Boolean(reschedulingInterview)}
        onOpenChange={(open) => {
          if (!open) setReschedulingInterview(null);
        }}
        title="Reschedule interview"
        description={
          reschedulingInterview
            ? `Rescheduling interview for ${reschedulingInterview.candidateHeadline || "Candidate"}`
            : "Select a new date and time."
        }
      >
        <div className="flex flex-col gap-4">
          <DateTimePicker
            label="New date & time"
            value={rescheduleDateTime}
            onChange={setRescheduleDateTime}
            disabled={isRescheduling}
          />

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ws-muted">
            Meeting link
            <Input
              type="url"
              value={rescheduleMeetingUrl}
              onChange={(e) => setRescheduleMeetingUrl(e.target.value)}
              disabled={isRescheduling}
            />
          </label>

          <div className="flex items-center justify-end gap-2 border-t border-ws-line/60 pt-3">
            <Button
              type="button"
              variant="ghost"
              disabled={isRescheduling}
              onClick={() => setReschedulingInterview(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isRescheduling || !rescheduleDateTime || !rescheduleMeetingUrl.trim()}
              onClick={() => void handleRescheduleSubmit()}
            >
              {isRescheduling ? "Saving…" : "Save new schedule"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
