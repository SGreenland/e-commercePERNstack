import React, { useEffect } from "react";
import { Homepage } from "../App";
import useStore from "../Store";

export default function AccInfo() {
  // const accInfoDisplay = useStore((state) => state.accInfoDisplay);
  const userName = useStore((state) => state.userName);
  useEffect(() => {
    console.log(userName);
  });

  return (
    <>
      <Homepage />
      <div className="mainContainer">
        <label htmlFor="username">Username:</label>
        <p id="username">{userName}</p>
      </div>
    </>
  );
}
