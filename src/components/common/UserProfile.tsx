"use client";

import { useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import LogoutModal from "./LogoutModal";
import { useCurrentUser } from "@/hooks/Usecurrentuser";
export default function UserProfile() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, initials } = useCurrentUser();

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-[15px] border border-[#D5E4DF] bg-[#F3F8F6] p-2 shadow-[0_4px_16px_rgba(0,95,78,0.05)]">
        {/* User */}
        <div
          className="flex h-[42px] w-full items-center gap-3"
          title={user.email ? `${user.name} (${user.email})` : user.name}
        >
          {/* Avatar with initials + online dot */}
          <div className="relative shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-gradient-to-br from-[#005F4E] to-[#22C08A] text-[12px] font-semibold tracking-wide text-white shadow-[0_3px_10px_rgba(0,95,78,0.25)]">
              {initials}
            </div>

            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#22C08A] ring-2 ring-[#F3F8F6]" />
          </div>

          {/* Details (visible when sidebar expands) */}
          <div className="min-w-0 flex-1 overflow-hidden opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100">
            <div className="flex min-w-0 items-center gap-1.5">
              <p className="min-w-0 truncate text-[12px] font-semibold text-[#111D1A]">
                {user.name}
              </p>

              <ShieldCheck
                size={12}
                strokeWidth={2}
                className="shrink-0 text-[#005F4E]"
              />
            </div>

            <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
              <span className="shrink-0 rounded bg-[#DCEEE8] px-1.5 py-px text-[9px] font-semibold capitalize text-[#005F4E]">
                {user.role.toLowerCase()}
              </span>

              {user.email && (
                <p className="min-w-0 truncate text-[10px] text-[#71817C]">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-2 h-px w-full bg-[#D5E4DF] opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100" />

        {/* Logout */}
        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="group/logout flex h-[38px] w-full items-center gap-3 rounded-[11px] px-1 text-[#667873] transition-all duration-200 hover:bg-[#FDEDEC] hover:text-[#C2413A]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-white text-[#71817C] shadow-[0_2px_8px_rgba(0,95,78,0.05)] transition-all duration-200 group-hover/logout:bg-[#FCE2E0] group-hover/logout:text-[#C2413A]">
            <LogOut size={16} strokeWidth={1.8} />
          </span>

          <span className="whitespace-nowrap text-[12px] font-medium opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100">
            Sign out
          </span>
        </button>
      </div>

      <LogoutModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}