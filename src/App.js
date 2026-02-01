import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";

import BlogList from "./pages/BlogsList";
import BlogDetail from "./pages/BlogDetails";
import CreateBlog from "./pages/CreateBlog";

import { isAuthenticated } from "./utils/auth";
import Portfolio from "./portfolio/Portfolio";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/blogs" /> : <Login />}
        />

        <Route
          path="/register"
          element={isAuthenticated() ? <Navigate to="/blogs" /> : <Register />}
        />

        {/* Protected Routes */}
        <Route
          path="/blogs"
          element={isAuthenticated() ? <BlogList /> : <Navigate to="/login" />}
        />

        <Route
          path="/blogs/:id"
          element={isAuthenticated() ? <BlogDetail /> : <Navigate to="/login" />}
        />

        <Route
          path="/create"
          element={isAuthenticated() ? <CreateBlog /> : <Navigate to="/login" />}
        />

       <Route path="/portfolio" element={<Portfolio />} />


        {/* 404 */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </>
  );
}

export default App;
