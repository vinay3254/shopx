import { baseApi } from "./baseApi.js";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: ["Order", "Cart"]
    }),
    payOrder: builder.mutation({
      query: ({ id, body }) => ({ url: `/orders/${id}/pay`, method: "POST", body }),
      invalidatesTags: ["Order", "Cart", "Product"]
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({ url: `/orders/${id}/cancel`, method: "POST" }),
      invalidatesTags: ["Order", "Product"]
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }]
    }),
    getMyOrders: builder.query({
      query: () => "/users/me/orders",
      providesTags: ["Order"]
    }),
    getAdminOrders: builder.query({
      query: (params = {}) => ({ url: "/orders/admin/all", params }),
      providesTags: ["Order"]
    }),
    getSellerOrders: builder.query({
      query: () => "/orders/seller/mine",
      providesTags: ["Order"]
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, body }) => ({ url: `/orders/admin/${id}/status`, method: "PUT", body }),
      invalidatesTags: ["Order"]
    })
  })
});

export const {
  useCancelOrderMutation,
  useCreateOrderMutation,
  useGetAdminOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderQuery,
  useGetSellerOrdersQuery,
  usePayOrderMutation,
  useUpdateOrderStatusMutation
} = ordersApi;
