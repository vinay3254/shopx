import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    productIds: []
  },
  reducers: {
    setWishlist: (state, action) => {
      state.productIds = action.payload.map((item) => (typeof item === "string" ? item : item._id));
    }
  }
});

export const { setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
