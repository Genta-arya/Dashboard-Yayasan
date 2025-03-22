import React, { useState } from "react";
import Container from "./components/container";
import { SidebarProvider } from "./components/ui/sidebar";
import SidebarMenus from "./components/SidebarMenu";

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <SidebarProvider>
      <div className=" w-full gap-4 hidden md:flex ">
        <SidebarMenus />
        <div className="flex-1">
          {" "}
          {/* flex-1 untuk memberi ruang lebih ke navbar dan konten */}
          <Navbar />
          <Container>
            <Outlet />
          </Container>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
