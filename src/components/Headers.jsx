import React from "react";
import { User } from "lucide-react";

const Headers = ({ user }) => {
  const userName = user?.username;
  const userProfileImage = user?.avatar;

  return (
    <div className="flex justify-between items-center bg-green-100 rounded-lg text-black px-6 py-4">
      <div className="flex items-center gap-2">
        <img
          src={userProfileImage}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="">
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
