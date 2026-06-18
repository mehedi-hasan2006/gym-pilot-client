import { sereverMutation, serverFetch } from "../actions/server";

export const createClass = async (data) => {
  return sereverMutation("/api/classes", data);
};

export const getClasses = async () => {
  return serverFetch("/api/classes");
};

export const deleteClass = async (classId) => {
  const response = await fetch(`/api/classes/${classId}`, {
    method: "DELETE",
  });
  return response.json();
};

export const updateClass = async (classId, data) => {
  const response = await fetch(`/api/classes/${classId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getClassAttendees = async (classId) => {
  const response = await fetch(`/api/classes/${classId}/attendees`);
  return response.json();
};
