"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useLoginMutation } from "@/api/authApi";

// Design ka font (Stitch wale UI jaisa clean, geometric look)
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

/**
 * Types out a string character by character.
 * Used for the "Welcome to AcquantHR Portal" heading animation.
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
  const [rememberMe, setRememberMe] = useState(true);

  const { displayedText: welcomeText, isDone: welcomeDone } = useTypewriter(
    "Welcome to AcquantHR Portal",
    40,
    200,
  );

  // "Remember this workstation" -> sirf email yaad rakhte hain (password kabhi nahi)
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await login({ email, password }).unwrap();

      sessionStorage.setItem("authToken", response.data.token);
      sessionStorage.setItem("userName", response.data.name);

      if (rememberMe) localStorage.setItem("rememberedEmail", email);
      else localStorage.removeItem("rememberedEmail");

      router.replace("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const getErrorMessage = () => {
    if (!error) return "";

    if ("status" in error) {
      if (error.status === 401) return "Invalid email or password.";
      if (error.status === 403)
        return "You are not authorized to access the admin portal.";
      if (typeof error.status === "number" && error.status >= 500)
        return "Server error. Please try again later.";
    }

    return "Unable to sign in. Please check your details and try again.";
  };

  const inputClass =
    "h-11 w-full rounded-lg border border-[#e1ebe6] bg-[#f6faf8] pl-10 text-[13.5px] text-[#12241f] outline-none transition placeholder:text-[#9fb1a9] focus:border-[#0f6b58] focus:bg-white focus:ring-[3px] focus:ring-[#0f6b58]/10";

  return (
    <div
      className={`${jakarta.className} flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top_left,#d6efe4_0%,#eef6f2_45%,#f7fbf9_100%)] text-[#12241f]`}
    >
      {/* ===== MAIN AREA: centered card ===== */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="grid w-full max-w-[1000px] overflow-hidden rounded-[22px] bg-white shadow-[0_30px_70px_rgba(11,74,61,0.16)] lg:min-h-[560px] lg:grid-cols-[1fr_1fr]">
          {/* ---------- LEFT: BRAND PANEL ---------- */}
          <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0b5a49] via-[#0a4d3f] to-[#073a30] p-10 lg:flex xl:p-12">
            {/* Background decoration: 2 rings + 1 soft glow */}
            <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full border border-white/5" />
            <div className="pointer-events-none absolute -bottom-[7.5rem] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full border border-white/5" />
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)",
              }}
            />

            {/* Top: logo + heading + description */}
            <div className="relative z-10">
              <Image
                src="/images/acquanthr-logo.png"
                alt="AcquantHR"
                width={150}
                height={50}
                loading="eager"
                className="h-9 w-auto object-contain brightness-0 invert"
              />

              <h2 className="mt-16 max-w-[380px] text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-white">
                Smart HR solutions for a{" "}
                <span className="text-[#4ade9a]">smarter workplace.</span>
              </h2>

              <p className="mt-5 max-w-[340px] text-[14px] leading-[1.7] text-white/70">
                Manage users, roles, and statutory compliance from one secure
                admin workspace.
              </p>
            </div>

            {/* Bottom: live status */}
            <div className="relative z-10 flex items-center gap-2.5 text-[12.5px] font-medium text-white/80">
              <span className="h-2 w-2 rounded-full bg-[#3ddc97] shadow-[0_0_8px_#3ddc97]" />
              <span>All systems operational</span>
            </div>
          </section>

          {/* ---------- RIGHT: LOGIN FORM ---------- */}
          <section className="flex flex-col px-7 py-8 sm:px-12">
            <div className="mx-auto flex w-full max-w-[380px] flex-1 flex-col justify-center py-6">
              {/* Animated heading */}
              <h1 className="min-h-[36px] text-[26px] font-extrabold leading-tight tracking-tight text-[#0d2a23]">
                {welcomeText}
                <span
                  className={`ml-1 inline-block w-[3px] translate-y-[3px] rounded-sm bg-[#12b981] ${
                    welcomeDone ? "animate-pulse" : ""
                  }`}
                  style={{ height: "1em" }}
                />
              </h1>

              <p className="mt-2 text-[13px] leading-5 text-[#6b8078]">
                Sign in with your enterprise credentials to access your
                administrative workspace.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#365149]"
                  >
                    Work email
                  </label>

                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa39a]"
                    />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your work email"
                      autoComplete="email"
                      required
                      className={`${inputClass} pr-3`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1.5">
                    <label
                      htmlFor="password"
                      className="text-[11px] font-bold uppercase tracking-wider text-[#365149]"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa39a]"
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8fa39a] transition hover:text-[#0b4a3d]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ?
                        <EyeOff size={15} />
                      : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label className="flex cursor-pointer items-center gap-2 text-[12px] text-[#4a625a]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-[#cfe0d8] accent-[#0f6b58]"
                  />
                  Remember this workstation
                </label>

                {/* API Error */}
                {getErrorMessage() && (
                  <div
                    role="alert"
                    className="rounded-lg border border-[#f3d3c4] bg-[#fdf3ee] px-3 py-2 text-[12px] text-[#c1552f]"
                  >
                    {getErrorMessage()}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0b4a3d] text-[13.5px] font-semibold text-white shadow-[0_8px_20px_rgba(11,74,61,0.25)] transition hover:bg-[#083a30] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ?
                    "Signing in..."
                  : <>
                      Sign in to Dashboard
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  }
                </button>
              </form>
            </div>

            {/* Card footer */}
            <div className="flex items-center border-t border-[#eef3f0] pt-4 text-[11px] text-[#8fa39a]">
              <span className="flex items-center gap-1.5">
                <LockKeyhole size={12} />
                Secure administrator access
              </span>
            </div>
          </section>
        </div>
      </main>

      {/* ===== PAGE FOOTER BAR ===== */}
      <footer className="flex items-center justify-between px-6 py-3 text-[11px] text-[#6b8078]">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#12b981]" />
          Connected to AcquantHR Cloud
        </span>
        <span>© 2025 AcquantHR Inc. All rights reserved.</span>
      </footer>
    </div>
  );
}
