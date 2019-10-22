/** @jsx jsx */
/* eslint jsx-a11y/heading-has-content: 0 */
import { jsx } from "theme-ui";

export const h1 = props => (
  <h1 {...props} sx={{ variant: "textStyles.display", color: "primary" }} />
);
export const h2 = props => (
  <h2 {...props} sx={{ variant: "textStyles.heading", color: "primary" }} />
);
export const h3 = props => (
  <h3 {...props} sx={{ variant: "textStyles.heading", color: "primary" }} />
);
export const h4 = props => (
  <h4 {...props} sx={{ variant: "textStyles.heading", color: "primary" }} />
);
export const h5 = props => (
  <h5 {...props} sx={{ variant: "textStyles.heading", color: "primary" }} />
);
export const h6 = props => (
  <h6 {...props} sx={{ variant: "textStyles.heading", color: "primary" }} />
);
