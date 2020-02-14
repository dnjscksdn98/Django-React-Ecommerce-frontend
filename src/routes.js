import React from "react";
import { Route } from "react-router-dom";

import ProductList from "./containers/ProductList";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import HomepageLayout from "./containers/Home";
import OrderSummary from "./containers/OrderSummary";
import Checkout from "./containers/Checkout";
import Profile from "./containers/Profile";

const BaseRouter = () => (
  <React.Fragment>
    <Route path="/profile" component={Profile} />
    <Route path="/checkout" component={Checkout} />
    <Route path="/order-summary" component={OrderSummary} />
    <Route path="/products" component={ProductList} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route exact path="/" component={HomepageLayout} />
  </React.Fragment>
);

export default BaseRouter;
