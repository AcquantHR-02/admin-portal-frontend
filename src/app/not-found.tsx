import Link from "next/link";
import {
  ArrowLeft,
  CircleAlert,
  GitBranch,
  Home,
  Radio,
  Route,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="h-[100dvh] overflow-hidden bg-[#f7f9f8] text-[#102526]">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `
            linear-gradient(#dfe8e6 1px, transparent 1px),
            linear-gradient(90deg, #dfe8e6 1px, transparent 1px)
          `,
          backgroundSize: "42px 42px",
        }}
      />

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dcefeb] opacity-60 blur-3xl" />

      <div className="relative flex h-full items-center justify-center px-5">
        <div className="w-full max-w-4xl">

          {/* Top status */}
          <div className="mb-5 flex items-center justify-center gap-2 text-xs font-medium text-[#718281] sm:mb-6 sm:text-sm">
            <Radio size={14} className="text-[#3c8178]" />

            <span>ADMIN PORTAL</span>

            <span className="mx-1 h-1 w-1 rounded-full bg-[#aab9b6]" />

            <span className="hidden text-[#9aa9a7] sm:inline">
              SYSTEM STATUS
            </span>

            <span className="flex items-center gap-1.5 text-[#3c8178]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3c8178]" />
              ONLINE
            </span>
          </div>

          {/* Main area */}
          <div className="relative mx-auto max-w-3xl">

            {/* Left node */}
            <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 md:block">
              <div className="w-40 rounded-2xl border border-[#dfe8e6] bg-white p-3.5 shadow-[0_10px_35px_rgba(16,37,38,0.05)]">
                <div className="mb-2.5 flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef6f4] text-[#3c8178]">
                    <Home size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#102526]">
                      Dashboard
                    </p>
                    <p className="text-[10px] text-[#91a09e]">
                      Entry point
                    </p>
                  </div>
                </div>

                <div className="h-1.5 w-full rounded-full bg-[#e7eeec]" />
                <div className="mt-2 h-1.5 w-2/3 rounded-full bg-[#edf2f1]" />
              </div>
            </div>

            {/* Right node */}
            <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 md:block">
              <div className="w-40 rounded-2xl border border-[#eadede] bg-white p-3.5 shadow-[0_10px_35px_rgba(16,37,38,0.05)]">
                <div className="mb-2.5 flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff2f1] text-[#c56b63]">
                    <CircleAlert size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#102526]">
                      Requested Route
                    </p>
                    <p className="text-[10px] text-[#c56b63]">
                      Not found
                    </p>
                  </div>
                </div>

                <div className="h-1.5 w-full rounded-full bg-[#f3e7e6]" />
                <div className="mt-2 h-1.5 w-1/2 rounded-full bg-[#f7eded]" />
              </div>
            </div>

            {/* Connection */}
            <div className="absolute left-[18%] right-[18%] top-1/2 hidden -translate-y-1/2 items-center md:flex">
              <div className="h-px flex-1 border-t border-dashed border-[#b8c8c5]" />

              <div className="mx-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#e5c7c4] bg-white text-[#c56b63] shadow-sm">
                <GitBranch size={16} />
              </div>

              <div className="h-px flex-1 border-t border-dashed border-[#e5c8c5]" />
            </div>

            {/* Center card */}
            <div className="relative mx-auto w-full max-w-[390px] rounded-[24px] border border-[#dfe8e6] bg-white px-6 py-6 text-center shadow-[0_20px_60px_rgba(16,37,38,0.08)] sm:px-8 sm:py-7">

              {/* Icon */}
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#e6eeec] bg-[#f6faf9] text-[#3c8178]">
                <Route size={21} strokeWidth={1.8} />
              </div>

              {/* 404 */}
              <div className="text-[64px] font-bold leading-none tracking-[-0.07em] text-[#102526] sm:text-[72px]">
                404
              </div>

              {/* Status */}
              <div className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border border-[#f0dddd] bg-[#fff8f7] px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c56b63]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#b45f58]">
                  Route Disconnected
                </span>
              </div>

              {/* Heading */}
              <h1 className="mt-4 text-lg font-semibold tracking-tight text-[#102526] sm:text-xl">
                Looks like you took a wrong turn.
              </h1>

              {/* Description */}
              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#718281] sm:text-sm">
                {"The page you're looking for doesn't exist, has been moved,"}
                {"or the route is no longer available."}
              </p>

              {/* Route */}
              <div className="mx-auto mt-4 flex max-w-xs items-center justify-center gap-2 rounded-lg border border-[#e7eeec] bg-[#f8faf9] px-3 py-2.5">
                <span className="text-[10px] text-[#8b9997]">
                  REQUEST
                </span>

                <span className="h-3.5 w-px bg-[#d8e2df]" />

                <code className="truncate text-[11px] font-medium text-[#526462]">
                  /unknown-route
                </code>
              </div>

              {/* Button */}
              <Link
                href="/dashboard"
                className="mx-auto mt-5 inline-flex items-center gap-2 rounded-lg bg-[#102526] px-4 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1c3a3b] hover:shadow-lg sm:text-sm"
              >
                <ArrowLeft size={15} />
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Bottom status */}
          <div className="mt-5 flex items-center justify-center gap-4 text-[10px] text-[#9aa9a7] sm:mt-6 sm:text-[11px]">
            <span>ERROR CODE: 404</span>

            <span className="h-1 w-1 rounded-full bg-[#c5d0ce]" />

            <span>ROUTE NOT FOUND</span>

            <span className="hidden h-1 w-1 rounded-full bg-[#c5d0ce] sm:block" />

            <span className="hidden sm:inline">ADMIN SYSTEM</span>
          </div>
        </div>
      </div>
    </main>
  );
}