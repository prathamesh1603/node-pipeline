import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import commonSlice from "./commonSlice";
import authReducer from "./authSlice";
import fieldReducer from "./fieldSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedCrmsReducer = persistReducer(persistConfig, commonSlice);

export const store = configureStore({
  reducer: {
    crms: persistedCrmsReducer,
    auth: authReducer,
    field: fieldReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true, serializableCheck: false }),
});

// Define RootState and AppDispatch types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
