"use client";

import { useMemo, useState, type ReactNode } from "react";

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";

import AddUserModal from "@/components/users/AddUserModal";
import DeleteUserModal from "@/components/users/DeleteUserModal";
import EditUserModal from "@/components/users/EditUserModal";
import UserActions from "@/components/users/UserActions";
import ViewUserModal from "@/components/users/ViewUserModal";

import { Role } from "@/types/common.type";
import { useGetUsersQuery } from "@/api/usersApi";

type UserAction = "view" | "edit" | "delete" | null;

/* =========================================================
   Shared class names
========================================================= */

const fieldClass =
  "h-9 w-full rounded-xl border border-[#D5E4DF] bg-white text-sm text-[#111D1A] outline-none transition " +
  "focus:border-[#005F4E] focus:ring-2 focus:ring-[#005F4E]/15";

const thBase =
  "px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#71817C] whitespace-nowrap";

const thClass = `${thBase} text-left`;

const iconBtnClass =
  "flex h-8 items-center justify-center gap-1 rounded-lg border border-[#D5E4DF] text-[#71817C] transition " +
  "hover:border-[#005F4E] hover:text-[#005F4E] focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-[#005F4E]/30 disabled:cursor-not-allowed disabled:opacity-40 " +
  "disabled:hover:border-[#D5E4DF] disabled:hover:text-[#71817C]";

/* =========================================================
   Helpers
========================================================= */

/* "ADMIN" -> "Admin" */
const formatRole = (role: string) =>
  role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : "-";

/* =========================================================
   Stat Card
========================================================= */

