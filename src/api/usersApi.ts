import { ApiResponse, PaginatedResponse } from "@/types/common.type";
import {
  CreateUserRequest,
  ResetPasswordRequest,
  UpdateUserRequest,
  User,
  UserFilters,
} from "@/types/user.types";
import { baseApi } from "./baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Users
    getUsers: builder.query<
      ApiResponse<PaginatedResponse<User>>,
      UserFilters | void
    >({
      query: (params) => ({
        url: "/admin/users",
        method: "GET",
        params: params ?? undefined,
      }),

      providesTags: ["Users"],
    }),

    // Get User By ID
    getUserById: builder.query<ApiResponse<User>, number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "GET",
      }),

      providesTags: ["Users"],
    }),

    // Create User
    createUser: builder.mutation<ApiResponse<User>, CreateUserRequest>({
      query: (data) => ({
        url: "/admin/users",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Users"],
    }),

    // Update User
    updateUser: builder.mutation<
      ApiResponse<User>,
      {
        id: number;
        data: UpdateUserRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: ["Users"],
    }),

    // Reset Password
    resetUserPassword: builder.mutation<
      ApiResponse<void>,
      {
        id: number;
        data: ResetPasswordRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}/reset-password`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["Users"],
    }),

    // Toggle Active / Inactive
    toggleUserActive: builder.mutation<ApiResponse<User>, number>({
      query: (id) => ({
        url: `/admin/users/${id}/toggle-active`,
        method: "PATCH",
      }),

      invalidatesTags: ["Users"],
    }),

    // Delete User
    deleteUser: builder.mutation<ApiResponse<User>, number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useResetUserPasswordMutation,
  useToggleUserActiveMutation,
  useDeleteUserMutation,
} = usersApi;
