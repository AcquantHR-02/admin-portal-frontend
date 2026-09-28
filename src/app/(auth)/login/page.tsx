"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  ShieldCheck,
  Headset,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLoginMutation } from "@/api/authApi";

/**
 * Small reusable hook that "types out" a string character by character.
 * Used for the "Welcome to AcquantHR Portal" heading animation.
 *
 * speed  -> ms delay between each character
 * startDelay -> optional ms delay before typing starts (nice for page load)
 */
function useTypewriter(text: string, speed = 45, startDelay = 150) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let charIndex = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        charIndex += 1;
        setDisplayedText(text.slice(0, charIndex));

        if (charIndex >= text.length) {
          clearInterval(intervalId);
          setIsDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayedText, isDone };
}

export default function LoginPage() {
  const router = useRouter();

  const [login, { isLoading, error }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const { displayedText: welcomeText, isDone: welcomeDone } = useTypewriter(
    "Welcome to AcquantHR Portal",
    40,
    200
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await login({
        email,
        password,
      }).unwrap();

      sessionStorage.setItem("authToken", response.data.token);
      sessionStorage.setItem("userName", response.data.name);

      router.replace("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const getErrorMessage = () => {
    if (!error) return "";

    if ("status" in error) {
      if (error.status === 401) {
        return "Invalid email or password.";
      }

      if (error.status === 403) {
        return "You are not authorized to access the admin portal.";
      }

      if (typeof error.status === "number" && error.status >= 500) {
        return "Server error. Please try again later.";
      }
    }

    return "Unable to sign in. Please check your details and try again.";
  };

  return (
    <main className="h-screen overflow-hidden bg-[#f3f6f5] text-[#0f1e1f]">
      <div className="flex h-full items-center justify-center p-3 sm:p-6">
        <div className="grid h-[88vh] max-h-[560px] w-full max-w-[840px] overflow-hidden rounded-[16px] border border-[#e1e8e6] bg-white shadow-[0_20px_60px_rgba(15,30,31,0.10)] lg:grid-cols-[0.95fr_1.15fr]">
          {/* LEFT - BRANDING */}
          <section className="relative hidden overflow-hidden bg-[#0b3c5d] lg:flex">
            {/* Decorative shapes */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.04]" />
            <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-white/[0.04]" />

            <div className="relative z-10 flex h-full w-full flex-col justify-between px-7 py-7 xl:px-8">
              {/* Tag */}
              <div>
                <span className="inline-block rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[9px] font-semibold tracking-[0.14em] text-white/80">
                  STATUTORY INTELLIGENCE SUITE
                </span>

                <h2 className="mt-3 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
                  Smart HR Solutions for a
                  <br />
                  Smarter Workplace.
                </h2>

                <p className="mt-2 max-w-[320px] text-[12px] leading-5 text-white/65">
                  End-to-end statutory governance, labor law automation, and
                  institutional payroll processing built for modern corporate
                  operations.
                </p>

                {/* Stats */}
                <div className="mt-4 flex gap-2.5">
                  <div className="rounded-xl bg-white/10 px-3 py-2.5">
                    <p className="text-[17px] font-bold text-white">2,000+</p>
                    <p className="mt-0.5 text-[10px] leading-3.5 text-white/60">
                      Labour Law Compliances
                      <br />
                      Automated
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/10 px-3 py-2.5">
                    <p className="text-[17px] font-bold text-white">67+</p>
                    <p className="mt-0.5 text-[10px] leading-3.5 text-white/60">
                      Enterprise Clients Onboarded
                    </p>
                  </div>
                </div>

                {/* Audit box */}
                <div className="mt-4 max-w-[320px] rounded-xl border border-white/10 bg-white/[0.06] p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-white/70" />
                      <span className="text-[10px] font-semibold tracking-wide text-white/80">
                        AUDIT &amp; GOVERNANCE VALIDATED
                      </span>
                    </div>

                    <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[9px] font-semibold text-emerald-300">
                      ACTIVE
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-white/10 px-2 py-1 text-[9px] text-white/70">
                      SOC 2 Type II Certified
                    </span>
                    <span className="rounded-md bg-white/10 px-2 py-1 text-[9px] text-white/70">
                      Statutory ISO 9001
                    </span>
                    <span className="rounded-md bg-white/10 px-2 py-1 text-[9px] text-white/70">
                      POSH Reconciled
                    </span>
                  </div>
                </div>
              </div>

              {/* Testimonial + footer */}
              <div>
                <div className="mb-1.5 text-[12px] text-amber-400">★★★★★</div>
                <p className="text-[9px] font-semibold tracking-wide text-white/60">
                  100% Measurable Results &amp; ROI
                </p>
                <p className="mt-1.5 max-w-[320px] text-[11px] italic leading-4 text-white/55">
                  &ldquo;AcquantHR turned our multi-state statutory audits
                  from high-risk bottlenecks into predictable, push-button
                  reconciliations.&rdquo;
                </p>

                <div className="mt-3 flex items-center justify-between text-[10px] text-white/40">
                  <span>Corporate Bangalore HQ</span>
                  <span>Est. 2025</span>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT - LOGIN FORM */}
          <section className="flex h-full flex-col justify-center overflow-y-auto px-6 py-6 sm:px-8 lg:px-10">
            <div className="mx-auto w-full max-w-[360px]">
              {/* Logo + status */}
              <div className="mb-4 flex items-center justify-between">
                <Image
                  src="/acquanthr-logo.png"
                  alt="AcquantHR"
                  width={130}
                  height={34}
                  loading="eager"
                  className="h-7 w-auto object-contain"
                />

                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  All Systems Operational
                </span>
              </div>

              {/* Animated heading */}
              <h1 className="min-h-[24px] text-[19px] font-semibold tracking-[-0.02em] text-[#0f1e1f]">
                {welcomeText}
                <span
                  className={`ml-0.5 inline-block w-[2px] translate-y-[2px] bg-[#0b3c5d] ${
                    welcomeDone ? "animate-pulse" : ""
                  }`}
                  style={{ height: "1em" }}
                />
              </h1>

              <p className="mt-1.5 text-[12px] leading-4 text-[#718281]">
                Sign in to access your enterprise statutory compliance &amp;
                payroll dashboard.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                {/* Email */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label
                      htmlFor="email"
                      className="text-[11px] font-medium text-[#344849]"
                    >
                      Work Email <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[9px] text-[#95a3a1]">
                      Corporate Domain Required
                    </span>
                  </div>

                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#91a09f]"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@company.com"
                      autoComplete="email"
                      required
                      className="h-9 w-full rounded-lg border border-[#d9e3e1] bg-[#fbfcfc] pl-9 pr-3 text-[12px] text-[#102526] outline-none transition placeholder:text-[#a0acab] focus:border-[#0b3c5d] focus:bg-white focus:ring-2 focus:ring-[#0b3c5d]/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-[11px] font-medium text-[#344849]"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>

                    <button
                      type="button"
                      className="text-[10px] font-medium text-[#0b3c5d] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#91a09f]"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="h-9 w-full rounded-lg border border-[#d9e3e1] bg-[#fbfcfc] pl-9 pr-10 text-[12px] text-[#102526] outline-none transition placeholder:text-[#a0acab] focus:border-[#0b3c5d] focus:bg-white focus:ring-2 focus:ring-[#0b3c5d]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#91a09f] transition hover:text-[#0b3c5d]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Keep me signed in */}
                <label className="flex cursor-pointer items-center gap-2 text-[11px] text-[#5b6c6a]">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(event) => setKeepSignedIn(event.target.checked)}
                    className="h-3.5 w-3.5 rounded border-[#c7d3d1] text-[#0b3c5d] focus:ring-[#0b3c5d]/30"
                  />
                  Keep me signed in for 30 days
                </label>

                {/* API Error */}
                {getErrorMessage() && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-600">
                    {getErrorMessage()}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#0b3c5d] text-[12px] font-medium text-white transition hover:bg-[#092e47] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign In to Portal
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-3.5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e5ebea]" />
                <span className="text-[9px] font-medium tracking-wide text-[#95a3a1]">
                  OR SIGN IN WITH ENTERPRISE CREDENTIALS
                </span>
                <div className="h-px flex-1 bg-[#e5ebea]" />
              </div>

              {/* SSO */}
              <button
                type="button"
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#d9e3e1] bg-white text-[12px] font-medium text-[#0b3c5d] transition hover:bg-[#f7faf9]"
              >
                <Building2 size={14} />
                Continue with SAML SSO / Okta
              </button>

              {/* Security note */}
              <div className="mt-4 flex items-center justify-between text-[10px] text-[#899795]">
                <span className="flex items-center gap-1.5">
                  <LockKeyhole size={12} />
                  256-bit Bank-Grade Encryption
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Session ID: ACQ-7029X-V
                </span>
              </div>

              {/* Support */}
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#f2f7f6] px-3 py-2 text-[10px] leading-4 text-[#5b6c6a]">
                <Headset size={13} className="mt-[1px] shrink-0" />
                <span>
                  Having trouble logging in? Contact IT Support at{" "}
                  <a
                    href="mailto:leads@acquanthr.com"
                    className="font-medium text-[#0b3c5d] hover:underline"
                  >
                    leads@acquanthr.com
                  </a>{" "}
                  or call{" "}
                  <span className="font-medium text-[#0b3c5d]">
                    +91 9663411888
                  </span>
                  .
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}