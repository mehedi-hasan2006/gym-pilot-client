import { sereverMutation, serverFetch, updateClass } from "../actions/server";

export const createClass = async (data) => {
  return sereverMutation("/api/classes", data);
};

export const getClasses = async (userId) => {
  return serverFetch(`/api/classes/${userId}`);
};

export const editClass = async (classId, data) => {
  return updateClass("/api/classes/", classId, data);
};

export const deleteClass = async (classId) => {
  const response = await fetch(`/api/classes/${classId}`, {
    method: "DELETE",
  });
  return response.json();
};

export const getClassAttendees = async (classId) => {
  const response = await fetch(`/api/classes/${classId}/attendees`);
  return response.json();
};
