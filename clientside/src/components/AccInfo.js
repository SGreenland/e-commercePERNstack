import { response } from "express";
import React, { useEffect, useState } from "react";
import { Homepage } from "../App";
import useStore from "../Store";
import AlertBox from "./AlertBox";

export default function AccInfo() {
  const [userInfo, setUserInfo] = useState("");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
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
  }, []);

  async function handlePwChange() {
    try {
      const body = { oldPw, newPw };

      const response = await fetch(
        "https://samsfruitstore-pernstack.herokuapp.com/change_pw",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
          credentials: "include",
        }
      );
      if (response.ok) {
        useStore.setState({
          alertBoxDisplay: "grid",
          alertBoxMessage: "Password Changed!",
        });
        useStore.getState().greyOut();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <AlertBox />
      <Homepage />
      <div className="mainContainer" style={{ paddingTop: "10px" }}>
        <table id="userInfoTable">
          <thead>
            <th colSpan="2" style={{ textAlign: "center" }}>
              My Account
            </th>
          </thead>
          <tr>
            <th className="thAccInfo">Username:</th>
            <td>{userInfo.username}</td>
          </tr>
          <tr>
            <th className="thAccInfo">Email:</th>
            <td>{userInfo.email}</td>
          </tr>
          <th colSpan="2" id="changePWheader">
            Change Password
          </th>
          <tr>
            <th className="thAccInfo">Old Password:</th>
            <td>
              {" "}
              <input
                id="oldPass"
                type="password"
                onChange={(e) => setOldPw(e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <th className="thAccInfo">New Password:</th>
            <td>
              {" "}
              <input
                required
                id="newPass"
                type="password"
                pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
                title="Password must be more than 8 characters, contain Upper and lower case letters, a number and a special character."
                onChange={(e) => setNewPw(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <button onClick={handlePwChange} className="cartBtns">
                Confirm
              </button>
            </td>
          </tr>
        </table>
      </div>
    </>
  );
}
