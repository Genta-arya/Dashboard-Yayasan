import React from "react";
import { User } from "lucide-react";

const Headers = () => {
  // Gantikan dengan data yang sesuai jika ada, misal nama pengguna
  const userName = "Genta Arya"; // Nama pengguna
  const userProfileImage = "https://www.w3schools.com/w3images/avatar2.png"; // Foto profil dummy

  return (
    <div className="flex justify-between items-center bg-green-100 rounded-lg text-black px-6 py-4">
      <div className="flex items-center gap-2">
        {/* Foto profil dummy */}
        <img
          src={userProfileImage}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col  items-center">
          <span className="font-semibold">Welcome,</span>
          <p>{userName}</p>
        </div>
      </div>
      <div className="text-lg font-semibold">
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </div>
    </div>
  );
};

export default Headers;
