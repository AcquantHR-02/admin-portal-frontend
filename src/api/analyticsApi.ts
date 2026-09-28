import { ApiResponse, PaginatedResponse } from "@/types/common.type";
import { baseApi } from "./baseApi";

import {
  FormsSummary,
  FormsSummaryParams,
  FormTypeDistribution,
  MonthlyFormTrend,
  MonthlyTrendsParams,
  UserFormUsage,
  UserFormUsageParams,
  UserHistoryParams,
  FormHistory,
  UserStatusSummary,
  RecentActivityItem,
  RecentActivityParams,
} from "@/types/analytics.types";

/* =========================
   Analytics API
========================= */

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* =========================
       Forms Summary
    ========================= */

    getFormsSummary: builder.query<
      ApiResponse<FormsSummary>,
      FormsSummaryParams | void
    >({
      query: (params) => ({
        url: "/admin/analytics/forms/summary",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["Analytics"],
    }),

    /* =========================
       Monthly Form Trends
    ========================= */

    getMonthlyTrends: builder.query<
      ApiResponse<MonthlyFormTrend[]>,
      MonthlyTrendsParams | void
    >({
      query: (params) => ({
        url: "/admin/analytics/forms/monthly-trends",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["Analytics"],
    }),

    /* =========================
       User Form Usage
       (supports period / startDate / endDate filters)
    ========================= */

    getUserFormUsage: builder.query<
      ApiResponse<PaginatedResponse<UserFormUsage>>,
      UserFormUsageParams | void
    >({
      query: (params) => ({
        url: "/admin/analytics/users/form-usage",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["Analytics"],
    }),

    /* =========================
       User Form History
    ========================= */

    getUserHistory: builder.query<
      ApiResponse<PaginatedResponse<FormHistory>>,
      UserHistoryParams
    >({
      query: ({
        userId,
        formType,
        period,
        startDate,
        endDate,
        page,
        size,
      }) => ({
        url: `/admin/analytics/users/${userId}/history`,
        method: "GET",
        params: {
          formType,
          period,
          startDate,
          endDate,
          page,
          size,
        },
      }),
      providesTags: ["Analytics"],
    }),

    /* =========================
       User Status Summary
    ========================= */

    getUserStatusSummary: builder.query<ApiResponse<UserStatusSummary>, void>({
      query: () => ({
        url: "/admin/analytics/users/status-summary",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),

    /* =========================
       Forms By Type
    ========================= */

    getFormsByType: builder.query<ApiResponse<FormTypeDistribution[]>, void>({
      query: () => ({
        url: "/admin/analytics/forms/by-type",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),

    /* =========================
       Recent Activity (dashboard)
       NOTE: change the URL to match your backend
    ========================= */

    getRecentActivity: builder.query<
      ApiResponse<RecentActivityItem[]>,
      RecentActivityParams | void
    >({
      query: (params) => ({
        url: "/admin/analytics/recent-activity",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

/* =========================
   Hooks
========================= */

export const {
  useGetFormsSummaryQuery,
  useGetMonthlyTrendsQuery,
  useGetUserFormUsageQuery,
  useGetUserHistoryQuery,
  useGetUserStatusSummaryQuery,
  useGetFormsByTypeQuery,
  useGetRecentActivityQuery,
} = analyticsApi;