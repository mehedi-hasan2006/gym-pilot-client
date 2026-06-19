"use server";

const baseURL = process.env.SERVER_URL;

//--------------------------
//            POST
//--------------------------
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

//--------------------------
//     UPDATE || PATCH
//--------------------------
export const updateClass = async (path, classId, data) => {
  const response = await fetch(`${baseURL}${path}${classId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update class");
  }

  return await response.json();
};

//--------------------------
//            FETCH
//--------------------------
export const serverFetch = async (path) => {
  const res = await fetch(`${baseURL}${path}`);
  return res.json();
};
