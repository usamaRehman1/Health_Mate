import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import familyMembersReducer from "../features/familyMembers/familyMembersSlice";
import vitalsReducer from "../features/vitals/vitalsSlice";
import reportsReducer from "../features/reports/reportsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        familyMembers: familyMembersReducer,
        vitals: vitalsReducer,
        reports: reportsReducer,
    },
});