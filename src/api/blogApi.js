import api from "./axios";

export const getAllBlogs = () => api.get("/blogs");
export const getBlogById = (id) => api.get(`/blogs/${id}`);
export const createBlog = (data) => api.post("/blogs", data);
