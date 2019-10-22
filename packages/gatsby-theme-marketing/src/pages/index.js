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
      <H.h1>CorgiCo</H.h1>
      <Text.p>For all your Corgi needs</Text.p>
    </div>
  );
};
