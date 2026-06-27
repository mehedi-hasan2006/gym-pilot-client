import { serverFetch, serverMutation } from "../actions/server";

export const bookClass = async (id, data) => {
  return serverMutation(`/api/bookings/${id}`, data, "PATCH");
};

export const getBookingStatus = async (userId, classId) => {
  return serverFetch(`/api/bookings/check?userId=${userId}&classId=${classId}`);
};

export const getFavoriteClasses = async (userId) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites/${userId}`,
  );

  return await response.json();
};

// Booking data for admin
export const getClassBookings = (classId) => {
  return serverFetch(`/api/bookings/class/${classId}`);
};
