import { serverFetch, serverMutation } from "../actions/server";

export const getUsers = async () => {
  return serverFetch("/api/users");
};

export const updateUserStatus = (id, data) => {
  return serverMutation(`/api/users/status/${id}`, data, "PATCH");
};

export const updateUserRole = (id, data) => {
  return serverMutation(`/api/users/role/${id}`, data, "PATCH");
};

export const deleteUser = (id) => {
  return serverMutation(`/api/users/${id}`, null, "DELETE");
};

export const getUserStats = () => {
  return serverFetch("/api/users/stats");
};

export const toggleFavorite = (classId, userId) => {
  return serverMutation(`/api/favorites/${classId}`, { userId }, "PATCH");
};

export const getFavoriteClasses = (userId) => {
  return serverFetch(`/api/favorites/${userId}`);
};
