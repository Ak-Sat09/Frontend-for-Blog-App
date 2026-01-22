import api from "./axios";

export const toggleLike = (blogId) =>
    api.post(`/likes/blogs/${blogId}`);

export const getLikeCount = (blogId) =>
    api.get(`/likes/blogs/${blogId}/count`);
