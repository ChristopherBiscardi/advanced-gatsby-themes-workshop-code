import React from "react";
import Header from "../components/header";
import * as H from '../components/headings'
import * as Text from '../components/text'

export default props => (
  <div>
    <Header />
    <H.h1>CorgiCo</H.h1>
    <Text.p>For all your Corgi needs</Text.p>
  </div>
);
