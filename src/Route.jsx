import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authentikasi from "./Views/Authentikasi/Authentikasi";
import Dashboard from "./Views/Dashboard/Dashboard";

import HalamanNotFound from "./components/HalamanNotFound";
import Layout from "./Layout";
import Profile from "./Views/Profile/Profile";
import Posting from "./Views/Berita/Posting";
import { Toaster } from "sonner";
import Berita from "./Views/Berita/Berita";
import EditBerita from "./Views/Berita/EditBerita";

const RouteApp = () => {
  return (
    <Router>
      <Routes>
        {/* Route tanpa Layout */}
        <Route path="/login" element={<Authentikasi />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/berita/posting" element={<Posting />} />
          <Route path="/berita/edit/:id" element={<EditBerita />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<HalamanNotFound />} />
      </Routes>
      <Toaster richColors position="bottom-center" />
    </Router>
  );
};

export default RouteApp;
