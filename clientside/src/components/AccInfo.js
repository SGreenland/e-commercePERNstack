import React, { useEffect, useState } from "react";
import { Homepage } from "../App";
import useStore from "../Store";

export default function AccInfo() {
  const [userInfo, setUserInfo] = useState("");
  const isValidUser = useStore((state) => state.isValidUser);
  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://samsfruitstore-pernstack.herokuapp.com/get_user",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const getInfo = await response.json();
        setUserInfo(getInfo);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserInfo();

    if (!isValidUser) {
      window.location = "/";
    }
  });

  return (
    <>
      <Homepage />
      <div className="mainContainer">
        <table id="userInfoTable">
          <th colSpan="2" style={{ textAlign: "center" }}>
            My Account
          </th>
          <tr>
            <th>Username:</th>
            <td>{userInfo.username}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>{userInfo.email}</td>
          </tr>
        </table>
      </div>
    </>
  );
}
