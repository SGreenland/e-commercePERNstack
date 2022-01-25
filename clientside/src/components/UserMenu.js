import React, { useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../Store";

export default function UserMenu({ userMenuDisplay, setUserMenuDisplay }) {
  const isValidUser = useStore((state) => state.isValidUser);
  const [visibility, setVisibility] = useState("hidden");

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

  function showToolTip() {
    visibility === "hidden"
      ? setVisibility(() => "visible")
      : setVisibility(() => "hidden");
  }

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
      <div className="UserMenuLinkDiv" style={linkDivStyle}>
        <Link
          to="/accInfo"
          className="userMenuLink"
          onClick={(e) => {
            if (!isValidUser) {
              e.preventDefault();
              showToolTip();
            }
          }}
        >
          My Account
        </Link>
        <div id="myAccountTooltip" style={{ visibility: visibility }}>
          You must be logged in to view your account.
        </div>
      </div>
      <div className="UserMenuLinkDiv" style={{ width: "100%" }}>
        <Link to="/myOrders" className="userMenuLink">
          My Orders
        </Link>
      </div>
    </div>
  );
}
