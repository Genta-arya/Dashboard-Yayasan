import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authentikasi from "./Views/Authentikasi/Authentikasi";
import Dashboard from "./Views/Dashboard/Dashboard";

import HalamanNotFound from "./components/HalamanNotFound";
import Layout from "./Layout";
import Profile from "./Views/Profile/Profile";
import Posting from "./Views/Berita/Posting";

const RouteApp = () => {
  return (
    <Router>
      <Routes>
        {/* Route tanpa Layout */}
        <Route path="/login" element={<Authentikasi />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/posting" element={<Posting />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<HalamanNotFound />} />
      </Routes>
    </Router>
  );
};

export default RouteApp;
