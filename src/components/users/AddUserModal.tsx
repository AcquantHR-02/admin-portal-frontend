"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Briefcase,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";

import { useCreateUserMutation } from "@/api/usersApi";
import { Role } from "@/types/common.type";

interface AddUserModalProps {
  onClose: () => void;
}

/* -----------------------------------------
 * Shared classes
 * ----------------------------------------- */
const labelClass = "mb-1.5 block text-xs font-semibold text-[#44534F]";

const inputClass =
  "h-10 w-full rounded-xl border border-[#D5E4DF] bg-white pl-9 pr-3 text-sm text-[#111D1A] outline-none transition " +
  "placeholder:text-[#9AA9A4] focus:border-[#005F4E] focus:ring-2 focus:ring-[#005F4E]/15 " +
  "disabled:cursor-not-allowed disabled:bg-[#F7FBF9] disabled:text-[#71817C]";

const iconClass =
  "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#71817C]";

/* Role options */
const ROLE_OPTIONS = [
  {
    value: Role.USER,
    label: "User",
    icon: UserRound,
  },
  {
    value: Role.ADMIN,
    label: "Admin",
    icon: ShieldCheck,
  },
];

export default function AddUserModal({ onClose }: AddUserModalProps) {
  const router = useRouter();

  const [createUser, { isLoading }] = useCreateUserMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(Role.USER);
  const [isActive, setIsActive] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* -----------------------------------------
   * Escape key
   * ----------------------------------------- */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading && !successMessage) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isLoading, successMessage, onClose]);

  /* -----------------------------------------
   * Submit
   * ----------------------------------------- */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    /* Name validation */
    if (!name.trim()) {
      setErrorMessage("Please enter user name.");
      return;
    }

    /* Email validation */
    if (!email.trim()) {
      setErrorMessage("Please enter email address.");
      return;
    }

    /* Designation validation */
    if (!designation.trim()) {
      setErrorMessage("Please enter designation.");
      return;
    }

    /* Password validation */
    if (!password) {
      setErrorMessage("Please enter password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      /* -----------------------------------------
       * Create user API
       * ----------------------------------------- */
      await createUser({
        name: name.trim(),
        email: email.trim(),
        password,
        designation: designation.trim(),
        role,
        isActive,
      }).unwrap();

      /* -----------------------------------------
       * SUCCESS
       * ----------------------------------------- */
      setSuccessMessage("User added successfully!");

      /*
       * Wait for the success message to be visible,
       * then close modal and redirect to /users.
       */
      setTimeout(() => {
        onClose();

        router.replace("/users");

        /*
         * Refresh the Users page so the newly
         * created user appears immediately.
         */
        router.refresh();
      }, 1200);
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message ||
          error?.error ||
          "Failed to create user. Please try again.",
      );
    }
  };

  /* -----------------------------------------
   * Password status
   * ----------------------------------------- */
  const passwordOk = password.length >= 6;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111D1A]/35 px-4 backdrop-blur-[4px] animate-[fadeIn_180ms_ease-out] motion-reduce:animate-none"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget &&
          !isLoading &&
          !successMessage
        ) {
          onClose();
        }
      }}
    >
      {/* =========================================
          POPUP
      ========================================= */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
        className="flex max-h-[92vh] w-full max-w-[500px] flex-col overflow-hidden rounded-3xl border border-[#D5E4DF] bg-white shadow-[0_24px_70px_rgba(17,29,26,0.2)] animate-[popupIn_220ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* =========================================
            HEADER
        ========================================= */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#D5E4DF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F3EF] text-[#005F4E]">
              <UserPlus size={18} />
            </div>

            <div>
              <h2
                id="add-user-title"
                className="text-base font-bold leading-tight text-[#111D1A]"
              >
                Add New User
              </h2>

              <p className="mt-0.5 text-xs text-[#71817C]">
                Create a new user account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading || !!successMessage}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#71817C] transition hover:bg-[#E8F3EF] hover:text-[#005F4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </div>

        {/* =========================================
            FORM
        ========================================= */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
            {/* =========================================
                NAME + DESIGNATION
            ========================================= */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label htmlFor="add-name" className={labelClass}>
                  Full Name
                </label>

                <div className="relative">
                  <UserRound size={16} className={iconClass} />

                  <input
                    id="add-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    disabled={isLoading || !!successMessage}
                    autoFocus
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Designation */}
              <div>
                <label
                  htmlFor="add-designation"
                  className={labelClass}
                >
                  Designation
                </label>

                <div className="relative">
                  <Briefcase
                    size={16}
                    className={iconClass}
                  />

                  <input
                    id="add-designation"
                    type="text"
                    value={designation}
                    onChange={(e) =>
                      setDesignation(e.target.value)
                    }
                    placeholder="Software Engineer"
                    disabled={isLoading || !!successMessage}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* =========================================
                EMAIL
            ========================================= */}
            <div>
              <label htmlFor="add-email" className={labelClass}>
                Email
              </label>

              <div className="relative">
                <Mail size={16} className={iconClass} />

                <input
                  id="add-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  disabled={isLoading || !!successMessage}
                  autoComplete="off"
                  className={inputClass}
                />
              </div>
            </div>

            {/* =========================================
                PASSWORD
            ========================================= */}
            <div>
              <label
                htmlFor="add-password"
                className={labelClass}
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={16}
                  className={iconClass}
                />

                <input
                  id="add-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  disabled={isLoading || !!successMessage}
                  autoComplete="new-password"
                  className={`${inputClass} pr-10`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={isLoading || !!successMessage}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#71817C] transition hover:bg-[#E8F3EF] hover:text-[#005F4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
              </div>

              <p
                className={`mt-1.5 flex items-center gap-1 text-[11px] transition-colors ${
                  passwordOk
                    ? "text-emerald-600"
                    : "text-[#9AA9A4]"
                }`}
              >
                <Check
                  size={12}
                  strokeWidth={passwordOk ? 2.5 : 2}
                />

                At least 6 characters
              </p>
            </div>

            {/* =========================================
                ROLE
            ========================================= */}
            <div>
              <span
                id="add-role-label"
                className={labelClass}
              >
                Role
              </span>

              <div
                role="radiogroup"
                aria-labelledby="add-role-label"
                className="grid h-10 grid-cols-2 gap-1 rounded-xl border border-[#D5E4DF] bg-[#F7FBF9] p-1"
              >
                {ROLE_OPTIONS.map(
                  ({ value, label, icon: Icon }) => {
                    const selected = role === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={isLoading || !!successMessage}
                        onClick={() => setRole(value)}
                        className={`flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/30 disabled:cursor-not-allowed ${
                          selected
                            ? "bg-white text-[#005F4E] shadow-sm ring-1 ring-[#D5E4DF]"
                            : "text-[#71817C] hover:text-[#111D1A]"
                        }`}
                      >
                        <Icon size={14} />
                        {label}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* =========================================
                STATUS
            ========================================= */}
            <div className="flex items-center justify-between gap-4 rounded-xl border border-[#D5E4DF] bg-[#F7FBF9] px-4 py-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#111D1A]">
                  Account Status

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-[#E8EFEC] text-[#71817C]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isActive
                          ? "bg-emerald-500"
                          : "bg-[#9AA9A4]"
                      }`}
                    />

                    {isActive ? "Active" : "Inactive"}
                  </span>
                </p>

                <p className="mt-0.5 text-xs text-[#71817C]">
                  {isActive
                    ? "User can access the application"
                    : "User will remain inactive"}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                aria-label="Toggle account status"
                onClick={() =>
                  setIsActive((current) => !current)
                }
                disabled={isLoading || !!successMessage}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                  isActive
                    ? "bg-[#005F4E]"
                    : "bg-[#C8D5D1]"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    isActive
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* =========================================
                SUCCESS MESSAGE
            ========================================= */}
            {successMessage && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3 text-sm font-semibold text-emerald-700 animate-[successIn_250ms_ease-out]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <Check
                    size={16}
                    strokeWidth={2.5}
                  />
                </div>

                <div>
                  <p>User added successfully!</p>
                  <p className="mt-0.5 text-[11px] font-normal text-emerald-600">
                    Redirecting to Users...
                  </p>
                </div>
              </div>
            )}

            {/* =========================================
                ERROR
            ========================================= */}
            {errorMessage && !successMessage && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-xs font-medium text-[#C2413A]"
              >
                <AlertCircle
                  size={15}
                  className="mt-px shrink-0"
                />

                {errorMessage}
              </div>
            )}
          </div>

          {/* =========================================
              FOOTER
          ========================================= */}
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[#D5E4DF] bg-[#F7FBF9] px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading || !!successMessage}
              className="h-9 rounded-xl border border-[#D5E4DF] bg-white px-4 text-sm font-semibold text-[#52645F] transition hover:border-[#005F4E] hover:text-[#005F4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !!successMessage}
              className="flex h-9 min-w-[130px] items-center justify-center gap-2 rounded-xl bg-[#005F4E] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004C3E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating...
                </>
              ) : successMessage ? (
                <>
                  <Check size={15} />
                  Created
                </>
              ) : (
                <>
                  <UserPlus size={15} />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* =========================================
          ANIMATIONS
      ========================================= */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes popupIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes successIn {
          from {
            opacity: 0;
            transform: translateY(5px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}