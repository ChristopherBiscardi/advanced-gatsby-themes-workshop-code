import React from "react";
import { graphql } from "gatsby";
import Header from "../components/header";
import * as Text from "../components/text";

export default props => (
  <div>
    <Header />
    {props.data.allFile.nodes.map(node => (
      <div key={node.id}>
        <Text.Link to={`/dev-blog/${node.childMdx.frontmatter.slug}`}>
          <strong>{node.childMdx.frontmatter.title}</strong>
        </Text.Link>
        <Text.p>{node.childMdx.excerpt}</Text.p>
      </div>
    ))}
  </div>
);

export const query = graphql`
  query AllDevBlogsPage {
    allFile(
      filter: { sourceInstanceName: { eq: "dev-blog" }, ext: { eq: ".mdx" } }
    ) {
      nodes {
        id
        childMdx {
          frontmatter {
            title
            slug
          }
          excerpt
        }
      }
    }
  }
`;
