import React from "react";
import { Routes, Route } from "react-router-dom";

import BlogList from "./pages/BlogsList";
import BlogDetail from "./pages/BlogDetails";
import CreateBlog from "./pages/CreateBlog";
import GuessTheNumberGame from "./games/GuessTheNumberGame";

function App() {

  return (
    <>

      <Routes>

        <Route path="/" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/guessTheNumber" element={<GuessTheNumberGame />} />
      </Routes>
    </>
  );
}

export default App;
