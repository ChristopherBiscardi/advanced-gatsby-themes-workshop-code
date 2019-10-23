/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Header from "../components/header";
import * as H from "../components/headings";

export default ({ data }) => (
  <div>
    <Header />
    <H.h1>{data.blogPost.title}</H.h1>
    <MDXRenderer>{data.blogPost.content}</MDXRenderer>
  </div>
);

export const query = graphql`
  query BlogPostQuery($id: String!) {
    blogPost(id: { eq: $id }) {
      title
      content
    }
  }
`;
