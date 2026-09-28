
/* =========================
   Forms Summary
========================= */

export interface FormsSummary {
  totalFormsGenerated: number;
  formsToday?: number;
  formsThisMonth?: number;
  periodStart?: string;
  periodEnd?: string;
  period?: string;
}

export interface FormsSummaryParams {
  period?: string;
  startDate?: string;
  endDate?: string;
}


/* =========================
   User Status
========================= */

export interface UserStatusSummary {
  totalActiveUsers: number;
  totalInactiveUsers: number;
  totalUsers: number;
}


/* =========================
   Monthly Form Trends
========================= */

export interface MonthlyFormTrend {
  month: string;
  count: number;
}

export interface MonthlyTrendsParams {
  period?: string;
  startDate?: string;
  endDate?: string;
}


/* =========================
   User Form Usage
========================= */

export interface UserFormUsage {
  userId: number;
  email: string;
  name: string;
  totalFormsGenerated: number;
}

export interface UserFormUsageParams {
  period?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}


/* =========================
   User Form History
========================= */

export interface FormHistory {
  id: number;
  formType: string;
  fileName: string;
  generatedAt: string;
}

export interface UserHistoryParams {
  userId: number;
  formType?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}


/* =========================
   Forms By Type
========================= */

export interface FormTypeDistribution {
  formType: string;
  count: number;
  percentage: number;
}


/* =========================
   Common Analytics Filters
========================= */

export interface AnalyticsFilters {
  period?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface RecentActivityItem {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  action: string;
  formType: string;
  description?: string;
  createdAt: string;
}

export interface RecentActivityParams {
  period?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}