import React, { useContext } from "react";
import { Global } from "@emotion/core";
import { MyThemeContext } from "../context";
import Header from "../components/header";
import * as H from "../components/headings";
import * as Text from "../components/text";

export default props => {
  const { theme } = useContext(MyThemeContext);

  return (
    <div>
      <Global styles={{ body: { backgroundColor: theme.colors.background } }} />
      <Header />
      <H.h1>SaaS App Pricing</H.h1>
      <Text.p>like free tier, $30/mo "pro" tier, Enterprise tier</Text.p>
    </div>
  );
};
