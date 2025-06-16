import {
  Image,
  FileText,
  School,
  Users,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import React, { useState } from "react";

const MenuSetting = () => {
  const [showProfilSubmenu, setShowProfilSubmenu] = useState(false);
  const [showSpmbSubmenu, setShowSpmbSubmenu] = useState(false);

  const menu = [
    {
      name: "Slider",
      href: "/setting/slider",
      icon: <Image />,
    },
    {
      name: "Kata Sambutan",
      href: "/setting/kata-pengantar",
      icon: <FileText />,
    },
    {
      name: "Unit Pendidikan",
      href: "/setting/unit-pendidikan",
      icon: <School />,
    },
    {
      name: "Gallery",
      href: "/setting/gallery",
      icon: <Image />,
    },
  ];

  const profilSubmenu = [
  
    {
      name: "Sejarah",
      href: "/setting/profil/sejarah",
    },
    {
      name: "Visi Misi",
      href: "/setting/profil/visi-misi",
    },
  ];

  const spmbSubmenu = [
    { name: "Ponpes", href: "/setting/spmb/ponpes" },
    { name: "SMA", href: "/setting/spmb/sma" },
    { name: "SMP", href: "/setting/spmb/smp" },
    { name: "PAUD", href: "/setting/spmb/paud" },
    { name: "MDT", href: "/setting/spmb/mdt" },
    { name: "TPQ", href: "/setting/spmb/tpq" },
  ];

  return (
    <div className="space-y-4">
      {menu.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="flex justify-between items-center border-b space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="flex items-center space-x-2">
            <p className="text-green-800">{item.icon}</p>
            <span>{item.name}</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      ))}

      {/* Menu Profil */}
      <div
        onClick={() => setShowProfilSubmenu(!showProfilSubmenu)}
        className="cursor-pointer border-b space-x-2 p-2 rounded-lg hover:bg-gray-100 transition flex justify-between items-center"
      >
        <div className="flex items-center space-x-2">
          <p className="text-green-800">
            <Users />
          </p>
          <span>Profil</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transform transition-transform ${
            showProfilSubmenu ? "rotate-90" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {showProfilSubmenu && (
        <div className="ml-6 space-y-2">
          {profilSubmenu.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="cursor-pointer border-b space-x-2 p-2 rounded-lg hover:bg-gray-100 transition flex justify-between items-center"
            >
              <div className="flex justify-between items-center w-full">
                <span>{item.name}</span>
                <ArrowRight />
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Menu SPMB */}
      <div
        onClick={() => setShowSpmbSubmenu(!showSpmbSubmenu)}
        className="cursor-pointer border-b space-x-2 p-2 rounded-lg hover:bg-gray-100 transition flex justify-between items-center"
      >
        <div className="flex items-center space-x-2">
          <p className="text-green-800">
            <ClipboardList />
          </p>
          <span>SPMB</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transform transition-transform ${
            showSpmbSubmenu ? "rotate-90" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {showSpmbSubmenu && (
        <div className="ml-6 space-y-2">
          {spmbSubmenu.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="cursor-pointer border-b space-x-2 p-2 rounded-lg hover:bg-gray-100 transition flex justify-between items-center"
            >
              <div className="flex justify-between items-center w-full">
                <span>{item.name}</span>
                <ArrowRight />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuSetting;
