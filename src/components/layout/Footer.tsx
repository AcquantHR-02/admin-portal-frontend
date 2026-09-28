"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[#e7ecea] bg-[#f7f9f8] px-6 py-2 sm:px-8 border-none">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-[0_1px_6px_rgba(30,60,55,0.04)]">
            <Image
              src="/acquanthr-logo.png"
              alt="AcquantHR"
              width={22}
              height={22}
              className="h-[22px] w-[22px] object-contain"
            />
          </div>

          <div>
            <p className="text-[11px] font-semibold text-[#526462]">
              AcquantHR
            </p>

            <p className="text-[9px] text-[#9aa6a4]">
              Administrative Portal
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <p className="text-[10px] text-[#8d9997]">
            © 2026 AcquantHR. All rights reserved.
          </p>

          <p className="text-[9px] text-[#a5afad]">
            Admin Portal · v1.0.1
          </p>
        </div>

      </div>
    </footer>
  );
}