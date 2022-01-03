import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Homepage } from "../App";
import useStore from "../Store";

export default function UserMenu({ userMenuDisplay, setUserMenuDisplay }) {
  const isValidUser = useStore((state) => state.isValidUser);

  const linkDivStyle = {
    width: "100%",
    borderBottom: "1px solid #212529",
  };

  async function logout() {
    const response = await fetch(
      "https://samsfruitstore-pernstack.herokuapp.com/logout",
      {
        credentials: "include",
      }
    );

    !response.ok && alert("error");

    useStore.setState({ isValidUser: false });
  }

  // function closeUserMenu() {
  //   setUserMenuDisplay("none");
  // }

  return (
    <div className="userMenu" style={{ display: userMenuDisplay }}>
      <div className="UserMenuLinkDiv" style={linkDivStyle}>
        <Link
          to="/login"
          onClick={isValidUser && logout}
          className="userMenuLink"
        >
          {isValidUser ? "Logout" : "Login"}
        </Link>
      </div>
      <div
        className="UserMenuLinkDiv"
        style={linkDivStyle}
        title={!isValidUser && "You must be logged in to view your account."}
      >
        <Link to="/accInfo" className="userMenuLink">
          My Account
        </Link>
      </div>
      <div className="UserMenuLinkDiv" style={{ width: "100%" }}>
        <Link to="/home" className="userMenuLink">
          My Orders
        </Link>
      </div>
    </div>
  );
}
