import React from "react";
import { ThemeProvider } from "theme-ui";
import { deep } from "@theme-ui/presets";

const components = {
  p: props => <p style={{ color: "hotpink" }} {...props} />
};

export default ({ element }) => (
  <ThemeProvider theme={deep} components={components}>
    {element}
  </ThemeProvider>
);
