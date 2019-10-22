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
      <H.h1>Company Page</H.h1>
      <Text.p>about us and stuff</Text.p>
      <H.h2>Employees</H.h2>
      <Text.p>hopefully they don't leave</Text.p>
      <H.h2>Investors</H.h2>
      <Text.p>Thanks for money yo</Text.p>
    </div>
  );
};
