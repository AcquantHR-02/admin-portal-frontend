"use client";

import { FileText, UserCheck, Users } from "lucide-react";

import QuickActions from "@/components/dashboard/QuickActions";
import StatCard from "@/components/dashboard/StatCard";
import UsageChart from "@/components/dashboard/UsageChart";
import UserStatusChart from "@/components/dashboard/UserStatusChart";

import { useCurrentUser } from "@/hooks/Usecurrentuser";
import { useGetUsersQuery } from "@/api/usersApi";
import {
  useGetFormsSummaryQuery,
  useGetUserStatusSummaryQuery,
} from "@/api/analyticsApi";

/* Shows "..." while loading, "—" on error, otherwise a formatted number */
function formatStat(loading: boolean, error: boolean, value: number) {
  if (loading) return "...";
  if (error) return "—";
  return value.toLocaleString();
}

export default function DashboardPage() {
  const { firstName, greeting } = useCurrentUser();

  /* ---------- Users ---------- */

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useGetUsersQuery({
    page: 0,
    size: 1,
    sortBy: "id",
    sortDir: "asc",
  });

  /* ---------- User status ---------- */

  const {
    data: statusData,
    isLoading: statusLoading,
    isError: statusError,
  } = useGetUserStatusSummaryQuery();

  /* ---------- Forms ---------- */

  const {
    data: formsData,
    isLoading: formsLoading,
    isError: formsError,
  } = useGetFormsSummaryQuery();

  /* ---------- Values ---------- */

  const totalUsers = usersData?.data?.totalElements ?? 0;
  const activeUsers = statusData?.data?.totalActiveUsers ?? 0;
  const totalForms = formsData?.data?.totalFormsGenerated ?? 0;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-[1600px] p-3 sm:p-4 lg:p-5">
      {/* Welcome */}
      <section className="mb-3 flex flex-col gap-0.5 sm:mb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            suppressHydrationWarning
            className="text-xl font-semibold tracking-tight text-[#102526]"
          >
            {greeting},{" "}
            <span className="text-[#005F4E]  decoration-[#22C08A]/70 decoration-wavy decoration-1 underline-offset-[6px]">
              {firstName}
            </span>
          </h1>
          <p className="mt-0.5 text-xs text-[#718281] sm:text-sm">
            Here&apos;s what&apos;s happening in your admin workspace.
          </p>
        </div>

        <p
          suppressHydrationWarning
          className="text-xs font-medium text-[#8a9997] sm:text-sm"
        >
          {today}
        </p>
      </section>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          featured
          title="Total Users"
          value={formatStat(usersLoading, usersError, totalUsers)}
          description="Total registered users"
          icon={Users}
        />

        <StatCard
          title="Active Users"
          value={formatStat(statusLoading, statusError, activeUsers)}
          description="Currently active accounts"
          icon={UserCheck}
        />

        <StatCard
          title="Forms"
          value={formatStat(formsLoading, formsError, totalForms)}
          description="Total forms generated"
          icon={FileText}
        />
      </section>

      {/* Charts */}
      <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.7fr_1fr]">
        <UsageChart />
        <UserStatusChart />
      </section>

      {/* Quick Actions */}
      <section className="mt-3">
        <QuickActions />
      </section>
    </main>
  );
}