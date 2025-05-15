import { ArrowLeftCircle } from "lucide-react";
import React from "react";

const Navigation = ({ text }) => {
  return (
    <div className="flex justify-between items-center">
      <div
        className="flex items-center px-4 gap-2 cursor-pointer text-sm font-semibold hover:opacity-80"
        onClick={() => window.history.back()}
      >
        <div className="flex gap-2  items-center">
          <ArrowLeftCircle />
          <p>Kembali</p>
        </div>
      </div>
      <p className="font-bold text-lg underline cursor-default">{text}</p>
    </div>
  );
};

export default Navigation;
