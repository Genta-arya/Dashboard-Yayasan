import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Home,
  User,
  Settings,
  Pencil,
  MessageSquare,
  Image,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
const menus = [
  { label: "Dashboard", icon: <Home />, href: "/" },
  { label: "Posting Berita", icon: <Pencil />, href: "/posting" },
  { label: "Profil", icon: <User />, href: "/profile" },
  { label: "Pengaturan Website", icon: <Settings />, href: "/settings" },
];
const SidebarMenus = () => {
  const { pathname } = useLocation();

  return (
    <Sidebar className="group peer  w-20 hover:w-60 transition-all duration-300 ease-in-out">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menus.map((menu, index) => (
                <SidebarMenuItem className="mt-5" key={index}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={menu.href}
                      className={`flex items-center p-2 transition-all duration-300 ease-in-out group relative ${
                        pathname === menu.href ? "bg-green-100" : ""
                      }`}
                    >
                      {/* Ikon tetap berada di tengah */}
                      <div className="flex justify-center items-center w-10 h-10">
                        {menu.icon}
                      </div>
                      {/* Menampilkan teks hanya saat hover pada sidebar */}
                      <span className="absolute left-14 hidden group-hover:inline-block">
                        {menu.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarMenus;
