/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Header from "../components/header";
import * as H from "../components/headings";

export default ({ data }) => (
  <div>
    <Header />
    <H.h1>{data.mdx.frontmatter.title}</H.h1>
    <MDXRenderer>{data.mdx.body}</MDXRenderer>
  </div>
);

export const query = graphql`
  query BlogPostQuery($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
      }
      body
    }
  }
`;
