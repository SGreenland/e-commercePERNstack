import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login, { Homepage, CreateNewUser } from "./App";
import Cart from "./components/Cart";
import CheckoutWrapper from "./components/CheckoutWrapper";
import CheckoutForm from "./components/CheckoutForm";
import AccInfo from "./components/AccInfo";

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={Homepage} />
      <Route exact path="/create-account" component={CreateNewUser} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/cart" component={Cart} />
      <Route exact path="/checkout" component={CheckoutWrapper} />
      <Route exact path="/accInfo" component={AccInfo} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
