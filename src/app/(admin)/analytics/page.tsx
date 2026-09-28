"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import {
  Activity,
  BarChart3,
  Check,
  ChevronDown,
  FileText,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  useGetFormsByTypeQuery,
  useGetFormsSummaryQuery,
  useGetMonthlyTrendsQuery,
  useGetUserFormUsageQuery,
} from "@/api/analyticsApi";

/* =========================================================
   Constants
========================================================= */

const USER_USAGE_PAGE_SIZE = 10;

const COLORS = {
  primary: "#005F4E",
  border: "#D5E4DF",
  grid: "#E3ECE9",
  muted: "#71817C",
  soft: "#E8F3EF",
  text: "#111D1A",
};

const tooltipStyle = {
  borderRadius: "8px",
  border: `1px solid ${COLORS.border}`,
  backgroundColor: "#ffffff",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  fontSize: 12,
  padding: "6px 10px",
};

const axisTick = {
  fill: COLORS.muted,
  fontSize: 11,
};

const cardClass =
  "rounded-xl border border-[#D5E4DF] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)]";

/* Rank badge styles for top 3 */
const RANK_STYLES = [
  "bg-[#005F4E] text-white",
  "bg-[#5E9B8E] text-white",
  "bg-[#BFDCD4] text-[#005F4E]",
];

type Period = "all" | "today" | "week" | "month" | "custom";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "custom", label: "Custom Range" },
];

/* =========================================================
   Page
========================================================= */

