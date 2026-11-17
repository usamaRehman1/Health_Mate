import { createAsyncThunk } from "@reduxjs/toolkit";
import { addVitalAPI, getVitalsAPI } from "./vitalsApi";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const normalizeVital = (vital) => {
  const id = vital?._id ?? vital?.id;
  if (!id) {
    throw new Error("The server returned an invalid vital record.");
  }

  const bloodPressure = vital.bp && typeof vital.bp === "object"
    ? `${vital.bp.systolic}/${vital.bp.diastolic}`
    : vital.bp;
  const parsedDate = new Date(vital.date);

  return {
    id: String(id),
    memberId: vital.familyMemberId ? String(vital.familyMemberId) : "primary",
    date: Number.isNaN(parsedDate.getTime())
      ? String(vital.date || "")
      : parsedDate.toISOString().slice(0, 10),
    bp: bloodPressure || "",
    sugar: vital.sugar,
    weight: vital.weight,
    notes: vital.notes || "",
  };
};

export const fetchVitals = createAsyncThunk(
  "vitals/fetch",
  async (familyMemberIds = [], { rejectWithValue }) => {
    try {
      const responses = await Promise.all([
        getVitalsAPI(),
        ...familyMemberIds.map((id) => getVitalsAPI(id)),
      ]);
      return responses.flatMap((response) => {
        const vitals = response.data?.data;
        if (!Array.isArray(vitals)) {
          throw new Error("The server returned an invalid vital list.");
        }
        return vitals.map(normalizeVital);
      });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to load vitals."));
    }
  }
);

export const createVital = createAsyncThunk(
  "vitals/create",
  async (vital, { rejectWithValue }) => {
    try {
      const { memberId, ...values } = vital;
      const response = await addVitalAPI({
        ...values,
        familyMemberId: memberId === "primary" ? null : memberId,
      });
      return normalizeVital(response.data?.data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to save vitals."));
    }
  }
);
