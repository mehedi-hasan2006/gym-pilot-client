import { serverFetch, serverMutation } from "../actions/server";

// get all posts
export const getForumPosts = () => {
  return serverFetch("/api/posts");
};
// Delete Forum Post
export const deleteForumPost = (id) => {
  return serverMutation(`/api/posts/${id}`, null, "DELETE");
};

// Get Forum Statistics
export const getForumStats = () => {
  return serverFetch("/api/posts/stats");
};

// Report Forum Post
export const reportPost = (id, reportData) => {
  return serverMutation(`/api/posts/report/${id}`, reportData, "PATCH");
};
