/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";
import Header from "../components/header";

export default ({ data }) => (
  <div>
    <Header />
    <h1
      sx={{ variant: "textStyles.display", color: "primary" }}
      dangerouslySetInnerHTML={{
        __html: data.blogPost.title
      }}
    />
    <div
      sx={{
        "& a": {
          color: "primary",
          "&:hover": {
            color: "secondary"
          }
        },
        "& h1": { variant: "textStyles.display", color: "primary" },
        "& h2": { variant: "textStyles.heading", color: "primary" },
        "& h3": { variant: "textStyles.heading", color: "primary" },
        "& h4": { variant: "textStyles.heading", color: "primary" },
        "& h5": { variant: "textStyles.heading", color: "primary" },
        "& h6": { variant: "textStyles.heading", color: "primary" },
        "& p": { color: "text", fontFamily: "body", lineHeight: "body" },
        "& li": { color: "text", fontFamily: "body", lineHeight: "body" }
      }}
      dangerouslySetInnerHTML={{
        __html: data.blogPost.content
      }}
    />
  </div>
);

export const query = graphql`
  query WordPressBlogPostQuery($id: String!) {
    blogPost(id: { eq: $id }) {
      title
      content
    }
  }
`;
