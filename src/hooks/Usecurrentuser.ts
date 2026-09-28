"use client";

import { useCallback, useEffect, useState } from "react";

export interface CurrentUser {
  name: string;
  email: string;
  role: string;
}

const DEFAULT_USER: CurrentUser = {
  name: "Administrator",
  email: "",
  role: "ADMIN",
};

/* Keys where a login flow commonly stores the user / token */
const USER_KEYS = ["user", "authUser", "userInfo", "currentUser", "admin", "profile"];
const TOKEN_KEYS = ["authToken", "token", "accessToken", "access_token", "jwt"];

/* ---------- helpers ---------- */

function readJson(storage: Storage, key: string): unknown {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function pick(obj: Record<string, unknown> | null | undefined, keys: string[]) {
  if (!obj) return "";

  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}

function capitalize(text: string) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

/* Turns any user-like object (or JWT payload) into { name, email, role } */
function normalize(raw: unknown): { name: string; email: string; role: string } | null {
  if (!raw || typeof raw !== "object") return null;

  const obj = raw as Record<string, any>;
  const src: Record<string, any> = obj.user ?? obj.data?.user ?? obj.data ?? obj;

  const first = pick(src, ["firstName", "first_name", "givenName", "given_name"]);
  const last = pick(src, ["lastName", "last_name", "familyName", "family_name"]);

  const name =
    pick(src, ["name", "fullName", "full_name", "displayName", "userName", "username", "preferred_username"]) ||
    `${first} ${last}`.trim();

  const email =
    pick(src, ["email", "emailId", "mail"]) ||
    (typeof src.sub === "string" && src.sub.includes("@") ? src.sub : "");

  let role = pick(src, ["role", "userRole"]);

  if (!role && Array.isArray(src.roles) && src.roles.length > 0) {
    const firstRole = src.roles[0];
    role = typeof firstRole === "string" ? firstRole : firstRole?.name ?? "";
  }

  if (!role && src.role && typeof src.role === "object") {
    role = src.role.name ?? "";
  }

  if (!name && !email) return null;

  return { name, email, role };
}

function decodeJwt(token: string): unknown {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const binary = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const json = decodeURIComponent(
      Array.from(binary)
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

/* Looks through sessionStorage, then localStorage, then the JWT itself */
function findUser(): CurrentUser | null {
  const storages = [window.sessionStorage, window.localStorage];

  for (const storage of storages) {
    for (const key of USER_KEYS) {
      const found = normalize(readJson(storage, key));
      if (found) return toUser(found);
    }
  }

  for (const storage of storages) {
    for (const key of TOKEN_KEYS) {
      const token = storage.getItem(key);
      if (!token) continue;

      const found = normalize(decodeJwt(token.replace(/^Bearer\s+/i, "")));
      if (found) return toUser(found);
    }
  }

  return null;
}

function toUser(found: { name: string; email: string; role: string }): CurrentUser {
  return {
    name: found.name || capitalize(found.email.split("@")[0]) || DEFAULT_USER.name,
    email: found.email,
    role: found.role || DEFAULT_USER.role,
  };
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/* ---------- hook ---------- */

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser>(DEFAULT_USER);
  const [greeting, setGreeting] = useState("Welcome back");

  const load = useCallback(() => {
    const found = findUser();

    if (found) {
      setUser(found);
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[useCurrentUser] No logged-in user found.",
        "sessionStorage keys:",
        Object.keys(window.sessionStorage),
        "localStorage keys:",
        Object.keys(window.localStorage)
      );
    }
  }, []);

  useEffect(() => {
    setGreeting(getGreeting());
    load();

    /* Re-read when storage changes or the tab regains focus */
    window.addEventListener("storage", load);
    window.addEventListener("focus", load);

    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("focus", load);
    };
  }, [load]);

  const firstName = user.name.trim().split(/\s+/)[0] || user.name;

  return {
    user,
    firstName,
    initials: getInitials(user.name),
    greeting,
  };
}