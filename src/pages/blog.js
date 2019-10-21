import React from "react";
import { graphql, Link } from "gatsby";
import Header from "../components/header";

export default props => (
  <div>
    <Header />
    {props.data.allWordpressPost.nodes.map(node => (
      <div>
        <Link to={`/blog/${node.slug}`}>
          <strong dangerouslySetInnerHTML={{
              __html: node.title
          }}/>
        </Link>
        <p dangerouslySetInnerHTML={{
            __html: node.excerpt
        }}/>
      </div>
    ))}
  </div>
);

export const query = graphql`
  query AllProductBlogsPage {
        allWordpressPost {
            nodes {
                title
                slug
                excerpt
            }
        }
  }
`;
