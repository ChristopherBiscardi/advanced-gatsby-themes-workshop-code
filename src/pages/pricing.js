import React from "react";
import Header from "../components/header";
import * as H from '../components/headings'
import * as Text from '../components/text'

export default props => (
  <div>
    <Header />
    <H.h1>SaaS App Pricing</H.h1>
    <Text.p>like free tier, $30/mo "pro" tier, Enterprise tier</Text.p>
  </div>
);
