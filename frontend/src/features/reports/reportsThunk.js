import { createAsyncThunk } from "@reduxjs/toolkit";
import { getReportsAPI, uploadReportAPI } from "./reportsApi";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const getDateOnly = (value) => {
  const parsedDate = new Date(value);

  console.log("Get Repost Data:", parsedDate)
  return Number.isNaN(parsedDate.getTime())
    ? String(value || "")
    : parsedDate.toISOString().slice(0, 10);
};

const normalizeReport = (report) => {
  const id = report?._id ?? report?.id;
  if (!id) {
    throw new Error("The server returned an invalid report.");
  }

  const analysis = report.aiAnalysis;
  const structuredAnalysis = analysis && typeof analysis === "object" ? analysis : report;
  const analysisText = typeof analysis === "string" ? analysis : "";

  return {
    ...report,
    id: String(id),
    memberId: report.familyMemberId ? String(report.familyMemberId) : "primary",
    title: report.title || "Health Report",
    date: getDateOnly(report.createdAt || report.date),
    type: "Health Report",
    imageUrl: report.imageUrl || "",
    summary: structuredAnalysis.summary || analysisText,
    overallStatus: structuredAnalysis.overallStatus || "",
    abnormalFindings: Array.isArray(structuredAnalysis.abnormalFindings)
      ? structuredAnalysis.abnormalFindings
      : [],
    possibleConcerns: Array.isArray(structuredAnalysis.possibleConcerns)
      ? structuredAnalysis.possibleConcerns
      : [],
    parameters: Array.isArray(structuredAnalysis.parameters)
      ? structuredAnalysis.parameters
      : [],
    recommendations: Array.isArray(structuredAnalysis.recommendations)
      ? structuredAnalysis.recommendations
      : [],
    disclaimer: structuredAnalysis.disclaimer || "",
    unreadableSections: Array.isArray(structuredAnalysis.unreadableSections)
      ? structuredAnalysis.unreadableSections
      : [],
    doctorQuestions: Array.isArray(structuredAnalysis.doctorQuestions)
      ? structuredAnalysis.doctorQuestions
      : [],
  };
};

export const fetchReports = createAsyncThunk(
  "reports/fetch",
  async (familyMemberIds = [], { rejectWithValue }) => {
    try {
      const responses = await Promise.all([
        getReportsAPI(),
        ...familyMemberIds.map((id) => getReportsAPI(id)),
      ]);
      return responses.flatMap((response) => {
        const reports = response.data?.data;
        if (!Array.isArray(reports)) {
          throw new Error("The server returned an invalid report list.");
        }

        return reports.map(normalizeReport);
      });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to load reports."));
    }
  }
);

export const uploadReport = createAsyncThunk(
  "reports/upload",
  async (report, { rejectWithValue }) => {
    try {
      const response = await uploadReportAPI(report);
      return normalizeReport(response.data?.data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to upload report."));
    }
  }
);
