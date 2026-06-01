import { setCartFromServer } from "../cartSlice.js";
import { baseApi } from "./baseApi.js";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCartFromServer(data.cart));
      }
    }),
    addToCart: builder.mutation({
      query: (body) => ({ url: "/cart/add", method: "POST", body }),
      invalidatesTags: ["Cart"]
    }),
    updateCartItem: builder.mutation({
      query: ({ productId, body }) => ({ url: `/cart/item/${productId}`, method: "PUT", body }),
      invalidatesTags: ["Cart"]
    }),
    removeCartItem: builder.mutation({
      query: (productId) => ({ url: `/cart/item/${productId}`, method: "DELETE" }),
      invalidatesTags: ["Cart"]
    }),
    clearCart: builder.mutation({
      query: () => ({ url: "/cart", method: "DELETE" }),
      invalidatesTags: ["Cart"]
    })
  })
});

export const { useAddToCartMutation, useClearCartMutation, useGetCartQuery, useRemoveCartItemMutation, useUpdateCartItemMutation } = cartApi;
