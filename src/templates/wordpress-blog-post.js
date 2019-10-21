import React from "react";
import { graphql } from "gatsby";
import Header from "../components/header";

export default ({ data }) => (
  <div>
    <Header />
    <h1 dangerouslySetInnerHTML={{
        __html: data.wordpressPost.title
    }}/>
    <div dangerouslySetInnerHTML={{
        __html: data.wordpressPost.content
    }}/>
  </div>
);

export const query = graphql`
  query WordPressBlogPostQuery($id: String!) {
    wordpressPost(id: { eq: $id }) {
      title
      content
    }
  }
`;
