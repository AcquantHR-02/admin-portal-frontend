"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useGetUserStatusSummaryQuery } from "@/api/analyticsApi";

const ACTIVE = "#005F4E";
const INACTIVE = "#E4572E";

export default function UserStatusChart() {
  const { data, isLoading, isError } = useGetUserStatusSummaryQuery();

  const summary = data?.data;

  const active = summary?.totalActiveUsers ?? 0;
  const inactive = summary?.totalInactiveUsers ?? 0;
  const totalUsers = active + inactive;

  const activePct = totalUsers > 0 ? Math.round((active / totalUsers) * 100) : 0;
  const inactivePct = totalUsers > 0 ? 100 - activePct : 0;

  const chartData =
    totalUsers > 0
      ? [
          { name: "Active", value: active },
          { name: "Inactive", value: inactive },
        ]
      : [{ name: "No users", value: 1 }];

  const rows = [
    { label: "Active", count: active, pct: activePct, color: ACTIVE },
    { label: "Inactive", count: inactive, pct: inactivePct, color: INACTIVE },
  ];

  return (
    <div className="rounded-2xl border border-[#dfe8e6] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#102526]">User Status</h3>
          <p className="mt-1 text-xs text-[#8a9997]">
            Active and inactive user distribution.
          </p>
        </div>

        {!isLoading && !isError && (
          <span className="rounded-full bg-[#eef6f4] px-2.5 py-1 text-[11px] font-semibold tabular-nums text-[#005F4E]">
            {totalUsers.toLocaleString()} users
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex h-[160px] flex-col items-center justify-center gap-4">
          <div className="h-[140px] w-[140px] animate-pulse rounded-full border-[16px] border-[#eef3f1]" />
          <div className="h-3 w-40 animate-pulse rounded bg-[#eef3f1]" />
        </div>
      ) : isError ? (
        <div className="flex h-[160px] items-center justify-center text-sm text-[#8a9997]">
          Unable to load user status.
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-4">
          {/* Donut */}
          <div className="relative h-[150px] w-[150px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={64}
                  paddingAngle={totalUsers > 0 ? 4 : 0}
                  cornerRadius={8}
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => {
                    const color =
                      totalUsers > 0
                        ? index === 0
                          ? ACTIVE
                          : INACTIVE
                        : "#eef3f1";

                    return (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={color}
                        style={{ fill: color }}
                        className={
                          totalUsers > 0
                            ? index === 0
                              ? "![fill:#005F4E]"
                              : "![fill:#E4572E]"
                            : "![fill:#eef3f1]"
                        }
                      />
                    );
                  })}
                </Pie>

                {totalUsers > 0 && (
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #dfe8e6",
                      fontSize: 12,
                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    }}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold tabular-nums tracking-tight text-[#102526]">
                {activePct}%
              </span>
              <span className="text-xs text-[#8a9997]">active</span>
            </div>
          </div>

          {/* Legend rows */}
          <div className="min-w-0 flex-1 space-y-2">
            {rows.map((row) => (
              <div
                key={row.label}
                className="rounded-lg bg-[#f6f9f8] px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: row.color }}
                    />
                    <span className="text-xs font-medium text-[#526461]">
                      {row.label}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-semibold tabular-nums text-[#102526]">
                      {row.count.toLocaleString()}
                    </span>
                    <span className="w-9 text-right text-[11px] tabular-nums text-[#8a9997]">
                      {row.pct}%
                    </span>
                  </div>
                </div>

                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${row.pct}%`, backgroundColor: row.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}