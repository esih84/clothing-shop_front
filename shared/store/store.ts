import { configureStore } from "@reduxjs/toolkit";

import storage from "redux-persist/lib/storage";
import { reducers } from "./reducers";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
/**
 * Rehydration is started manually (see `Providers`) instead of at import time.
 *
 * With the default behaviour redux-persist reads localStorage as soon as this module is imported,
 * which can dispatch REHYDRATE while React is still hydrating the server HTML. Starting it from an
 * effect guarantees the first client render matches the server render.
 *
 * `manualPersist` is supported at runtime but missing from redux-persist's PersistorOptions typings.
 */
const persistorOptions = {
  manualPersist: true,
} as Parameters<typeof persistStore>[1];

export const persistor = persistStore(store, persistorOptions);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
