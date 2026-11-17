import api from "../../services/axios";

export const getReportsAPI = (familyMemberId) => api.get("/file", { params: familyMemberId ? { familyMemberId } : undefined, });

const ROMAN_URDU_TRANSLATION_ENDPOINT = "/file/translate-summary";

export const translateSummaryAPI = (summary) =>
  api.get(ROMAN_URDU_TRANSLATION_ENDPOINT, { params: { summary } });

export const uploadReportAPI = ({ file, title, memberId }) => {
  const formData = new FormData();
  formData.append("health_mate_reports", file);
  formData.append("title", title);
  if (memberId && memberId !== "primary") {
    formData.append("familyMemberId", memberId);
  }

  return api.post("/file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
