import { createSlice } from "@reduxjs/toolkit";
import {
  createFamilyMember,
  fetchFamilyMembers,
  removeFamilyMember,
} from "./familyMembersThunk";

const initialState = {
  items: [],
  status: "idle",
  creating: false,
  deleting: false,
  currentRequestId: null,
  error: null,
};

const familyMembersSlice = createSlice({
  name: "familyMembers",
  initialState,
  reducers: {
    clearFamilyMembers: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFamilyMembers.pending, (state, action) => {
        state.items = [];
        state.status = "loading";
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchFamilyMembers.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        const fetchedIds = new Set(action.payload.map((member) => member.id));
        const newlyAddedMembers = state.items.filter((member) => !fetchedIds.has(member.id));
        state.items = [...newlyAddedMembers, ...action.payload];
        state.status = "succeeded";
        state.currentRequestId = null;
      })
      .addCase(fetchFamilyMembers.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.status = "failed";
        state.error = action.payload || action.error.message || "Unable to load family members.";
        state.currentRequestId = null;
      })
      .addCase(createFamilyMember.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createFamilyMember.fulfilled, (state, action) => {
        state.creating = false;
        if (!state.items.some((member) => member.id === action.payload.id)) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(createFamilyMember.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || action.error.message || "Unable to add family member.";
      })
      .addCase(removeFamilyMember.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removeFamilyMember.fulfilled, (state, action) => {
        state.deleting = false;
        state.items = state.items.filter((member) => member.id !== action.payload);
        state.status = "succeeded";
        state.currentRequestId = null;
      })
      .addCase(removeFamilyMember.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || action.error.message || "Unable to delete family member.";
      });
  },
});

export const { clearFamilyMembers } = familyMembersSlice.actions;
export default familyMembersSlice.reducer;
