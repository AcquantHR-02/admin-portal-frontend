"use client";

import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetMonthlyTrendsQuery } from "@/api/analyticsApi";

const RANGES = [
  { value: 3, label: "3M" },
  { value: 6, label: "6M" },
  { value: 12, label: "12M" },
] as const;

type Range = (typeof RANGES)[number]["value"];

const GHOST_BARS = [38, 52, 44, 68, 58, 76, 62, 84, 70, 92, 78, 66];

const axisTick = { fill: "#71817C", fontSize: 11 };

export default function UsageChart() {
  const [range, setRange] = useState<Range>(6);

  const { data, isLoading, isError, refetch } = useGetMonthlyTrendsQuery();

  /* Build the last N month labels (YYYY-MM), ending at the current month */
  function getLastNMonthLabels(n: number): string[] {
    const labels: string[] = [];
    const now = new Date();

    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      labels.push(label);
    }

    return labels;
  }

  /* Show the last N months, filling in any month the API didn't return with count: 0 */
  const visible = useMemo(() => {
    const monthLabels = getLastNMonthLabels(range);
    const byMonth = new Map(
      (data?.data ?? []).map((item) => [item.month, item])
    );

    return monthLabels.map(
      (month) => byMonth.get(month) ?? { month, count: 0 }
    );
  }, [data, range]);

  const total = useMemo(
    () => visible.reduce((sum, item) => sum + (item.count ?? 0), 0),
    [visible]
  );

  const isEmpty = !isLoading && !isError && (data?.data ?? []).length === 0;

  return (
    <div className="rounded-2xl border border-[#dfe8e6] bg-white p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef6f4] text-[#005F4E]">
            <BarChart3 size={17} strokeWidth={1.8} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#102526]">
              Usage Overview
            </h3>
            <p className="mt-0.5 text-xs text-[#8a9997]">
              {isLoading || isError || isEmpty ? (
                "Form usage and activity trends over time."
              ) : (
                <>
                  <span className="font-semibold tabular-nums text-[#005F4E]">
                    {total.toLocaleString()}
                  </span>{" "}
                  forms in the last {visible.length} months
                </>
              )}
            </p>
          </div>
        </div>

        {/* Segmented range filter */}
        <div
          role="tablist"
          aria-label="Time range"
          className="flex shrink-0 rounded-lg bg-[#f1f5f4] p-0.5"
        >
          {RANGES.map((item) => {
            const selected = item.value === range;

            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setRange(item.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  selected
                    ? "bg-white text-[#005F4E] shadow-sm"
                    : "text-[#718281] hover:text-[#102526]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="mt-3 h-[190px]">
        {isLoading ? (
          <div className="flex h-full items-end gap-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex-1 animate-pulse rounded-t-md bg-[#eef3f1]"
                style={{ height: `${35 + (index % 4) * 14}%` }}
              />
            ))}
          </div>
        ) : isError ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-[#dfe8e6] bg-[#fafcfb] text-center">
            <p className="text-sm font-semibold text-[#102526]">
              Unable to load usage data
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 rounded-lg border border-[#dfe8e6] bg-white px-3 py-1.5 text-xs font-medium text-[#005F4E] transition hover:bg-[#f3f8f6]"
            >
              Try again
            </button>
          </div>
        ) : isEmpty ? (
          <div className="relative h-full overflow-hidden rounded-xl border border-[#e6eeec] bg-[#fafcfb]">
            <div className="pointer-events-none absolute inset-x-6 bottom-0 flex h-full items-end gap-2.5">
              {GHOST_BARS.map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-[#005F4E]/[0.09] to-[#005F4E]/0"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-xl border border-[#dfe8e6] bg-white/90 px-5 py-3 text-center shadow-[0_6px_20px_rgba(16,37,38,0.05)] backdrop-blur-sm">
                <p className="text-sm font-semibold text-[#102526]">
                  No analytics data yet
                </p>
                <p className="mt-1 text-xs text-[#8a9997]">
                  Usage will show up here once forms are generated.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={visible}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#005F4E" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#005F4E" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#E3ECE9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={axisTick}
                axisLine={false}
                tickLine={false}
                padding={{ left: 24, right: 16 }}
              />
              <YAxis
                tick={axisTick}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #dfe8e6",
                  fontSize: 12,
                  padding: "6px 10px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Forms"
                stroke="#005F4E"
                strokeWidth={2.5}
                fill="url(#usageGradient)"
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}