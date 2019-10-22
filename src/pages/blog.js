/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql, Link } from "gatsby";
import Header from "../components/header";
import * as Text from "../components/text";

export default props => (
  <div>
    <Header />
    {props.data.allWordpressPost.nodes.map(node => (
      <div key={node.id}>
        <Text.Link to={`/blog/${node.slug}`}>
          <strong
            dangerouslySetInnerHTML={{
              __html: node.title
            }}
          />
        </Text.Link>
        <p
          dangerouslySetInnerHTML={{
            __html: node.excerpt
          }}
          sx={{
            color: "text",
            fontFamily: "body",
            lineHeight: "body"
          }}
        />
      </div>
    ))}
  </div>
);

export const query = graphql`
  query AllProductBlogsPage {
    allWordpressPost {
      nodes {
        id
        title
        slug
        excerpt
      }
    }
  }
`;
