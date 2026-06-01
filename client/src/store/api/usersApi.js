import { updateUser } from "../authSlice.js";
import { setWishlist } from "../wishlistSlice.js";
import { baseApi } from "./baseApi.js";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/users/me",
      providesTags: ["User"]
    }),
    updateMe: builder.mutation({
      query: (body) => ({ url: "/users/me", method: "PUT", body }),
      invalidatesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(updateUser(data.user));
      }
    }),
    addAddress: builder.mutation({
      query: (body) => ({ url: "/users/me/address", method: "POST", body }),
      invalidatesTags: ["User"]
    }),
    updateAddress: builder.mutation({
      query: ({ id, body }) => ({ url: `/users/me/address/${id}`, method: "PUT", body }),
      invalidatesTags: ["User"]
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({ url: `/users/me/address/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"]
    }),
    getWishlist: builder.query({
      query: () => "/users/me/wishlist",
      providesTags: ["Wishlist"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setWishlist(data.wishlist));
      }
    }),
    toggleWishlist: builder.mutation({
      query: (productId) => ({ url: `/users/me/wishlist/${productId}`, method: "POST" }),
      invalidatesTags: ["Wishlist"]
    }),
    getAdminUsers: builder.query({
      query: (params = {}) => ({ url: "/users/admin/all", params }),
      providesTags: ["User"]
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({ url: `/users/admin/${id}/role`, method: "PUT", body: { role } }),
      invalidatesTags: ["User"]
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/users/admin/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"]
    })
  })
});

export const {
  useAddAddressMutation,
  useDeleteUserMutation,
  useDeleteAddressMutation,
  useGetAdminUsersQuery,
  useGetMeQuery,
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useUpdateAddressMutation,
  useUpdateMeMutation,
  useUpdateUserRoleMutation
} = usersApi;
