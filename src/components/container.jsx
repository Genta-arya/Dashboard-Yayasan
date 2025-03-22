import React from "react";

const Container = ({ children }) => {
  return (
    <div className=" bg-white pr-4 ">
      <div className=" py-4  ">{children}</div>
    </div>
  );
};

export default Container;
