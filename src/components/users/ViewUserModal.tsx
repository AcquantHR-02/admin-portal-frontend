"use client";

import { useEffect, type ReactNode } from "react";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  FileText,
  Mail,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { useGetUserByIdQuery } from "@/api/usersApi";
import { useGetUserHistoryQuery } from "@/api/analyticsApi";
import { Role } from "@/types/common.type";

interface ViewUserModalProps {
  userId: number;
  onClose: () => void;
}

/* =========================================================
   Helpers
========================================================= */

/* "ADMIN" -> "Admin" */
const formatRole = (role: string) =>
  role
    ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    : "-";

/* "REGISTRATION_FORM" -> "Registration Form" */
const formatFormType = (value: string) =>
  value
    ? value
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "-";

/* Format date */
const formatDate = (value: string) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   Detail Row
========================================================= */

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5 transition hover:bg-[#FAFCFB]">
      <div className="flex items-center gap-2.5 text-[#71817C]">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8F3EF] text-[#005F4E]">
          {icon}
        </span>
        <span className="text-xs font-medium">{label}</span>
      </div>

      <div className="min-w-0 text-right text-sm font-semibold capitalize text-[#111D1A]">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   Component
========================================================= */

export default function ViewUserModal({
  userId,
  onClose,
}: ViewUserModalProps) {
  /* =======================================================
     User Details API
  ======================================================= */

  const {
    data,
    isLoading,
    isError,
  } = useGetUserByIdQuery(userId);

  const user = data?.data;

  /* =======================================================
     User Submitted Forms API
  ======================================================= */

  const {
    data: historyData,
    isLoading: historyLoading,
    isError: historyError,
  } = useGetUserHistoryQuery({
    userId,
    page: 0,
    size: 10,
  });

  const submittedForms = historyData?.data?.content ?? [];

  /* =======================================================
     ESC Key
  ======================================================= */

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111D1A]/35 px-4 backdrop-blur-[4px] animate-[fadeIn_180ms_ease-out] motion-reduce:animate-none"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-user-title"
        className="flex max-h-[94vh] w-full max-w-[600px] flex-col overflow-hidden rounded-3xl border border-[#D5E4DF] bg-white shadow-[0_24px_70px_rgba(17,29,26,0.2)] animate-[popupIn_220ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#D5E4DF] px-6 py-4">
          <div>
            <h2
              id="view-user-title"
              className="text-base font-bold leading-tight text-[#111D1A]"
            >
              User Details
            </h2>

            <p className="mt-0.5 text-xs text-[#71817C]">
              View user information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#71817C] transition hover:bg-[#E8F3EF] hover:text-[#005F4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/30"
          >
            <X size={17} />
          </button>
        </div>

        {/* =================================================
            SCROLLABLE CONTENT
        ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* =================================================
              USER LOADING
          ================================================= */}

          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D5E4DF] border-t-[#005F4E]" />

                <p className="text-sm text-[#71817C]">
                  Loading user...
                </p>
              </div>
            </div>
          ) : isError || !user ? (
            /* =================================================
               USER ERROR
            ================================================= */

            <div className="flex min-h-[300px] items-center justify-center px-5">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FDEDEC] text-[#C2413A]">
                  <AlertCircle size={22} />
                </div>

                <p className="mt-3 text-sm font-semibold text-[#111D1A]">
                  Unable to load user
                </p>

                <p className="mt-1 text-xs text-[#71817C]">
                  Please try again.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 px-6 py-5 sm:grid-cols-2">
              {/* =================================================
                  LEFT COLUMN — PROFILE + DETAILS
              ================================================= */}

              <div className="flex flex-col gap-4">
                {/* Profile */}
                <div className="flex items-center gap-4 rounded-2xl border border-[#D5E4DF] bg-[#FAFCFB] p-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E8F3EF] text-lg font-bold text-[#005F4E] ring-4 ring-white">
                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold capitalize leading-tight text-[#111D1A]">
                      {user.name}
                    </h3>

                    <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#71817C]">
                      <Mail size={12} />
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Status + Role pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold normal-case ${
                      user.role === Role.ADMIN
                        ? "bg-sky-50 text-[#0284C7] ring-1 ring-inset ring-sky-100"
                        : "bg-[#E8F3EF] text-[#005F4E] ring-1 ring-inset ring-[#D5E4DF]"
                    }`}
                  >
                    {formatRole(user.role)}
                  </span>

                  <span
                    className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold normal-case ${
                      user.isActive
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100"
                        : "bg-[#F1F4F3] text-[#71817C] ring-1 ring-inset ring-[#E3E9E7]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        user.isActive ? "bg-emerald-500" : "bg-[#9AA9A4]"
                      }`}
                    />
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Details */}
                <div className="divide-y divide-[#E8EFEC] overflow-hidden rounded-2xl border border-[#D5E4DF] bg-white">
                  <DetailRow
                    icon={<Briefcase size={14} />}
                    label="Designation"
                  >
                    <span className="block truncate">
                      {user.designation || "-"}
                    </span>
                  </DetailRow>

                  <DetailRow icon={<ShieldCheck size={14} />} label="Role">
                    {formatRole(user.role)}
                  </DetailRow>

                  <DetailRow icon={<UserRound size={14} />} label="Status">
                    {user.isActive ? "Active" : "Inactive"}
                  </DetailRow>
                </div>
              </div>

              {/* =================================================
                  RIGHT COLUMN — SUBMITTED FORMS
              ================================================= */}

              <div className="flex min-h-0 flex-col">
                {/* Section Header */}

                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#111D1A]">
                      Submitted Forms
                    </h3>

                    <p className="mt-0.5 text-xs text-[#71817C]">
                      Forms submitted by this user
                    </p>
                  </div>

                  <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#E8F3EF] px-2.5 text-xs font-bold text-[#005F4E]">
                    {submittedForms.length}
                  </span>
                </div>

                {/* =================================================
                    LOADING
                ================================================= */}

                {historyLoading && (
                  <div className="flex flex-1 items-center justify-center rounded-2xl border border-[#D5E4DF] py-8">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D5E4DF] border-t-[#005F4E]" />

                      <span className="text-xs text-[#71817C]">
                        Loading forms...
                      </span>
                    </div>
                  </div>
                )}

                {/* =================================================
                    ERROR
                ================================================= */}

                {!historyLoading && historyError && (
                  <div className="rounded-2xl border border-[#F2D4D1] bg-[#FDEDEC] px-4 py-5 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#C2413A]">
                      <AlertCircle size={18} />
                    </div>

                    <p className="mt-2 text-sm font-semibold text-[#111D1A]">
                      Unable to load submitted forms
                    </p>

                    <p className="mt-1 text-xs text-[#71817C]">
                      Please try again.
                    </p>
                  </div>
                )}

                {/* =================================================
                    FORM LIST
                ================================================= */}

                {!historyLoading &&
                  !historyError &&
                  submittedForms.length > 0 && (
                    <div className="overflow-hidden rounded-2xl border border-[#D5E4DF] bg-white">
                      <div className="max-h-[320px] overflow-y-auto">
                        {submittedForms.map((form) => (
                          <div
                            key={form.id}
                            className="flex items-center gap-3 border-b border-[#E8EFEC] px-4 py-3.5 transition last:border-b-0 hover:bg-[#FAFCFB]"
                          >
                            {/* Icon */}

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F3EF] text-[#005F4E]">
                              <FileText size={16} />
                            </div>

                            {/* Form Info */}

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#111D1A]">
                                {formatFormType(form.formType)}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-[#71817C]">
                                {form.fileName || "Generated form"}
                              </p>

                              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-[#9AA9A4]">
                                <Calendar size={11} />
                                {formatDate(form.generatedAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* =================================================
                    NO FORMS
                ================================================= */}

                {!historyLoading &&
                  !historyError &&
                  submittedForms.length === 0 && (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D5E4DF] px-4 py-8 text-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F1F4F3] text-[#71817C]">
                        <FileText size={19} />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-[#111D1A]">
                        No forms submitted
                      </p>

                      <p className="mt-1 text-xs text-[#71817C]">
                        This user has not submitted any forms yet.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex shrink-0 justify-end border-t border-[#D5E4DF] bg-[#FAFCFB] px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-xl bg-[#005F4E] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004C3E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/40 focus-visible:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

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
      `}</style>
    </div>
  );
}