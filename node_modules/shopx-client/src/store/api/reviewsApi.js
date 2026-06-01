import { baseApi } from "./baseApi.js";

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: ({ productId, page = 1 }) => ({ url: `/reviews/${productId}`, params: { page } }),
      providesTags: ["Review"]
    }),
    createReview: builder.mutation({
      query: ({ productId, body }) => ({ url: `/reviews/${productId}`, method: "POST", body }),
      invalidatesTags: ["Review", "Product"]
    }),
    updateReview: builder.mutation({
      query: ({ id, body }) => ({ url: `/reviews/${id}`, method: "PUT", body }),
      invalidatesTags: ["Review", "Product"]
    }),
    deleteReview: builder.mutation({
      query: (id) => ({ url: `/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: ["Review", "Product"]
    }),
    markHelpful: builder.mutation({
      query: (id) => ({ url: `/reviews/${id}/helpful`, method: "POST" }),
      invalidatesTags: ["Review"]
    })
  })
});

export const {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetProductReviewsQuery,
  useMarkHelpfulMutation,
  useUpdateReviewMutation
} = reviewsApi;
