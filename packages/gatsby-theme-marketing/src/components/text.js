/** @jsx jsx */
import { jsx } from "../context";
import { Link as GatsbyLink } from "gatsby";

export const p = props => (
  <p
    {...props}
    sx={{ color: "text", fontFamily: "body", lineHeight: "body" }}
  />
);

export const Link = props => (
  <GatsbyLink
    {...props}
    sx={{
      color: "primary",
      "&:hover": {
        color: "secondary"
      }
    }}
  />
);
