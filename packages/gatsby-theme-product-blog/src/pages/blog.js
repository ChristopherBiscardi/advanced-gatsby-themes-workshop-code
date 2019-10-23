/** @jsx jsx */
import { useContext } from "react";
import { MyThemeContext, jsx } from "../context";
import { graphql } from "gatsby";
import { Global } from "@emotion/core";
import Header from "../components/header";
import * as Text from "../components/text";

export default props => {
  const { theme } = useContext(MyThemeContext);

  return (
    <div>
      <Global styles={{ body: { backgroundColor: theme.colors.background } }} />

      <Header />
      {props.data.allBlogPost.nodes.map(node => (
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
};

export const query = graphql`
  query AllProductBlogsPage {
    allBlogPost(filter: { collection: { eq: "product" } }) {
      nodes {
        id
        title
        slug
        excerpt
      }
    }
  }
`;
