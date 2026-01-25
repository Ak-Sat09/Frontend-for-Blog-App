import React from "react";
import { Routes, Route } from "react-router-dom";

import BlogList from "./pages/BlogsList";
import BlogDetail from "./pages/BlogDetails";
import CreateBlog from "./pages/CreateBlog";
import GuessTheNumberGame from "./games/GuessTheNumberGame";
import Portfolio from "./portfolio/Portfolio";

function App() {

  return (
    <>

      <Routes>

        <Route path="/" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/guessTheNumber" element={<GuessTheNumberGame />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </>
  );
}

export default App;
