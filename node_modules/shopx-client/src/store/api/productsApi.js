import { baseApi } from "./baseApi.js";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => ({ url: "/products", params }),
      providesTags: ["Product"]
    }),
    getFeaturedProducts: builder.query({
      query: () => "/products/featured",
      providesTags: ["Product"]
    }),
    searchProducts: builder.query({
      query: (q) => ({ url: "/products/search", params: { q } }),
      providesTags: ["Product"]
    }),
    getMyProducts: builder.query({
      query: () => "/products/mine",
      providesTags: ["Product"]
    }),
    getProductBySlug: builder.query({
      query: (slug) => `/products/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "Product", id: slug }]
    }),
    createProduct: builder.mutation({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: ["Product"]
    }),
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({ url: `/products/${id}`, method: "PUT", body }),
      invalidatesTags: ["Product"]
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product"]
    })
  })
});

export const {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetFeaturedProductsQuery,
  useGetMyProductsQuery,
  useGetProductBySlugQuery,
  useGetProductsQuery,
  useSearchProductsQuery,
  useUpdateProductMutation
} = productsApi;
