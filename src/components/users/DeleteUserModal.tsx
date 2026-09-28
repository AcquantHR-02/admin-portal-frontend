"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Trash2, X } from "lucide-react";
import { useDeleteUserMutation } from "@/api/usersApi";

interface DeleteUserModalProps {
  userId: number;
  userName?: string;
  onClose: () => void;
}

export default function DeleteUserModal({
  userId,
  userName,
  onClose,
}: DeleteUserModalProps) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  // FIX: pehle delete fail hone par sirf console me error jata tha, user ko kuch nahi dikhta tha.
  // Ab error modal ke andar dikhta hai.
  const [errorMessage, setErrorMessage] = useState("");

  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleDelete = async () => {
    setErrorMessage("");

    try {
      await deleteUser(userId).unwrap();

      onClose();
    } catch (error: any) {
      console.error("Failed to delete user:", error);

      setErrorMessage(
        error?.data?.message ||
          error?.error ||
          "Failed to delete user. Please try again."
      );
    }
  };

  /*
   * Esc dabane par modal band (delete chal raha ho tab nahi)
   * + Cancel button pe auto-focus, taaki galti se Enter dabane par delete na ho jaye
   */
  useEffect(() => {
    cancelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isLoading, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111D1A]/35 px-4 backdrop-blur-[4px] animate-[fadeIn_180ms_ease-out] motion-reduce:animate-none"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-user-title"
        aria-describedby="delete-user-desc"
        className="relative w-full max-w-[400px] overflow-hidden rounded-3xl border border-[#D5E4DF] bg-white text-center shadow-[0_24px_70px_rgba(17,29,26,0.2)] animate-[popupIn_220ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close"
          className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-lg text-[#8A9994] transition hover:bg-[#E8F3EF] hover:text-[#005F4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={16} strokeWidth={1.8} />
        </button>

        {/* =========================================
            CONTENT
        ========================================= */}
        <div className="px-6 pb-5 pt-8">
          {/* Icon: bahar halka ring, andar red circle */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FDEDEC]/70">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FDEDEC] text-[#C2413A] ring-1 ring-[#C2413A]/15">
              <Trash2 size={20} strokeWidth={1.9} />
            </div>
          </div>

          <h2
            id="delete-user-title"
            className="mt-5 text-lg font-semibold tracking-tight text-[#111D1A]"
          >
            Delete this user?
          </h2>

          <p
            id="delete-user-desc"
            className="mx-auto mt-2 max-w-[310px] text-[13px] leading-6 text-[#71817C]"
          >
            {userName ? (
              <>
                <span className="font-semibold capitalize text-[#111D1A]">
                  {userName}
                </span>{" "}
                will lose access and the account will be permanently removed.
              </>
            ) : (
              "This user will lose access and the account will be permanently removed."
            )}
          </p>

          {/* FIX: "undone nahi ho sakta" ko alag warning strip me dikhaya, taaki nazar se na chhute */}
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#FDEDEC] px-3 py-1 text-xs font-medium text-[#C2413A]">
            <AlertCircle size={13} />
            This action cannot be undone
          </div>

          {/* Error */}
          {errorMessage && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-left text-xs font-medium text-[#C2413A]"
            >
              <AlertCircle size={15} className="mt-px shrink-0" />
              {errorMessage}
            </div>
          )}
        </div>

        {/* =========================================
            FOOTER: dono buttons barabar width me
        ========================================= */}
        <div className="grid grid-cols-2 gap-3 border-t border-[#E8EFEC] bg-[#F7FBF9] px-6 py-4">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-10 rounded-xl border border-[#D5E4DF] bg-white text-[13px] font-semibold text-[#52645F] transition hover:border-[#B9D5CC] hover:bg-[#E8F3EF] hover:text-[#005F4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#C2413A] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(194,65,58,0.2)] transition hover:bg-[#A93630] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2413A]/40 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <Trash2 size={15} />
            )}

            {isLoading ? "Deleting..." : "Delete User"}
          </button>
        </div>
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
  );
}