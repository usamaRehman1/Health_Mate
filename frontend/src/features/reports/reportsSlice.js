import { createSlice } from "@reduxjs/toolkit";
import { fetchReports, uploadReport } from "./reportsThunk";

const initialState = {
  items: [],
  status: "idle",
  uploading: false,
  currentRequestId: null,
  error: null,
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReports: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        const fetchedIds = new Set(action.payload.map((report) => report.id));
        const existingReports = state.items.filter((report) => !fetchedIds.has(report.id));
        state.items = [...existingReports, ...action.payload];
        state.status = "succeeded";
        state.currentRequestId = null;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.status = "failed";
        state.error = action.payload || action.error.message || "Unable to load reports.";
        state.currentRequestId = null;
      })
      .addCase(uploadReport.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadReport.fulfilled, (state, action) => {
        state.uploading = false;
        state.items.unshift(action.payload);
      })
      .addCase(uploadReport.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload || action.error.message || "Unable to upload report.";
      });
  },
});

export const { clearReports } = reportsSlice.actions;
export default reportsSlice.reducer;
