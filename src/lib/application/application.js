import {
  sereverMutation,
  serverFetch,
  serverMutation,
} from "@/lib/actions/server";

export const getApplicationStats = async () => {
  return await serverFetch("/api/applications/stats");
};

export const createApplication = (data) => {
  return sereverMutation("/api/applications", data);
};

export const getApplicationByUser = (userId) => {
  return serverFetch(`/api/application/${userId}`);
};

export const getApplications = () => {
  return serverFetch("/api/applications");
};

export const updateApplicationStatus = async (id, data) => {
  return await serverMutation(`/api/applications/${id}`, data, "PATCH");
};

export const deleteApplication = async (id) => {
  return await serverMutation(`/api/applications/${id}`, null, "DELETE");
};
