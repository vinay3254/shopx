import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutLocal, setCredentials } from "../authSlice.js";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refresh = await rawBaseQuery({ url: "/auth/refresh", method: "POST" }, api, extraOptions);
    if (refresh.data?.accessToken) {
      api.dispatch(setCredentials(refresh.data));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logoutLocal());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "shopxApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "Cart", "Order", "User", "Wishlist", "Review", "Category"],
  endpoints: () => ({})
});
