import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import userReducer from "./slices/user.slice";
import adminReducer from "./slices/admin.slice";
import cartReducer from "./slices/cart.slice"; // Import cart slice

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "admin", "cart"], // Persist cart as well
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedAdminReducer = persistReducer(persistConfig, adminReducer);
const persistedCartReducer = persistReducer(persistConfig, cartReducer); // Persist cart

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    admin: persistedAdminReducer,
    cart: persistedCartReducer, // Add cart to the store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }),
});

export const persistor = persistStore(store);
