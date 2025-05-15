import React, { useState } from "react";
import Container from "./components/container";
import { SidebarProvider } from "./components/ui/sidebar";
import SidebarMenus from "./components/SidebarMenu";

import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import useSession from "./hooks/use-session";
import Loading from "./components/Loading";

const Layout = () => {
  const { loading, user } = useSession();

  if (loading) return <Loading />;
  if (!user) return null;

  return (
    <SidebarProvider>
      <div className=" w-full gap-4 hidden md:flex ">
        <SidebarMenus />
        <div className="flex-1">
          {" "}
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