function StatCard({
  label,
  value,
  hint,
  icon,
  iconClass,
}: {
  label: string;
  value: number;
  hint?: string;
  icon: ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-[#D5E4DF] bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#71817C]">{label}</p>

          <p className="mt-1 text-xl font-bold leading-none text-[#111D1A]">
            {value}
          </p>

          <p className="mt-1 h-4 text-xs leading-4 text-[#9AA9A4]">
            {hint ?? ""}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Smooth Hover Dropdown
========================================================= */

type DropdownOption = {
  value: string;
  label: string;
};

function FilterDropdown({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  label: string;
}) {
  const [open, setOpen] = useState(false);

  const selected =
    options.find((option) => option.value === value) ?? options[0];

  return (
    <div
      className="relative w-full xl:w-36"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      {/* =====================================================
          Trigger Button
      ===================================================== */}

      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`${fieldClass} flex cursor-pointer items-center justify-between gap-2 px-3 text-left transition-all duration-300 ${
          open ? "border-[#005F4E] bg-white ring-2 ring-[#005F4E]/15" : ""
        }`}
      >
        <span className="truncate">{selected.label}</span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-[#71817C] transition-transform duration-300 ease-out ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* =====================================================
          Dropdown

          Dropdown remains mounted so the close animation
          can also happen smoothly.
      ===================================================== */}

      <div
        className={`absolute left-0 top-full z-30 w-full pt-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ?
            "visible translate-y-0 scale-100 opacity-100"
          : "invisible pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        <ul
          role="listbox"
          aria-label={label}
          className="w-full overflow-hidden rounded-xl border border-[#D5E4DF] bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li
                key={option.value || "all"}
                role="option"
                aria-selected={isSelected}
              >
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex h-9 w-full items-center justify-between rounded-lg px-3 text-left text-sm transition-all duration-200 ${
                    isSelected ?
                      "bg-[#E8F3EF] font-semibold text-[#005F4E]"
                    : "text-[#111D1A] hover:bg-[#F7FBF9]"
                  }`}
                >
                  <span className="truncate">{option.label}</span>

                  {isSelected && <Check size={15} className="shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* =========================================================
   Users Page
========================================================= */

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [status, setStatus] = useState<"active" | "inactive" | "">("");

  const [page, setPage] = useState(0);

  // One page = 5 users
  const [size] = useState(5);

  /* =========================================================
     User action modal
  ========================================================= */

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [selectedAction, setSelectedAction] = useState<UserAction>(null);

  /* =========================================================
     Add User modal
  ========================================================= */

  const [showAddUserModal, setShowAddUserModal] = useState(false);

  /* =========================================================
     Filters
  ========================================================= */

  const filters = useMemo(
    () => ({
      page,
      size,
      search: search.trim() || undefined,
      role: role || undefined,
      isActive:
        status === "active" ? true
        : status === "inactive" ? false
        : undefined,
    }),
    [page, size, search, role, status],
  );

  /* =========================================================
     Users API
  ========================================================= */

  const { data, isLoading, isFetching, isError, error } =
    useGetUsersQuery(filters);

  const users = data?.data?.content ?? [];

  const totalElements = data?.data?.totalElements ?? 0;

  const totalPages = data?.data?.totalPages ?? 0;

  /* =========================================================
     Statistics
  ========================================================= */

  const activeUsers = users.filter((user) => user.isActive).length;

  const inactiveUsers = users.filter((user) => !user.isActive).length;

  const adminUsers = users.filter((user) => user.role === Role.ADMIN).length;

  /* =========================================================
     Pagination range
  ========================================================= */

  const rangeStart = totalElements === 0 ? 0 : page * size + 1;

  const rangeEnd = Math.min((page + 1) * size, totalElements);

  /* =========================================================
     User action handlers
  ========================================================= */

  const handleView = (userId: number) => {
    setSelectedUserId(userId);
    setSelectedAction("view");
  };

  const handleEdit = (userId: number) => {
    setSelectedUserId(userId);
    setSelectedAction("edit");
  };

  const handleDelete = (userId: number) => {
    setSelectedUserId(userId);
    setSelectedAction("delete");
  };

  const closeAction = () => {
    setSelectedUserId(null);
    setSelectedAction(null);
  };

  /* =========================================================
     Search / filter handlers
  ========================================================= */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleRoleChange = (value: Role | "") => {
    setRole(value);
    setPage(0);
  };

  const handleStatusChange = (value: "active" | "inactive" | "") => {
    setStatus(value);
    setPage(0);
  };

  const clearFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
    setPage(0);
  };

  const hasFilters = search.trim() !== "" || role !== "" || status !== "";

  /* =========================================================
     Render
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#E8F3EF] px-4 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1600px] space-y-4">
        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#005F4E] text-white shadow-sm">
              <Users size={18} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#111D1A]">
                Users
              </h1>

              <p className="text-sm text-[#71817C]">
                Manage application users and their access.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddUserModal(true)}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[#005F4E] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#004C3E] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/40 focus-visible:ring-offset-2 sm:w-auto"
          >
            <UserPlus size={17} />
            Add User
          </button>
        </div>

        {/* ===================================================
            SUMMARY CARDS
        =================================================== */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Users"
            value={totalElements}
            icon={<Users size={19} />}
            iconClass="bg-[#E8F3EF] text-[#005F4E]"
          />

          <StatCard
            label="Active Users"
            value={activeUsers}
            hint="On this page"
            icon={<UserCheck size={19} />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            label="Inactive Users"
            value={inactiveUsers}
            hint="On this page"
            icon={<UserX size={19} />}
            iconClass="bg-amber-50 text-[#D97706]"
          />

          <StatCard
            label="Admin Users"
            value={adminUsers}
            hint="On this page"
            icon={<ShieldCheck size={19} />}
            iconClass="bg-sky-50 text-[#0284C7]"
          />
        </div>

        {/* ===================================================
            FILTER BAR
        =================================================== */}

        <div className="rounded-2xl border border-[#D5E4DF] bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center">
            {/* Search */}

            <div className="relative flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#71817C]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search users by name or email..."
                aria-label="Search users"
                className={`${fieldClass} pl-10 pr-4 placeholder:text-[#9AA9A4]`}
              />
            </div>

            {/* Role */}

            <FilterDropdown
              label="Filter by role"
              value={role}
              onChange={(value) => handleRoleChange(value as Role | "")}
              options={[
                {
                  value: "",
                  label: "All Roles",
                },
                {
                  value: Role.ADMIN,
                  label: "Admin",
                },
                {
                  value: Role.USER,
                  label: "User",
                },
              ]}
            />

            {/* Status */}

            <FilterDropdown
              label="Filter by status"
              value={status}
              onChange={(value) =>
                handleStatusChange(value as "active" | "inactive" | "")
              }
              options={[
                {
                  value: "",
                  label: "All Status",
                },
                {
                  value: "active",
                  label: "Active",
                },
                {
                  value: "inactive",
                  label: "Inactive",
                },
              ]}
            />

            {/* Clear */}

            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="h-9 w-full rounded-xl border border-[#D5E4DF] px-4 text-sm font-medium text-[#71817C] transition hover:border-[#005F4E] hover:text-[#005F4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F4E]/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#D5E4DF] disabled:hover:text-[#71817C] xl:w-auto"
            >
              Clear
            </button>
          </div>
        </div>

        {/* ===================================================
            USERS TABLE
        =================================================== */}

        <div className="overflow-hidden rounded-2xl border border-[#D5E4DF] bg-white shadow-sm">
          {/* Table Header */}

          <div className="flex items-center justify-between border-b border-[#D5E4DF] px-5 py-3">
            <div>
              <h2 className="text-base font-semibold text-[#111D1A]">
                All Users
              </h2>

              <p className="mt-0.5 text-xs text-[#71817C]">
                {totalElements} {totalElements === 1 ? "user" : "users"} found
              </p>
            </div>

            {isFetching && !isLoading && (
              <span className="text-xs font-medium text-[#005F4E]">
                Updating...
              </span>
            )}
          </div>

          {/* =================================================
              Loading
          ================================================= */}

          {isLoading ?
            <div className="flex min-h-[240px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D5E4DF] border-t-[#005F4E]" />

                <p className="text-sm text-[#71817C]">Loading users...</p>
              </div>
            </div>
          : isError ?
            /* =================================================
                Error
            ================================================= */

            <div className="flex min-h-[240px] items-center justify-center px-5">
              <div className="text-center">
                <p className="text-sm font-semibold text-[#C2413A]">
                  Failed to load users.
                </p>

                <p className="mt-1 text-xs text-[#71817C]">
                  {String(
                    (error as any)?.data?.message ||
                      (error as any)?.error ||
                      "Please try again.",
                  )}
                </p>
              </div>
            </div>
          : users.length === 0 ?
            /* =================================================
                Empty
            ================================================= */

            <div className="flex min-h-[240px] items-center justify-center px-5">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F3EF] text-[#005F4E]">
                  <Users size={22} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#111D1A]">
                  No users found
                </h3>

                <p className="mt-1 text-xs text-[#71817C]">
                  Try changing your search or filters.
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 h-9 rounded-lg border border-[#D5E4DF] px-4 text-xs font-medium text-[#005F4E] transition hover:border-[#005F4E]"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
            /* =================================================
                Table
            ================================================= */
          : <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] table-fixed">
                <colgroup>
                  <col className="w-[32%]" />
                  <col className="w-[20%]" />
                  <col className="w-[14%]" />
                  <col className="w-[16%]" />
                  <col className="w-[18%]" />
                </colgroup>

                <thead>
                  <tr className="border-b border-[#D5E4DF] bg-[#F7FBF9]">
                    <th className={thClass}>User</th>

                    <th className={thClass}>Designation</th>

                    <th className={thClass}>Role</th>

                    <th className={thClass}>Status</th>

                    <th className={`${thBase} text-center`}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#E8EFEC] transition last:border-b-0 hover:bg-[#F7FBF9]"
                    >
                      {/* User */}

                      <td className="px-5 py-2.5 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F3EF] text-xs font-bold text-[#005F4E]">
                            {user.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold capitalize text-[#111D1A]">
                              {user.name}
                            </p>

                            <p className="truncate text-xs text-[#71817C]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Designation */}

                      <td className="px-5 py-2.5 align-middle text-sm capitalize text-[#44534F]">
                        <span className="block truncate">
                          {user.designation || "-"}
                        </span>
                      </td>

                      {/* Role */}

                      <td className="px-5 py-2.5 align-middle">
                        <span
                          className={`inline-flex h-6 items-center rounded-full px-3 text-xs font-semibold ${
                            user.role === Role.ADMIN ?
                              "bg-sky-50 text-[#0284C7]"
                            : "bg-[#E8F3EF] text-[#005F4E]"
                          }`}
                        >
                          {formatRole(user.role)}
                        </span>
                      </td>

                      {/* Status */}

                      <td className="px-5 py-2.5 align-middle">
                        <span
                          className={`inline-flex h-6 items-center gap-1.5 rounded-full px-3 text-xs font-semibold ${
                            user.isActive ?
                              "bg-emerald-50 text-emerald-700"
                            : "bg-[#F1F4F3] text-[#71817C]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.isActive ? "bg-emerald-500" : "bg-[#9AA9A4]"
                            }`}
                          />

                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-2.5 align-middle">
                        <div className="flex justify-center">
                          <UserActions
                            onView={() => handleView(user.id)}
                            onEdit={() => handleEdit(user.id)}
                            onDelete={() => handleDelete(user.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }

          {/* =================================================
              PAGINATION
          ================================================= */}

          {!isLoading && !isError && users.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-[#D5E4DF] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#71817C]">
                Showing{" "}
                <span className="font-semibold text-[#111D1A]">
                  {rangeStart}–{rangeEnd}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#111D1A]">
                  {totalElements}
                </span>{" "}
                · Page{" "}
                <span className="font-semibold text-[#111D1A]">{page + 1}</span>{" "}
                of{" "}
                <span className="font-semibold text-[#111D1A]">
                  {Math.max(totalPages, 1)}
                </span>
              </p>

              <div className="flex items-center gap-2">
                {/* Previous */}

                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={page === 0}
                  onClick={() => setPage((current) => Math.max(current - 1, 0))}
                  className={`${iconBtnClass} pl-2 pr-3 text-xs font-medium`}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                {/* Next */}

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={page >= totalPages - 1}
                  onClick={() =>
                    setPage((current) => Math.min(current + 1, totalPages - 1))
                  }
                  className={`${iconBtnClass} pl-3 pr-2 text-xs font-medium`}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          MODALS
      ===================================================== */}

      {showAddUserModal && (
        <AddUserModal onClose={() => setShowAddUserModal(false)} />
      )}

      {selectedAction === "view" && selectedUserId !== null && (
        <ViewUserModal userId={selectedUserId} onClose={closeAction} />
      )}

      {selectedAction === "edit" && selectedUserId !== null && (
        <EditUserModal userId={selectedUserId} onClose={closeAction} />
      )}

      {selectedAction === "delete" && selectedUserId !== null && (
        <DeleteUserModal userId={selectedUserId} onClose={closeAction} />
      )}
    </div>
  );
}
