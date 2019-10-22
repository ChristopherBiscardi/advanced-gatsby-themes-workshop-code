import React from "react";
import { Router, Link } from "@reach/router";
import * as H from "../components/headings";
import * as Text from "../components/text";

const Home = () => (
  <div>
    <H.h1>Home</H.h1>
    <Text.Link to="/app/dashboard/">to Dashboard</Text.Link>
  </div>
);
const Dash = () => (
  <div>
    <H.h1>Dash</H.h1>
    <Text.Link to="/app/">to Home</Text.Link>
  </div>
);

export default props => (
  <div>
    <H.h2>inside the app</H.h2>
    <Router basepath="/app">
      <Home path="/" />
      <Dash path="dashboard" />
    </Router>
  </div>
);
