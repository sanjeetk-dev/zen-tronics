import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const applyCoupon = createAsyncThunk(
  "cart/applyCoupon",
  async (couponCode, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/coupons/apply", { couponCode });
      return response.data; // Backend should return { discountAmount, couponId }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  items: [],
  totalAmount: 0,
  discountAmount: 0,
  appliedCoupon: null,
  shippingCharge: 0,
  shippingDiscount: 0,
  taxAmount: 0,
  finalAmount: 0,
  totalQuantity: 0,
  couponError: null, // Track errors
};

const calculateTotals = (state) => {
  state.totalAmount = state.items.reduce((sum, item) => sum + item.total, 0);
  state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.finalAmount = state.totalAmount - state.discountAmount + state.shippingCharge - state.shippingDiscount + state.taxAmount;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity, price, discount } = action.payload;
      const existingItem = state.items.find((item) => item.product === product);

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.total = existingItem.quantity * price - discount * existingItem.quantity;
      } else {
        state.items.push({
          product,
          quantity,
          price,
          total: quantity * price - discount * quantity,
          discount,
        });
      }

      calculateTotals(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.product !== action.payload);
      calculateTotals(state);
    },

    updateQuantity: (state, action) => {
      const { product, quantity } = action.payload;
      const item = state.items.find((item) => item.product === product);
      if (item) {
        item.quantity = quantity;
        item.total = item.quantity * item.price - item.discount * item.quantity;
      }
      calculateTotals(state);
    },

    updateShipping: (state, action) => {
      state.shippingCharge = action.payload.shippingCharge;
      state.shippingDiscount = action.payload.shippingDiscount;
      calculateTotals(state);
    },

    updateTax: (state, action) => {
      state.taxAmount = action.payload.taxAmount;
      calculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.discountAmount = 0;
      state.appliedCoupon = null;
      state.shippingCharge = 0;
      state.shippingDiscount = 0;
      state.taxAmount = 0;
      state.finalAmount = 0;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.appliedCoupon = action.payload.couponId;
        state.discountAmount = action.payload.discountAmount;
        state.couponError = null;
        calculateTotals(state);
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.couponError = action.payload || "Invalid coupon.";
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateShipping,
  updateTax,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
