import { apiRequest } from "../api/api";

export const forumApi = {
  // Get all posts
  getPosts: () => apiRequest("/api/posts"),

  // Get single post
  getPost: (postId) => apiRequest(`/api/posts/${postId}`),

  // Like post
  likePost: (postId, userId) =>
    apiRequest(`/api/posts/${postId}/like`, {
      method: "POST",
      body: { userId },
    }),

  // Dislike post
  dislikePost: (postId, userId) =>
    apiRequest(`/api/posts/${postId}/dislike`, {
      method: "POST",
      body: { userId },
    }),

  // Add comment
  addComment: (postId, payload) =>
    apiRequest(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: payload,
    }),

  // Update comment
  updateComment: (postId, commentId, payload) =>
    apiRequest(`/api/posts/${postId}/comments/${commentId}`, {
      method: "PUT",
      body: payload,
    }),

  // Delete comment
  deleteComment: (postId, commentId, userId) =>
    apiRequest(`/api/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
      body: { userId },
    }),
};
