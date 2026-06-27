import { serverFetch, serverMutation } from "../actions/server";

export const payment = async (data) => {
  return serverMutation("/api/payments", data, "POST");
};

export const getTransactions = async () => {
  return serverFetch("/api/payments");
};
