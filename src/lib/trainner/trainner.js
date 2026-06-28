import { serverFetch, serverMutation } from "../actions/server";

export const getTrainers = () => {
  return serverFetch("/api/trainners");
};

export const demoteTrainerToUser = (id) => {
  return serverMutation(`/api/trainners/demote/${id}`, {}, "PATCH");
};

export const updateTrainerStatus = (id, data) => {
  return serverMutation(`/api/trainners/status/${id}`, data, "PATCH");
};

export const getTrainerStats = () => {
  return serverFetch("/api/trainners/stats");
};

export const getTrainerDashboardStats = (trainerId) => {
  return serverFetch(`/api/trainers/stats/${trainerId}`);
};
