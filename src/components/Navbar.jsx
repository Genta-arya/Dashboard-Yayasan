import React from "react";
import { LogOut } from "lucide-react"; // Import ikon LogOut dari lucide-react

const Navbar = () => (
  <div className="w-full px-4 pt-4 pb-2 border-b-2 ">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src="/LOGO-SMP.ico" alt="Logo" className="w-14" />
        <div>
          <h1 className="text-lg font-bold">Dashboard</h1>
          <p className="text-sm font-semibold">Yayasan Islammiyah Al-Jihad</p>
        </div>
      </div>

     
      <button
        title="Logout"
        className="p-2 rounded-md hover:bg-gray-100 transition-all duration-300"
        onClick={() => console.log("Logout clicked")} 
      >
        <LogOut size={24} className="text-red-500" />
      </button>
    </div>
  </div>
);

export default Navbar;
