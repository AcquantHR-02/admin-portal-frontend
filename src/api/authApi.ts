import { baseApi } from "./baseApi";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginData {
  token: string;
  tokenType: string | null;
  email: string;
  userId: number;
  name: string;
  role?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
  timestamp: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;