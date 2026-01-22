import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import BlogList from "./pages/BlogsList";
import BlogDetail from "./pages/BlogDetails";
import CreateBlog from "./pages/CreateBlog";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Auth */}

        {/* Blogs */}
        <Route path="/" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/create" element={<CreateBlog />} />
      </Routes>
    </>
  );
}

export default App;
