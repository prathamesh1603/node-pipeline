import api from "../api";

export const verifyUserApi = async (data) => {
  const response = await api.post("/auth/verify-user", data);
  return response.data;
};

export const fetchTimelineData = async (timelineId) => {
  try {
    const response = await api.get(`/timeline/${timelineId}`);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch timeline data");
  }
};
