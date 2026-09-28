import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    // Keep all API modules on this base URL so changing between a LAN host and
    // a tunnel does not change how authentication headers are applied.
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, ""),

    prepareHeaders: (headers) => {
      // ngrok requires this header on actual requests as well as preflights.
      headers.set("ngrok-skip-browser-warning", "true");

      if (typeof window !== "undefined") {
        const token = sessionStorage.getItem("authToken");

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  }),

  tagTypes: ["Auth", "Users", "Analytics"],

  endpoints: () => ({}),
});
