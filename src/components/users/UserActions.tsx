"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

interface UserActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function UserActions({
  onView,
  onEdit,
  onDelete,
}: UserActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* View */}
      <button
        type="button"
        onClick={onView}
        title="View User"
        aria-label="View User"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#71817C] transition-all hover:bg-[#E8F3EF] hover:text-[#005F4E]"
      >
        <Eye size={17} strokeWidth={2} />
      </button>

      {/* Edit */}
      <button
        type="button"
        onClick={onEdit}
        title="Edit User"
        aria-label="Edit User"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#71817C] transition-all hover:bg-sky-50 hover:text-[#0284C7]"
      >
        <Pencil size={17} strokeWidth={2} />
      </button>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        title="Delete User"
        aria-label="Delete User"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#71817C] transition-all hover:bg-red-50 hover:text-[#C2413A]"
      >
        <Trash2 size={17} strokeWidth={2} />
      </button>
    </div>
  );
}