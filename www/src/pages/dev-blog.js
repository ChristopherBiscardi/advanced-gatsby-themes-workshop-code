import React from "react";
import { graphql } from "gatsby";
import Header from "../components/header";
import * as Text from "../components/text";

export default props => (
  <div>
    <Header />
    {props.data.allBlogPost.nodes.map(node => (
      <div key={node.id}>
        <Text.Link to={`/dev-blog/${node.slug}`}>
          <strong>{node.title}</strong>
        </Text.Link>
        <Text.p>{node.excerpt}</Text.p>
      </div>
    ))}
  </div>
);

export const query = graphql`
  query AllDevBlogsPage {
    allBlogPost(filter: { collection: { eq: "developer" } }) {
      nodes {
        title
        slug
        excerpt
      }
    }
  }
`;
