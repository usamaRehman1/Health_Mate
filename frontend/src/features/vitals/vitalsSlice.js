import { createSlice } from "@reduxjs/toolkit";
import { createVital, fetchVitals } from "./vitalsThunk";

const initialState = {
  items: [],
  status: "idle",
  saving: false,
  currentRequestId: null,
  error: null,
};

const vitalsSlice = createSlice({
  name: "vitals",
  initialState,
  reducers: {
    clearVitals: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVitals.pending, (state, action) => {
        state.items = [];
        state.status = "loading";
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchVitals.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        const fetchedIds = new Set(action.payload.map((vital) => vital.id));
        const newlyAddedVitals = state.items.filter((vital) => !fetchedIds.has(vital.id));
        state.items = [...newlyAddedVitals, ...action.payload];
        state.status = "succeeded";
        state.currentRequestId = null;
      })
      .addCase(fetchVitals.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.status = "failed";
        state.error = action.payload || action.error.message || "Unable to load vitals.";
        state.currentRequestId = null;
      })
      .addCase(createVital.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createVital.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createVital.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || action.error.message || "Unable to save vitals.";
      });
  },
});

export const { clearVitals } = vitalsSlice.actions;
export default vitalsSlice.reducer;
