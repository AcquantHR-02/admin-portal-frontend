"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AlertCircle,
  Briefcase,
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { Role } from "@/types/common.type";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/api/usersApi";

import ResetPasswordModal from "./ResetPasswordModal";

interface EditUserModalProps {
  userId: number;
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
  { value: Role.USER, label: "User", icon: UserRound },
  { value: Role.ADMIN, label: "Admin", icon: ShieldCheck },
];

export default function EditUserModal({
  userId,
  onClose,
}: EditUserModalProps) {
  const {
    data,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetUserByIdQuery(userId);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  /* -----------------------------------------
   * Reset Password Modal State
   * ----------------------------------------- */
  const [showResetPasswordModal, setShowResetPasswordModal] =
    useState(false);

  const user = data?.data;

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [role, setRole] = useState<Role>(Role.USER);
  const [isActive, setIsActive] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  /*
   * Populate form when user data is loaded
   */
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setDesignation(user.designation ?? "");
      setRole(user.role ?? Role.USER);
      setIsActive(user.isActive ?? true);
    }
  }, [user]);

  /*
   * Escape closes Edit modal.
   * Reset Password modal open ho to uska own Escape handler
   * usko close karega.
   */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !isUpdating &&
        !showResetPasswordModal
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isUpdating, showResetPasswordModal, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter user name.");
      return;
    }

    if (!designation.trim()) {
      setErrorMessage("Please enter designation.");
      return;
    }

    try {
      await updateUser({
        id: userId,
        data: {
          name: name.trim(),
          designation: designation.trim(),
          role,
          isActive,
        },
      }).unwrap();

      onClose();
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message ||
          error?.error ||
          "Failed to update user. Please try again."
      );
    }
  };

  return (
    <>
      {/* =========================================
          EDIT USER MODAL
      ========================================= */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#111D1A]/35 px-4 backdrop-blur-[4px] animate-[fadeIn_180ms_ease-out] motion-reduce:animate-none"
        onMouseDown={(event) => {
          if (
            event.target === event.currentTarget &&
            !isUpdating &&
            !showResetPasswordModal
          ) {
            onClose();
          }
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-user-title"
          className="w-full max-w-[480px] overflow-hidden rounded-3xl border border-[#D5E4DF] bg-white shadow-[0_24px_70px_rgba(17,29,26,0.2)] animate-[popupIn_220ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none"
          onMouseDown={(event) => event.stopPropagation()}
        >
          {/* =========================================
              HEADER
          ========================================= */}
          <div className="flex items-center justify-between gap-3 border-b border-[#D5E4DF] px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F3EF] text-sm font-bold text-[#005F4E]">
                {user?.name?.charAt(0)?.toUpperCase() || (
                  <UserRound size={18} />
                )}
              </div>

              <div className="min-w-0">
                <h2
                  id="edit-user-title"
                  className="text-base font-bold leading-tight text-[#111D1A]"
                >
                  Edit User
                </h2>

                <p className="mt-0.5 truncate text-xs text-[#71817C]">
                  {user?.name
                    ? `Update details and access for ${user.name}.`
                    : "Update user information and access."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              aria-label="Close"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#71817C] transition hover:bg-[#E8F3EF] hover:text-[#005F4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={17} />
            </button>
          </div>

          {/* Loading */}
          {isUserLoading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D5E4DF] border-t-[#005F4E]" />
                <p className="text-sm text-[#71817C]">
                  Loading user...
                </p>
              </div>
            </div>
          ) : isUserError || !user ? (
            /* Error */
            <div className="flex min-h-[280px] items-center justify-center px-5">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FDEDEC] text-[#C2413A]">
                  <AlertCircle size={22} />
                </div>

                <p className="mt-3 text-sm font-semibold text-[#111D1A]">
                  Unable to load user
                </p>

                <p className="mt-1 text-xs text-[#71817C]">
                  Please close this window and try again.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* =========================================
                  FORM
              ========================================= */}
              <div className="space-y-4 p-5">
                {/* Name */}
                <div>
                  <label htmlFor="edit-name" className={labelClass}>
                    Full Name
                  </label>

                  <div className="relative">
                    <UserRound size={16} className={iconClass} />

                    <input
                      id="edit-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter full name"
                      disabled={isUpdating}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="edit-email" className={labelClass}>
                    Email
                  </label>

                  <div className="relative">
                    <Mail size={16} className={iconClass} />

                    <input
                      id="edit-email"
                      type="email"
                      value={user.email}
                      disabled
                      className={`${inputClass} pr-9`}
                    />

                    <Lock
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA9A4]"
                    />
                  </div>

                  <p className="mt-1 text-[11px] text-[#9AA9A4]">
                    Email cannot be changed from this screen.
                  </p>
                </div>

                {/* Designation + Role */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Designation */}
                  <div>
                    <label
                      htmlFor="edit-designation"
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
                        id="edit-designation"
                        type="text"
                        value={designation}
                        onChange={(event) =>
                          setDesignation(event.target.value)
                        }
                        placeholder="Enter designation"
                        disabled={isUpdating}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <span
                      id="edit-role-label"
                      className={labelClass}
                    >
                      Role
                    </span>

                    <div
                      role="radiogroup"
                      aria-labelledby="edit-role-label"
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
                              disabled={isUpdating}
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
                        }
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Status */}
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
                      Allow this user to access the application.
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
                    disabled={isUpdating}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      isActive
                        ? "bg-[#005F4E]"
                        : "bg-[#C8D5D1]"
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                        isActive
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Error */}
                {errorMessage && (
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
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#D5E4DF] bg-[#F7FBF9] px-5 py-3">
                {/* Reset Password */}
                <button
                  type="button"
                  onClick={() =>
                    setShowResetPasswordModal(true)
                  }
                  disabled={isUpdating}
                  className="flex h-9 items-center justify-center gap-2 rounded-xl border border-[#D5E4DF] bg-white px-3.5 text-sm font-semibold text-[#005F4E] transition hover:border-[#005F4E] hover:bg-[#E8F3EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <KeyRound size={15} />
                  Reset Password
                </button>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isUpdating}
                    className="h-9 rounded-xl border border-[#D5E4DF] bg-white px-4 text-sm font-semibold text-[#52645F] transition hover:border-[#005F4E] hover:text-[#005F4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex h-9 min-w-[120px] items-center justify-center gap-2 rounded-xl bg-[#005F4E] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004C3E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUpdating && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}

                    {isUpdating
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

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

      {/* =========================================
          RESET PASSWORD MODAL
          z-index 60 → Edit modal ke upar
      ========================================= */}
      {showResetPasswordModal && user && (
        <ResetPasswordModal
          userId={userId}
          userName={user.name}
          onClose={() => setShowResetPasswordModal(false)}
        />
      )}
    </>
  );
}