export default function AnalyticsPage() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<Period>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* Custom range needs both dates before we call the API */
  const customIncomplete =
    period === "custom" && !(startDate && endDate);

  const {
    data: summaryResponse,
    isLoading: summaryLoading,
    isFetching: summaryFetching,
    refetch: refetchSummary,
  } = useGetFormsSummaryQuery();

  const {
    data: trendResponse,
    isLoading: trendLoading,
    isFetching: trendFetching,
    refetch: refetchTrend,
  } = useGetMonthlyTrendsQuery();

  const {
    data: typeResponse,
    isLoading: typeLoading,
    isFetching: typeFetching,
    refetch: refetchType,
  } = useGetFormsByTypeQuery();

  const {
    data: usageResponse,
    isLoading: usageLoading,
    isFetching: usageFetching,
    refetch: refetchUsage,
  } = useGetUserFormUsageQuery(
    {
      page: 0,
      size: USER_USAGE_PAGE_SIZE,
      period,
      ...(period === "custom" ? { startDate, endDate } : {}),
    },
    {
      skip: customIncomplete,
    }
  );

  const summary = summaryResponse?.data;
  const monthlyTrends = trendResponse?.data ?? [];
  const formTypes = typeResponse?.data ?? [];
  const rawUsage = usageResponse?.data?.content ?? [];

  /* =========================================================
     Rank users by forms generated
  ========================================================= */

  const rankedUsers = useMemo(
    () =>
      [...rawUsage]
        .sort(
          (a, b) =>
            b.totalFormsGenerated - a.totalFormsGenerated
        )
        .map((user, index) => ({
          ...user,
          rank: index + 1,
        })),
    [rawUsage]
  );

  const maxForms = Math.max(
    ...rankedUsers.map(
      (user) => user.totalFormsGenerated
    ),
    1
  );

  const totalListedForms = rankedUsers.reduce(
    (sum, user) => sum + user.totalFormsGenerated,
    0
  );

  /* =========================================================
     Search users
  ========================================================= */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return rankedUsers;

    return rankedUsers.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
  }, [rankedUsers, search]);

  /* =========================================================
     Loading states
  ========================================================= */

  const isLoading =
    summaryLoading ||
    trendLoading ||
    typeLoading ||
    usageLoading;

  const isRefreshing =
    summaryFetching ||
    trendFetching ||
    typeFetching ||
    usageFetching;

  /* =========================================================
     Refresh
  ========================================================= */

  const refreshAll = () => {
    refetchSummary();
    refetchTrend();
    refetchType();
    refetchUsage();
  };

  /* =========================================================
     KPI Stats
  ========================================================= */

  const stats = [
    {
      title: "Total Forms",
      value: summary?.totalFormsGenerated ?? 0,
      icon: FileText,
    },
    {
      title: "Forms Today",
      value: summary?.formsToday ?? 0,
      icon: Activity,
    },
    {
      title: "This Month",
      value: summary?.formsThisMonth ?? 0,
      icon: TrendingUp,
    },
  ];

  return (
    <main className="min-h-screen bg-[#E8F3EF]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-3 sm:px-5 lg:px-6">

        {/* =====================================================
            Header
        ===================================================== */}

        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#005F4E] text-white">
              <BarChart3 size={18} />
            </div>

            <div>
              <h1 className="text-lg font-bold leading-tight text-[#111D1A]">
                Analytics
              </h1>

              <p className="hidden text-xs text-[#71817C] sm:block">
                Analyze form generation and user usage activity
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={refreshAll}
            disabled={isRefreshing}
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[#D5E4DF] bg-white px-3 text-xs font-medium text-[#005F4E] transition hover:bg-[#F3F8F6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={
                isRefreshing ? "animate-spin" : ""
              }
            />

            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* =====================================================
            KPI Cards
        ===================================================== */}

        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className={`${cardClass} flex items-center justify-between px-4 py-3`}
              >
                <div>
                  <p className="text-xs font-medium text-[#71817C]">
                    {stat.title}
                  </p>

                  {isLoading ? (
                    <div className="mt-1 h-6 w-14 animate-pulse rounded bg-[#E8F3EF]" />
                  ) : (
                    <p className="text-xl font-bold leading-tight text-[#111D1A]">
                      {stat.value.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F3EF] text-[#005F4E]">
                  <Icon size={17} />
                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            Main Content
        ===================================================== */}

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.9fr_1fr]">

          {/* ===================================================
              USER FORM USAGE
          =================================================== */}

          <section
            className={`${cardClass} flex flex-col overflow-hidden`}
          >
            {/* Card Header */}

            <div className="flex flex-col gap-3 border-b border-[#D5E4DF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#005F4E] text-white">
                  <Users size={19} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-[#111D1A]">
                    User Form Usage
                  </h2>

                  <p className="text-xs text-[#71817C]">
                    Top {USER_USAGE_PAGE_SIZE} users by forms generated
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">

                {/* Period Filter */}

                <PeriodFilter
                  value={period}
                  onChange={setPeriod}
                />

                {/* Custom Date Range */}

                {period === "custom" && (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="date"
                      aria-label="Start date"
                      value={startDate}
                      max={endDate || undefined}
                      onChange={(e) =>
                        setStartDate(e.target.value)
                      }
                      className="h-9 rounded-lg border border-[#D5E4DF] bg-[#FAFCFB] px-2 text-xs text-[#111D1A] outline-none focus:border-[#005F4E] focus:bg-white"
                    />

                    <span className="text-xs text-[#71817C]">
                      to
                    </span>

                    <input
                      type="date"
                      aria-label="End date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(e) =>
                        setEndDate(e.target.value)
                      }
                      className="h-9 rounded-lg border border-[#D5E4DF] bg-[#FAFCFB] px-2 text-xs text-[#111D1A] outline-none focus:border-[#005F4E] focus:bg-white"
                    />
                  </div>
                )}

                {/* Search */}

                <div className="relative w-full sm:w-56">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#71817C]"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search name or email"
                    className="h-9 w-full rounded-lg border border-[#D5E4DF] bg-[#FAFCFB] pl-9 pr-3 text-xs text-[#111D1A] outline-none transition placeholder:text-[#71817C] focus:border-[#005F4E] focus:bg-white focus:ring-2 focus:ring-[#005F4E]/10"
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                Table
            ================================================= */}

            <div className="max-h-[560px] flex-1 overflow-auto">
              <table className="w-full min-w-[560px] border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-[#D5E4DF] bg-[#FAFCFB]">
                    <th className="w-16 px-5 py-3 text-left text-[11px] font-semibold text-[#005F4E]">
                      Rank
                    </th>

                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#005F4E]">
                      User
                    </th>

                    <th className="hidden w-[30%] px-4 py-3 text-left text-[11px] font-semibold text-[#005F4E] md:table-cell">
                      Usage
                    </th>

                    <th className="w-36 px-5 py-3 text-right text-[11px] font-semibold text-[#005F4E]">
                      Forms Generated
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {usageLoading ? (
                    Array.from({ length: 6 }).map(
                      (_, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#EDF2F0]"
                        >
                          <td className="px-5 py-3.5">
                            <div className="h-6 w-6 animate-pulse rounded-full bg-[#E8F3EF]" />
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 animate-pulse rounded-full bg-[#E8F3EF]" />

                              <div>
                                <div className="h-3 w-28 animate-pulse rounded bg-[#E8F3EF]" />

                                <div className="mt-2 h-2.5 w-40 animate-pulse rounded bg-[#E8F3EF]" />
                              </div>
                            </div>
                          </td>

                          <td className="hidden px-4 py-3.5 md:table-cell">
                            <div className="h-2 w-full animate-pulse rounded bg-[#E8F3EF]" />
                          </td>

                          <td className="px-5 py-3.5">
                            <div className="ml-auto h-4 w-12 animate-pulse rounded bg-[#E8F3EF]" />
                          </td>
                        </tr>
                      )
                    )
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F3EF] text-[#71817C]">
                            <Users size={21} />
                          </div>

                          <p className="mt-3 text-sm font-medium text-[#111D1A]">
                            {search
                              ? "No matching users"
                              : "No user usage data"}
                          </p>

                          <p className="mt-1 text-xs text-[#71817C]">
                            {search
                              ? "Try a different name or email."
                              : "User form activity will appear here."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const progress =
                        (user.totalFormsGenerated /
                          maxForms) *
                        100;

                      return (
                        <tr
                          key={user.userId}
                          className="border-b border-[#EDF2F0] transition last:border-b-0 hover:bg-[#F6FAF8]"
                        >
                          {/* Rank */}

                          <td className="px-5 py-3">
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                                RANK_STYLES[user.rank - 1] ??
                                "bg-transparent font-medium text-[#71817C]"
                              }`}
                            >
                              {user.rank}
                            </span>
                          </td>

                          {/* User */}

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F3EF] text-sm font-semibold text-[#005F4E]">
                                {user.name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "U"}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[240px] truncate text-sm font-semibold text-[#111D1A]">
                                  {user.name}
                                </p>

                                <p className="max-w-[240px] truncate text-xs text-[#71817C]">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Usage */}

                          <td className="hidden px-4 py-3 md:table-cell">
                            <div className="h-2 overflow-hidden rounded-full bg-[#E8F3EF]">
                              <div
                                className="h-full rounded-full bg-[#005F4E] transition-all duration-500"
                                style={{
                                  width: `${progress}%`,
                                }}
                              />
                            </div>
                          </td>

                          {/* Forms */}

                          <td className="px-5 py-3 text-right">
                            <span className="inline-flex min-w-[56px] items-center justify-center rounded-lg bg-[#E8F3EF] px-3 py-1 text-sm font-bold text-[#005F4E]">
                              {user.totalFormsGenerated.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* =================================================
                Footer
            ================================================= */}

            {!usageLoading &&
              rankedUsers.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#D5E4DF] bg-[#FAFCFB] px-5 py-3">
                  <p className="text-xs text-[#71817C]">
                    Showing{" "}
                    <span className="font-semibold text-[#111D1A]">
                      {filteredUsers.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-[#111D1A]">
                      {rankedUsers.length}
                    </span>{" "}
                    users
                  </p>

                  <p className="text-xs text-[#71817C]">
                    Combined forms:{" "}
                    <span className="font-semibold text-[#005F4E]">
                      {totalListedForms.toLocaleString()}
                    </span>
                  </p>
                </div>
              )}
          </section>

          {/* =================================================
              SIDE CHARTS
          ================================================= */}

          <div className="flex flex-col gap-3">

            {/* Monthly Trends */}

            <ChartCard
              title="Monthly Form Trends"
              description="Form generation activity over time"
              heightClass="h-[230px]"
            >
              {trendLoading ? (
                <ChartSkeleton />
              ) : monthlyTrends.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={monthlyTrends}
                    margin={{
                      top: 8,
                      right: 8,
                      left: -22,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="formsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={COLORS.primary}
                          stopOpacity={0.25}
                        />

                        <stop
                          offset="100%"
                          stopColor={COLORS.primary}
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke={COLORS.grid}
                      vertical={false}
                    />

                    <XAxis
                      dataKey="month"
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={tooltipStyle}
                    />

                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke={COLORS.primary}
                      strokeWidth={2}
                      fill="url(#formsGradient)"
                      activeDot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Forms by Type */}

            <ChartCard
              title="Forms by Type"
              description="Distribution of generated forms"
              heightClass="h-[230px]"
            >
              {typeLoading ? (
                <ChartSkeleton />
              ) : formTypes.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={formTypes}
                    layout="vertical"
                    margin={{
                      top: 0,
                      right: 12,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      stroke={COLORS.grid}
                      horizontal={false}
                    />

                    <XAxis
                      type="number"
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="formType"
                      width={90}
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={tooltipStyle}
                    />

                    <Bar
                      dataKey="count"
                      fill={COLORS.primary}
                      radius={[0, 5, 5, 0]}
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   Period Filter
========================================================= */

/*
  Dropdown:
  - Opens on hover
  - Opens on click
  - Works with keyboard
  - Smooth fade + slide + scale animation
  - Slightly wider dropdown
*/

function PeriodFilter({
  value,
  onChange,
}: {
  value: Period;
  onChange: (value: Period) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const current =
    PERIOD_OPTIONS.find(
      (option) => option.value === value
    ) ?? PERIOD_OPTIONS[0];

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
        }
      }}
    >
      {/* =========================
          Trigger Button
      ========================= */}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`inline-flex h-9 w-40 items-center justify-between gap-2 rounded-lg border bg-[#FAFCFB] px-3 text-xs font-medium text-[#111D1A] outline-none transition-all duration-300 ${
          open
            ? "border-[#005F4E] bg-white ring-2 ring-[#005F4E]/10"
            : "border-[#D5E4DF] hover:border-[#005F4E]/50"
        }`}
      >
        <span className="truncate">
          {current.label}
        </span>

        <ChevronDown
          size={15}
          className={`shrink-0 text-[#71817C] transition-transform duration-300 ease-out ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* =========================
          Dropdown
      ========================= */}

      <div
        className={`absolute left-0 top-full z-30 pt-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        <ul
          role="listbox"
          className="w-40 overflow-hidden rounded-xl border border-[#D5E4DF] bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
        >
          {PERIOD_OPTIONS.map((option) => {
            const selected = option.value === value;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={selected}
              >
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex h-9 w-full items-center justify-between rounded-lg px-3 text-left text-xs transition-all duration-200 ${
                    selected
                      ? "bg-[#E8F3EF] font-semibold text-[#005F4E]"
                      : "text-[#111D1A] hover:bg-[#F3F8F6]"
                  }`}
                >
                  <span>{option.label}</span>

                  {selected && (
                    <Check
                      size={14}
                      className="shrink-0"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
/* =========================================================
   Chart Card
========================================================= */

function ChartCard({
  title,
  description,
  heightClass,
  children,
}: {
  title: string;
  description: string;
  heightClass: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`${cardClass} overflow-hidden`}
    >
      <div className="border-b border-[#D5E4DF] px-4 py-2.5">
        <h2 className="text-sm font-semibold text-[#111D1A]">
          {title}
        </h2>

        <p className="text-[11px] text-[#71817C]">
          {description}
        </p>
      </div>

      <div className={`${heightClass} p-3`}>
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   Chart Skeleton
========================================================= */

function ChartSkeleton() {
  return (
    <div className="flex h-full items-end gap-2">
      {Array.from({ length: 8 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex-1 animate-pulse rounded-t-md bg-[#E8F3EF]"
            style={{
              height: `${35 + (index % 4) * 14}%`,
            }}
          />
        )
      )}
    </div>
  );
}

/* =========================================================
   Empty Chart
========================================================= */

function EmptyChart() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3EF] text-[#71817C]">
        <BarChart3 size={18} />
      </div>

      <p className="mt-2 text-sm font-medium text-[#111D1A]">
        No data available
      </p>

      <p className="mt-0.5 text-xs text-[#71817C]">
        Data will appear here when available.
      </p>
    </div>
  );
}