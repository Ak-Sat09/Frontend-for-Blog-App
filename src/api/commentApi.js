import api from "./axios";

export const getComments = (blogId) =>
    api.get(`/comments/blogs/${blogId}`);

export const addComment = (blogId, text) =>
    api.post(`/comments/blogs/${blogId}`, { text });
