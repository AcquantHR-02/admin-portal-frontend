"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  X,
} from "lucide-react";

import { useResetUserPasswordMutation } from "@/api/usersApi";

interface ResetPasswordModalProps {
  userId: number;
  userName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ResetPasswordModal({
  userId,
  userName,
  onClose,
  onSuccess,
}: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [resetUserPassword, { isLoading }] = useResetUserPasswordMutation();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isLoading, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");

    if (!newPassword.trim()) {
      setErrorMessage("Please enter a new password.");
      return;
    }

    if (!confirmPassword.trim()) {
      setErrorMessage("Please confirm the new password.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      await resetUserPassword({
        id: userId,
        data: {
          newPassword,
        },
      }).unwrap();

      onSuccess?.();
      onClose();
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message ||
          error?.error ||
          "Failed to reset password. Please try again.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#D5E4DF] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D5E4DF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F3EF]">
              <KeyRound className="h-5 w-5 text-[#005F4E]" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#111D1A]">
                Reset Password
              </h2>

              <p className="text-xs text-[#71817C]">
                {userName ?
                  `Update password for ${userName}`
                : "Create a new password for this user"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#71817C] transition hover:bg-[#E8F3EF] hover:text-[#005F4E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-5 py-5">
            {/* New Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111D1A]">
                New Password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71817C]" />

                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Enter new password"
                  disabled={isLoading}
                  className="h-10 w-full rounded-lg border border-[#D5E4DF] bg-white pl-9 pr-10 text-sm text-[#111D1A] outline-none transition placeholder:text-[#71817C] focus:border-[#005F4E] focus:ring-2 focus:ring-[#005F4E]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((previous) => !previous)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71817C] hover:text-[#005F4E]"
                >
                  {showNewPassword ?
                    <EyeOff className="h-4 w-4" />
                  : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111D1A]">
                Confirm Password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71817C]" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Confirm new password"
                  disabled={isLoading}
                  className="h-10 w-full rounded-lg border border-[#D5E4DF] bg-white pl-9 pr-10 text-sm text-[#111D1A] outline-none transition placeholder:text-[#71817C] focus:border-[#005F4E] focus:ring-2 focus:ring-[#005F4E]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71817C] hover:text-[#005F4E]"
                >
                  {showConfirmPassword ?
                    <EyeOff className="h-4 w-4" />
                  : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                <p className="text-xs leading-5 text-red-600">{errorMessage}</p>
              </div>
            )}

            {/* Password Hint */}
            <p className="text-xs text-[#71817C]">
              Use at least 8 characters with a combination of letters, numbers,
              and special characters.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[#D5E4DF] bg-[#fbfbfb] px-5 py-3.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-[#D5E4DF] px-4 py-2 text-sm font-medium text-[#111D1A] transition hover:bg-[#E8F3EF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-[#005F4E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#004C3F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
