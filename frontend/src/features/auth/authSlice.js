import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUser, loginUser, registerUser } from "./authThunk";

const initialState = {
    user: null,
    token: localStorage.getItem("token"),
    isLogin: true,
    loading: false,
    error: null,
    registrationMessage: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.loading = false;
            localStorage.removeItem("token");
            localStorage.removeItem("healthMateID");
        },
        _isLogin(state, action) {
            state.isLogin = action.payload;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("healthMateID", action.payload.user.id);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "Login failed";
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registrationMessage = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isLogin = true;
                state.registrationMessage = action.payload?.message || "Registration successful";
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "Registration failed";
            })
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error.message;
                if (action.payload?.status === 401) {
                    state.user = null;
                    state.token = null;
                    localStorage.removeItem("token");
                    localStorage.removeItem("healthMateID");
                }
            });
    },
});

export const { logout, _isLogin } = authSlice.actions;
export default authSlice.reducer;
