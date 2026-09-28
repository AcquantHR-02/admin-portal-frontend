"use client";

import { Activity, Clock3 } from "lucide-react";
import { useGetRecentActivityQuery } from "@/api/analyticsApi";

const GHOST_ROWS = [
  [62, 38],
  [48, 30],
];

function timeAgo(iso?: string) {
  if (!iso) return "";

  const time = new Date(iso).getTime();

  if (Number.isNaN(time)) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000));

  if (seconds < 60) return "Just now";

  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ago`;
  }

  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}h ago`;
  }

  if (seconds < 604800) {
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export default function RecentActivity() {
  const { data, isLoading, isError, refetch } = useGetRecentActivityQuery({});

  const items = data?.data ?? [];

  return (
    <div className="rounded-2xl border border-[#dfe8e6] bg-white p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef6f4] text-[#005F4E]">
            <Activity size={17} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#102526]">
              Recent Activity
            </h3>

            <p className="mt-0.5 text-xs text-[#8a9997]">
              Recent administrative activity from your workspace.
            </p>
          </div>
        </div>

        <Clock3
          size={17}
          strokeWidth={1.7}
          className="shrink-0 text-[#a0aeac]"
        />
      </div>

      {/* Body */}
      <div className="mt-3">
        {/* Loading */}
        {isLoading ?
          <div className="space-y-3 rounded-xl border border-[#e6eeec] bg-[#fafcfb] px-4 py-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <span className="mt-1 h-[11px] w-[11px] shrink-0 animate-pulse rounded-full bg-[#dfe8e6]" />

                <div className="flex-1 space-y-2">
                  <div className="h-2.5 w-3/5 animate-pulse rounded-full bg-[#e8efed]" />

                  <div className="h-2 w-2/5 animate-pulse rounded-full bg-[#eff4f2]" />
                </div>
              </div>
            ))}
          </div>
        : isError ?
          /* Error */
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#dfe8e6] bg-[#fafcfb] px-4 py-6 text-center">
            <p className="text-sm font-semibold text-[#102526]">
              Unable to load activity
            </p>

            <p className="mt-1 text-xs text-[#8a9997]">
              Something went wrong while loading recent activity.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-lg border border-[#dfe8e6] bg-white px-3 py-1.5 text-xs font-medium text-[#005F4E] transition hover:bg-[#f3f8f6]"
            >
              Try again
            </button>
          </div>
        : items.length === 0 ?
          /* Empty */
          <div className="relative overflow-hidden rounded-xl border border-[#e6eeec] bg-[#fafcfb] px-4 py-3">
            <div className="relative space-y-3">
              <div className="absolute bottom-3 left-[5px] top-3 w-px bg-[#e3ecea]" />

              {GHOST_ROWS.map(([title, sub], index) => (
                <div
                  key={index}
                  className="relative flex items-start gap-4"
                  style={{
                    opacity: 1 - index * 0.28,
                  }}
                >
                  <span className="relative z-10 mt-1 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-[#cfdcd8] bg-[#fafcfb]" />

                  <div className="flex-1 space-y-2">
                    <div
                      className="h-2.5 rounded-full bg-[#e8efed]"
                      style={{
                        width: `${title}%`,
                      }}
                    />

                    <div
                      className="h-2 rounded-full bg-[#eff4f2]"
                      style={{
                        width: `${sub}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 border-t border-dashed border-[#dfe8e6] pt-3 text-center">
              <p className="text-sm font-semibold text-[#102526]">
                No recent activity
              </p>

              <p className="mt-1 text-xs text-[#8a9997]">
                Administrative actions will be listed here as they happen.
              </p>
            </div>
          </div>
        : /* Activity List */
          <ol className="relative space-y-1">
            <div className="absolute bottom-4 left-[5px] top-4 w-px bg-[#e3ecea]" />

            {items.map((item) => {
              const activityTime = timeAgo(item.createdAt);

              return (
                <li
                  key={item.id}
                  className="relative flex items-start gap-4 rounded-lg px-1 py-2 transition hover:bg-[#f6f9f8]"
                >
                  <span className="relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-[#005F4E] bg-white" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#102526]">
                      {item.action}
                    </p>

                    {item.description && (
                      <p className="mt-0.5 truncate text-xs text-[#526461]">
                        {item.description}
                      </p>
                    )}

                    {activityTime && (
                      <p className="mt-0.5 text-[11px] text-[#9aa9a7]">
                        {activityTime}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        }
      </div>
    </div>
  );
}
