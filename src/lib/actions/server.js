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

//=========================
//     Like, Comment
// ========================

export const like = async () => {
  const response = await fetch(`/api/posts/${postId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user._id,
    }),
  });

  const post = await response.json();
  setPost(post);
};
