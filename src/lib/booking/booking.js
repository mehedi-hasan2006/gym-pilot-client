import { serverMutation } from "../actions/server";

export const bookClass = async (id, data) => {
  return serverMutation(`/api/bookings/${id}`, data, "PATCH");
};
