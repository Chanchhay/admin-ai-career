import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./api/baseApi";
import uiReducer from "./features/uiSlice";

// Import for side effects: registers injected endpoints on the single baseApi.
import "./api/companyApi";
import "./api/jobApi";
import "./api/profileApi";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // RTK Query attaches native Request/Response objects here, and our
          // createCompany mutation sends FormData (a File) — all non-serializable
          // by design. Ignore these specific paths rather than disabling the check.
          ignoredActions: [
            "api/executeQuery/fulfilled",
            "api/executeQuery/rejected",
            "api/executeMutation/fulfilled",
            "api/executeMutation/rejected",
          ],
          ignoredActionPaths: [
            "meta.arg.originalArgs.logo",
            "meta.baseQueryMeta.request",
            "meta.baseQueryMeta.response",
          ],
        },
      }).concat(baseApi.middleware),
  });

  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];