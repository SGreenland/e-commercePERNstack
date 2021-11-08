import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Products from "./components/Products";
import useStore from "./Store";
import { cartStore } from "./Store";
import logo from "./images/logo.png";
import AlertBox from "./components/AlertBox";

export const Homepage = (props) => {
  const setValidUser = useStore((state) => state.setValidUser);
  const isValidUser = useStore((state) => state.isValidUser);
  const itemCount = useStore((state) => state.itemCount);
  const filterProducts = useStore((state) => state.filterProducts);
  const setProdDefault = useStore((state) => state.setProdDefault);
  const cartItems = cartStore((state) => state.cartItems);
  const products = useStore((state) => state.products);
  const menuStyle = { width: "50%", textAlign: "center" };
  const productRef = useRef(products);

  useEffect(() => {
    for (let x = 0; x < cartItems.length; x++) {
      for (let y = x + 1; y < cartItems.length; y++) {
        if (cartItems[x].name === cartItems[y].name) {
          cartStore.setState({
            cartItems: cartItems.filter(
              (item) => cartItems.indexOf(item) !== y
            ),
          });
        }
      }
    }
  });

  useEffect(() => {
    useStore.setState({
      itemCount: JSON.parse(sessionStorage.getItem("cart")).state.cartItems
        .length,
    });
  });

  useEffect(() => {
    setValidUser();
  }, [setValidUser]);

  function filterProds(e) {
    e.preventDefault();
    for (let i = 0; i < e.target.value.length; i++) {
      useStore.setState({
        products: products.filter(
          (prod) =>
            prod.name.match(e.target.value[i]) ||
            prod.name.includes(e.target.value[i].toUpperCase())
        ),
      });
    }

    if (e.key === "Backspace") {
      for (let i = 0; i < e.target.value.length; i++) {
        useStore.setState({
          products: productRef.current.filter(
            (prod) =>
              prod.name.match(e.target.value[i]) ||
              prod.name.includes(e.target.value[i].toUpperCase())
          ),
        });
      }
    }
    !e.target.value && setProdDefault();
  }


  async function logout() {
    const response = await fetch("https://samsfruitstore-pernstack.herokuapp.com/logout", {
      credentials: "include",
    });

    !response.ok && alert("error");

    useStore.setState({ isValidUser: false });
  }

  return (
    <>
      <div className="homepage-nav">
        <div className="logocontainer">
          <picture>
            <img src={logo} alt="logo" width="100%" height="95%" />
          </picture>
        </div>
        <div id="inputcontainer">
          <input
            id="searchbar"
            placeholder="Search product"
            onKeyPress={filterProducts}
            onKeyUp={filterProds}
          />
          <button
            onClick={filterProducts}
            id="searchbtn"
            type="submit"
            className="fas fa-search"
          ></button>
        </div>
        <div id="login-signup">
          <Link to="/login" onClick={isValidUser && logout} style={menuStyle}>
            {isValidUser ? "Logout" : "Login"}
          </Link>
          <span className="cartIcon" style={menuStyle}>
            <Link to="/cart" class="fas fa-shopping-cart" id="carty">
              <span style={{ fontFamily: "monospace" }}>{itemCount} </span>
            </Link>
          </span>
        </div>
      </div>
      <div className="prodContainer">
        <Products />
      </div>
    </>
  );
};

export function CreateNewUser() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  var alertBox = document.getElementById("alertBox");

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const body = { userName, email, password };

      const response = await fetch("https://samsfruitstore-pernstack.herokuapp.com/create_user", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        // const user = await response.json();

        alertBox.style.display = "flex";
        alertBox.innerHTML = `Account created successfully!<button><a href="/login">Login</a></button>`;
        useStore.getState().greyOut();
      } else {
        const error = await response.json();
        alertBox.style.display = "flex";
        alertBox.innerHTML = `${
          error.constraint === "unique_email" && "Email already registered."
        }<button onclick = window.location.reload()>Try again</button>`;
        useStore.getState().greyOut();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <AlertBox />
      <div id="formy">
        <h1>Create Account</h1>
        <form onSubmit={onSubmitForm} className="loginForm">
          <input
            className="formInput"
            required
            placeholder="username"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          ></input>
          <input
            className="formInput"
            required
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <input
            className="formInput"
            id="pwfield"
            required
            type="password"
            pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
            title="Password must be more than 8 characters, contain Upper and lower case letters, a number and a special character."
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>

          <button className="formBtn" type="submit">
            Create!
          </button>
        </form>
      </div>
    </>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setValidUser = useStore((state) => state.setValidUser);
  var alertBox = document.getElementById("alertBox");
  const body = { email, password };

  useEffect(() => {
    return () => {
      setValidUser();
     }
    }, []);

  const getUser = async (e) => {
    e.preventDefault();
  

    try {
      const response = await fetch("https://samsfruitstore-pernstack.herokuapp.com/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        withCredentials: true,
        credentials: "include",
      });

      if (response.ok) {
        const user = await response.json();

        var userName = user.userName;
        sessionStorage.setItem("userEmail", email);

        alertBox.style.display = "flex";
        alertBox.innerHTML = `Welcome ${userName}!<button><a href="/">Start Shopping!</a></button>`;
        useStore.getState().greyOut();
      } else {
        alertBox.style.display = "flex";
        alertBox.innerHTML = `Email or Password incorrect! <button><a href="/login">Try again</a></button>`;
        useStore.getState().greyOut();
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <AlertBox />
      <div id="formy">
        <h1>Login</h1>
        <form onSubmit={getUser} className="loginForm">
          <input
            className="formInput"
            placeholder="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <input
            className="formInput"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <button className="formBtn" type="submit">
            Login
          </button>
        </form>
        <Link to="/create-account">
          <p id="signupLink">Not got an account? Sign up!</p>
        </Link>
      </div>
    </>
  );
}
