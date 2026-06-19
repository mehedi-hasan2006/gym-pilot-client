import {
  deleteClass,
  sereverMutation,
  serverFetch,
  updateClass,
} from "../actions/server";

export const createClass = async (data) => {
  return sereverMutation("/api/classes", data);
};

export const getClasses = async (userId) => {
  return serverFetch(`/api/classes/${userId}`);
};

export const editClass = async (classId, data) => {
  return updateClass("/api/classes/", classId, data);
};

export const deleteClassById = async (classId) => {
  return deleteClass("/api/classes/", classId);
};

// admin access this api
export const getAllClasses = async () => {
  return serverFetch("/api/classes");
};

export const getApprovedClasses = async () => {
  return serverFetch("/api/approved-classes?status=Approved");
};

export const getApprovedClassById = async (classId) => {
  return serverFetch(`/api/approved-class/${classId}`);
};

export const getClassAttendees = async (classId) => {
  const response = await fetch(`/api/classes/${classId}/attendees`);
  return response.json();
};
