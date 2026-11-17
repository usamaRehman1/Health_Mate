import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserAPI, loginAPI, registerAPI } from "./authApi";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await loginAPI(userData);
      const { token, user } = response.data;

      if (!token || !user?.id) {
        return thunkAPI.rejectWithValue("The server returned an invalid login response.");
      }

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/signup",
  async (userData, thunkAPI) => {
    try {
      const response = await registerAPI(userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Registration failed"));
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/currentUser",
  async (_, thunkAPI) => {
    const id = localStorage.getItem("healthMateID");
    if (!id) {
      return thunkAPI.rejectWithValue({
        message: "No saved user ID found",
        status: null,
      });
    }

    try {
      const response = await getUserAPI(id);
      const payload = response.data;
      const user = payload?.user
        ?? (Array.isArray(payload?.data) ? payload.data[0] : payload?.data)
        ?? payload;
      if (!user || typeof user !== "object") {
        return thunkAPI.rejectWithValue({
          message: "The server returned an invalid user response",
          status: response.status,
        });
      }

      const normalizedUser = {
        id: user.id ?? user._id,
        name: user.name,
        email: user.email,
      };
      if (!normalizedUser.id || !normalizedUser.name) {
        return thunkAPI.rejectWithValue({
          message: "The server returned an invalid user response",
          status: response.status,
        });
      }

      return normalizedUser;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: getErrorMessage(error, "Unable to load current user"),
        status: error.response?.status ?? null,
      });
    }
  }
);
