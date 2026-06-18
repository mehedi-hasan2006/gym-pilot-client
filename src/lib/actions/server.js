"use server";

const baseURL = process.env.SERVER_URL;

export const sereverMutation = async (path, data) => {
  const res = await fetch(`${baseURL}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const serverFetch = async (path) => {
  const res = await fetch(`${baseURL}${path}`);
  return res.json();
};
