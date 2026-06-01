import { baseApi } from "./baseApi.js";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Category"]
    }),
    getCategoryProducts: builder.query({
      query: (slug) => `/categories/${slug}/products`,
      providesTags: ["Product", "Category"]
    }),
    createCategory: builder.mutation({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: ["Category"]
    }),
    updateCategory: builder.mutation({
      query: ({ id, body }) => ({ url: `/categories/${id}`, method: "PUT", body }),
      invalidatesTags: ["Category"]
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["Category"]
    })
  })
});

export const {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryProductsQuery,
  useUpdateCategoryMutation
} = categoriesApi;
