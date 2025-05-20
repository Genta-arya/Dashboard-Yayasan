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
import Setting from "./Views/Setting/Setting";

import FormSpmb from "./Views/Setting/SPMB/Form-Spmb";
import Slider from "./Views/Setting/Slider/Slider";
import Sambutan from "./Views/Setting/Sambutan/Sambutan";
import UnitPendidikan from "./Views/Setting/UnitPendidikan/UnitPendidikan";

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
          <Route path="/setting/website" element={<Setting />} />
          <Route path="/setting/slider" element={<Slider />} />
          <Route path="/setting/kata-pengantar" element={<Sambutan />} />
          <Route path="/setting/unit-pendidikan" element={<UnitPendidikan/>} />
          <Route path="/setting/spmb/:type" element={<FormSpmb />} />
        </Route>
        <Route path="*" element={<HalamanNotFound />} />
      </Routes>
      <Toaster richColors position="bottom-center" />
    </Router>
  );
};

//  { name: "Ponpes", href: "/setting/spmb/ponpes" },
//     { name: "SMP", href: "/setting/spmb/smp" },
//     { name: "SMA", href: "/setting/spmb/sma" },
//     { name: "PAUD", href: "/setting/spmb/paud" },
//     { name: "MDT", href: "/setting/spmb/mdt" },
//     { name: "TPQ", href: "/setting/spmb/tpq" },

export default RouteApp;
