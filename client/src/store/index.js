import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import cartReducer from "./cartSlice.js";
import uiReducer from "./uiSlice.js";
import wishlistReducer from "./wishlistSlice.js";
import { baseApi } from "./api/baseApi.js";
import "./api/authApi.js";
import "./api/cartApi.js";
import "./api/categoriesApi.js";
import "./api/ordersApi.js";
import "./api/productsApi.js";
import "./api/reviewsApi.js";
import "./api/usersApi.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware)
});
