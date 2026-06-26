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
    throw new Error("Something went wrong!!..");
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

// export const serverFetchById = async (path, id) => {
//   const res = await fetch(`${baseURL}${path}${id}`);
//   return res.json();
// };

//--------------------------
//            Delete
//--------------------------

export const deleteClass = async (path, classId) => {
  const response = await fetch(`${baseURL}${path}${classId}`, {
    method: "DELETE",
  });
  return response.json();
};

export const serverMutation = async (url, data = {}, method = "POST") => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: method !== "DELETE" ? JSON.stringify(data) : undefined,
  });

  const result = await response.json();

  // if (!response.ok) {
  //   throw new Error(result.message || "Something went wrong");
  // }

  return result;
};
