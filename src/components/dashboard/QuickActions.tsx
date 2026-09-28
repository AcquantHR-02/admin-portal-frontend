"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, BarChart3, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import AddUserModal from "../users/AddUserModal";

const actions = [
  {
    label: "Add User",
    description: "Create a new user account",
    icon: UserPlus,
    href: null,
  },
  {
    label: "View Users",
    description: "Manage registered users",
    icon: Users,
    href: "/users",
  },
  {
    label: "View Analytics",
    description: "Review system analytics",
    icon: BarChart3,
    href: "/analytics",
  },
];

export default function QuickActions() {
  const router = useRouter();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const handleAction = (action: (typeof actions)[number]) => {
    if (action.label === "Add User") {
      setShowAddUserModal(true);
      return;
    }

    if (action.href) {
      router.push(action.href);
    }
  };

  const [primary, ...secondary] = actions;
  const PrimaryIcon = primary.icon;

  return (
    <>
      <div className="rounded-2xl border border-[#dfe8e6] bg-white p-4">
        {/* Header */}
        <div>
          <h3 className="text-sm font-semibold text-[#102526]">
            Quick Actions
          </h3>
          <p className="mt-1 text-xs text-[#8a9997]">
            Common administrative actions.
          </p>
        </div>

        {/* Primary action */}
        <button
          type="button"
          onClick={() => handleAction(primary)}
          className="group relative mt-3 flex w-full items-center gap-3 overflow-hidden rounded-xl bg-[#005F4E] px-4 py-3 text-left text-white transition-all duration-200 hover:bg-[#004d3f] hover:shadow-[0_8px_22px_rgba(0,95,78,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E] focus-visible:ring-offset-2"
        >
          {/* Decorative rings */}
          <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border border-white/10" />
          <span className="pointer-events-none absolute -right-2 -top-2 h-12 w-12 rounded-full border border-white/10" />

          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
            <PrimaryIcon size={19} strokeWidth={1.9} />
          </div>

          <div className="relative min-w-0 flex-1">
            <p className="text-sm font-semibold">{primary.label}</p>
            <p className="mt-0.5 truncate text-xs text-white/70">
              {primary.description}
            </p>
          </div>

          <ArrowRight
            size={17}
            strokeWidth={1.9}
            className="relative shrink-0 transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>

        {/* Secondary actions */}
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          {secondary.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                type="button"
                onClick={() => handleAction(action)}
                className="group flex flex-col rounded-xl border border-[#dfe8e6] p-3 text-left transition-all duration-200 hover:border-[#b9d0ca] hover:bg-[#f6f9f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E] focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef6f4] text-[#005F4E] transition-colors group-hover:bg-[#e0efeb]">
                    <Icon size={17} strokeWidth={1.8} />
                  </div>

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.8}
                    className="text-[#9aaba7] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#005F4E]"
                  />
                </div>

                <p className="mt-2 text-sm font-semibold text-[#304846]">
                  {action.label}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-[#8a9997]">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal onClose={() => setShowAddUserModal(false)} />
      )}
    </>
  );
}