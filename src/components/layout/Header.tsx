"use client";

import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-10 pt-2 shrink-0 items-center justify-center bg-[#f7f9f8] px-4 sm:px-6 lg:px-8">
      {/* ========================================================= */}
      {/* CENTER SEARCH */}
      {/* ========================================================= */}

      <div
        className="
          group flex h-10 w-full max-w-[520px]
          items-center gap-2.5
          rounded-full
          border border-[#e2e9e6]
          bg-white
          px-4
          shadow-[0_2px_10px_rgba(30,60,55,0.035)]
          transition-all duration-200
          hover:border-[#d5e2de]
          hover:shadow-[0_4px_16px_rgba(30,60,55,0.055)]
          focus-within:border-[#b9d2ca]
          focus-within:shadow-[0_4px_18px_rgba(30,60,55,0.07)]
          sm:h-10
        "
      >
        {/* Search Icon */}
        <Search
          size={17}
          strokeWidth={1.8}
          className="
            shrink-0
            text-[#9aa6a4]
            transition-colors duration-200
            group-focus-within:text-[#52766b]
          "
        />

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search anything..."
          aria-label="Search"
          className="
            min-w-0 flex-1
            bg-transparent
            text-xs
            text-[#18302d]
            outline-none
            placeholder:text-[#a0aaa8]
            sm:text-[13px]
          "
        />

        {/* Keyboard Shortcut */}
        <span
          className="
            hidden shrink-0
            rounded-md
            border border-[#e7ecea]
            bg-[#fafcfb]
            px-2 py-1
            text-[9px]
            font-medium
            tracking-wide
            text-[#9aa6a4]
            sm:inline-flex
          "
        >
          ⌘ K
        </span>
      </div>
    </header>
  );
}