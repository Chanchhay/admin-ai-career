import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiState = {
  mobileNavigationOpen: boolean;
  /**
   * Whether the desktop rail shows its labels.
   *
   * Starts collapsed so the server and the first client render agree; the
   * stored preference is applied on mount, which the rail's width transition
   * absorbs.
   */
  sidebarExpanded: boolean;
};

const initialState: UiState = {
  mobileNavigationOpen: false,
  sidebarExpanded: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMobileNavigationOpen(state, action: PayloadAction<boolean>) {
      state.mobileNavigationOpen = action.payload;
    },
    setSidebarExpanded(state, action: PayloadAction<boolean>) {
      state.sidebarExpanded = action.payload;
    },
  },
});

export const { setMobileNavigationOpen, setSidebarExpanded } = uiSlice.actions;
export default uiSlice.reducer;
