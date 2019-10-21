import React from "react";
import { graphql, Link } from "gatsby";
import Header from "../components/header";

export default props => (
  <div>
    <Header />
    {props.data.allFile.nodes.map(node => (
      <div>
        <Link to={`/dev-blog/${node.childMdx.frontmatter.slug}`}>
          <strong>{node.childMdx.frontmatter.title}</strong>
        </Link>
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
        }
      }
    }
  }
`;
