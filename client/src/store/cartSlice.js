import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    itemCount: 0
  },
  reducers: {
    setCartFromServer: (state, action) => {
      const items = action.payload?.items || [];
      state.items = items;
      state.total = items.reduce((sum, item) => (item.savedForLater ? sum : sum + item.product.price * item.qty), 0);
      state.itemCount = items.reduce((sum, item) => (item.savedForLater ? sum : sum + item.qty), 0);
    },
    clearCartLocal: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    }
  }
});

export const { clearCartLocal, setCartFromServer } = cartSlice.actions;
export default cartSlice.reducer;
