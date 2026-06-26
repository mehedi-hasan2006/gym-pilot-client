import { serverMutation } from "../actions/server";

export const payment = async (data) => {
  return serverMutation("/api/payments", data, "POST");
};
