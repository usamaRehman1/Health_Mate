import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addFamilyMemberAPI,
  deleteFamilyMemberAPI,
  getFamilyMembersAPI,
} from "./familyMembersApi";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const normalizeFamilyMember = (member) => {
  const id = member?._id ?? member?.id;
  if (!id || !member?.name || !member?.relation) {
    throw new Error("The server returned an invalid family member.");
  }

  return {
    id: String(id),
    name: member.name,
    relation: member.relation,
  };
};

export const fetchFamilyMembers = createAsyncThunk(
  "familyMembers/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFamilyMembersAPI();
      const members = response.data?.data;
      if (!Array.isArray(members)) {
        throw new Error("The server returned an invalid family member list.");
      }
      return members.map(normalizeFamilyMember);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to load family members."));
    }
  }
);

export const createFamilyMember = createAsyncThunk(
  "familyMembers/create",
  async (member, { rejectWithValue }) => {
    try {
      const response = await addFamilyMemberAPI({
        name: member.name.trim(),
        relation: member.relation,
      });
      console.log("createFamilyMember Response", response)
      return normalizeFamilyMember(response.data?.data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to add family member."));
    }
  }
);

export const removeFamilyMember = createAsyncThunk(
  "familyMembers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteFamilyMemberAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to delete family member."));
    }
  }
);
