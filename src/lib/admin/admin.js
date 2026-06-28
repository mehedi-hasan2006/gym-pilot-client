import { serverFetch } from "../actions/server";

export const getAdminDashboardStats = () => {
  return serverFetch("/api/admin/stats");
};
