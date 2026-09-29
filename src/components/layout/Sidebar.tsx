"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Headphones,
  LayoutDashboard,
  Users,
} from "lucide-react";
import UserProfile from "../common/UserProfile";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Support Center",
    href: "/support-center",
    icon: Headphones,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        group/sidebar
        relative
        z-40
        flex
        h-screen
        w-[72px]
        shrink-0
        flex-col
        overflow-hidden
        border-r
        border-[#D5E4DF]
        bg-[#FFFFFF]
        shadow-[4px_0_24px_rgba(0,95,78,0.06)]
        transition-[width,box-shadow]
        duration-300
        ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:w-[220px]
        hover:shadow-[10px_0_36px_rgba(0,95,78,0.12)]
      "
    >
      {/* =====================================================
          LOGO
      ====================================================== */}
      <div
        className="
          relative
          flex
          h-[82px]
          w-full
          shrink-0
          items-center
          justify-center
          border-b
          border-[#D5E4DF]
          bg-[#FFFFFF]
        "
      >
        <Link
          href="/dashboard"
          aria-label="Go to dashboard"
          className="
            relative
            flex
            h-full
            w-full
            items-center
            justify-center
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-inset
            focus-visible:ring-[#005F4E]/30
          "
        >
          {/* Collapsed Logo */}
          <div
            className="
              absolute
              left-1/2
              top-1/2
              flex
              h-11
              w-11
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-xl
              transition-all
              duration-200
              group-hover/sidebar:scale-95
              group-hover/sidebar:opacity-0
            "
          >
            <Image
              src="/images/A-logo.png"
              alt="AcquantHR"
              width={44}
              height={44}
              priority
              className="h-11 w-11 object-contain"
            />
          </div>

          {/* Expanded Logo */}
          <Image
            src="/images/acquanthr-logo.png"
            alt="AcquantHR"
            width={160}
            height={62}
            priority
            className="
              absolute
              left-1/2
              top-1/2
              h-auto
              w-[155px]
              -translate-x-1/2
              -translate-y-1/2
              opacity-0
              transition-opacity
              duration-200
              group-hover/sidebar:opacity-100
            "
          />
        </Link>
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <nav
        className="
          min-h-0
          flex-1
          overflow-hidden
          px-3
          py-5
        "
      >
        {/* Section Label */}
        <div
          className="
            mb-3
            overflow-hidden
            whitespace-nowrap
            px-3
            text-[11px]
            font-medium
            text-[#8A9994]
            opacity-0
            transition-opacity
            duration-200
            group-hover/sidebar:opacity-100
          "
        >
          Main menu
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                aria-current={isActive ? "page" : undefined}
                className={`
                  group/item
                  flex
                  h-[44px]
                  w-full
                  items-center
                  rounded-xl
                  px-[14px]
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#005F4E]/40

                  ${
                    isActive ?
                      `
                        bg-[#005F4E]
                        text-white
                        shadow-[0_6px_16px_rgba(0,95,78,0.22)]
                      `
                    : `
                        text-[#667873]
                        hover:bg-[#E8F3EF]
                        hover:text-[#005F4E]
                      `
                  }
                `}
              >
                {/* Icon */}
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={`
                    shrink-0
                    transition-all
                    duration-200

                    ${
                      isActive ? "text-white" : (
                        "text-[#80918C] group-hover/item:text-[#005F4E]"
                      )
                    }
                  `}
                />

                {/* Label */}
                <span
                  className="
                    ml-3.5
                    whitespace-nowrap
                    translate-x-[-4px]
                    opacity-0
                    transition-all
                    duration-200
                    group-hover/sidebar:translate-x-0
                    group-hover/sidebar:opacity-100
                  "
                >
                  {item.label}
                </span>

                {/* Active dot: sirf expanded state me, current page batata hai */}
                {isActive && (
                  <span
                    className="
                      ml-auto
                      h-1.5
                      w-1.5
                      shrink-0
                      rounded-full
                      bg-white/80
                      opacity-0
                      transition-opacity
                      duration-200
                      group-hover/sidebar:opacity-100
                    "
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* =====================================================
          BOTTOM SECTION
      ====================================================== */}
      <div
        className="
          w-full
          shrink-0
          border-t
          border-[#E8EFEC]
          bg-[#FFFFFF]
          px-2
          pb-3
          pt-3
        "
      >
        {/* ===================================================
            USER PROFILE
        ==================================================== */}
        <div
          className="
            w-full
            overflow-hidden
            rounded-xl
            transition-colors
            duration-200
          "
        >
          <UserProfile />
        </div>
      </div>
    </aside>
  );
}