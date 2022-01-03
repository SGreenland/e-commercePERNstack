import React from "react";
import { Homepage } from "../App";
import useStore from "../Store";

export default function AccInfo() {
  const accInfoDisplay = useStore((state) => state.accInfoDisplay);
  return (
    <>
      <Homepage />
      <div className="mainContainer">
        <label htmlFor="username">Username:</label>
        <p id="username">{useStore.getState().userName}</p>
      </div>
    </>
  );
}
