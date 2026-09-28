"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, LogOut, X } from "lucide-react";
import { useCurrentUser } from "@/hooks/Usecurrentuser";
interface LogoutModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ANIMATION_MS = 200;

export default function LogoutModal({
  open,
  onCancel,
  onConfirm,
}: LogoutModalProps) {
  const { user, firstName, initials } = useCurrentUser();

  const [mounted, setMounted] = useState(false); // is in the DOM
  const [visible, setVisible] = useState(false); // drives enter/exit animation
  const [loading, setLoading] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  /* Keep latest callbacks/state in refs so the effects below don't re-run
     (and re-trigger animation/focus) when the parent re-renders. */
  const onCancelRef = useRef(onCancel);
  const loadingRef = useRef(loading);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  /* Mount -> animate in. Animate out -> unmount. */
  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    setLoading(false);
    const timer = setTimeout(() => setMounted(false), ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [open]);

  /* Esc to close, Tab focus trap, scroll lock, focus the safe button */
  useEffect(() => {
    if (!open) return;

    const handleCancel = () => {
      if (!loadingRef.current) onCancelRef.current();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled])"
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const previousFocus = document.activeElement as HTMLElement | null;
    // Focus "Stay signed in" so an accidental Enter doesn't log out
    const focusTimer = setTimeout(() => cancelRef.current?.focus(), 30);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [open]);

  if (!mounted) return null;

  const handleCancel = () => {
    if (!loading) onCancel();
  };

  const handleConfirm = () => {
    setLoading(true);
    onConfirm();
  };

  return createPortal(
    <div
      onClick={handleCancel}
      className={`fixed inset-0 z-[9999] flex items-end justify-center bg-[#0E1F1B]/40 backdrop-blur-[6px] transition-opacity duration-200 sm:items-center sm:px-4 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        aria-describedby="logout-desc"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-[400px] overflow-hidden rounded-t-3xl border border-[#D5E4DF] bg-white text-center shadow-[0_24px_80px_rgba(0,95,78,0.22)] transition-all duration-200 sm:rounded-3xl ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-6 scale-[0.97] opacity-0"
        }`}
      >
        {/* Close */}
        <button
          type="button"
          onClick={handleCancel}
          aria-label="Close"
          className="absolute right-3.5 top-3.5 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-[#8A9994] transition hover:bg-[#E8F3EF] hover:text-[#005F4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/30"
        >
          <X size={16} strokeWidth={1.8} />
        </button>

        {/* Identity */}
        <div className="relative bg-gradient-to-b from-[#EEF7F3] to-white px-6 pb-4 pt-8">
          {/* Decorative rings */}
          <span className="pointer-events-none absolute left-1/2 top-1 h-44 w-44 -translate-x-1/2 rounded-full border border-[#D5E4DF]/60" />
          <span className="pointer-events-none absolute left-1/2 top-6 h-28 w-28 -translate-x-1/2 rounded-full border border-[#D5E4DF]/80" />

          {/* Avatar + sign-out badge */}
          <div className="relative mx-auto h-16 w-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#005F4E] to-[#22C08A] text-xl font-semibold tracking-wide text-white shadow-[0_8px_20px_rgba(0,95,78,0.28)]">
              {initials}
            </div>

            <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#C2413A] text-white ring-4 ring-white">
              <LogOut size={13} strokeWidth={2.2} />
            </span>
          </div>

          <h2
            id="logout-title"
            className="relative mt-5 text-lg font-semibold tracking-tight text-[#111D1A]"
          >
            Leaving already, {firstName}?
          </h2>

          <p
            id="logout-desc"
            className="relative mx-auto mt-1.5 max-w-[300px] text-[13px] leading-6 text-[#71817C]"
          >
            You&apos;ll need to sign in again to access the admin portal.
          </p>

          {/* Current account chip */}
          <div className="relative mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-[#E1ECE8] bg-white px-3 py-1 text-[11px] text-[#526461]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C08A]" />
            <span className="truncate">
              Signed in as {user.email || user.name}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 px-6 pb-6 pt-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="h-11 rounded-xl border border-[#D5E4DF] bg-white text-[13px] font-medium text-[#52645F] transition hover:border-[#B9D5CC] hover:bg-[#E8F3EF] hover:text-[#005F4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Stay signed in
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#C2413A] text-[13px] font-medium text-white shadow-[0_4px_12px_rgba(194,65,58,0.22)] transition hover:bg-[#B33630] hover:shadow-[0_6px_16px_rgba(194,65,58,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2413A]/40 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut size={15} strokeWidth={2} />
                Sign out
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}