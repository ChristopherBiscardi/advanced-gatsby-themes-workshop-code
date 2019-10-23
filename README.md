# Composing Gatsby Themes

## Creating a blog interface

Now that we have a blog interface, we can apply the same approach to Mdx nodes.

We won't pull this into a theme because at this point we can talk about themes, plugins, and gatsby sites as all the same thing. All of them allow us to use gatsby-\* files, all of them can include a gatsby-config, all participate in shadowing, and all compose together to create our final Gatsby site. This insight lets us say that when we implement the parent theme in our site, it is the same as implementing it in a theme. The difference is that our site is not npm installable.

### Step 01: Mdx Proxy Nodes

We need to do the same thing we just did for `BlogPostWordPress`.

We'll create a new `BlogPostMdxDev` type.

```js
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type BlogPostMdxDev implements Node & BlogPost
      @childOf(types: ["Mdx"]) {
      id: ID! 
      title: String! 
      slug: String! 
      excerpt: String 
      content: String!
    }
  `);
};
```

And add the processing for Mdx nodes. Note that the `title` and `slug` come from the frontmatter, so we need to make sure they're defined in our Mdx files. We could also do some processing to make sure we had a slug from the File parent in this case since our Mdx content is known to be local.

```js
exports.onCreateNode = ({ node, actions, createNodeId }) => {
  const { createNode } = actions;

  if (node.internal.type !== "Mdx") {
    return;
  }

  const fieldData = {
    title: node.frontmatter.title,
    slug: node.frontmatter.slug
  };

  createNode({
    id: createNodeId(`${node.id} >>> BlogPostMdxDev`),
    ...fieldData,
    parent: node.id,
    children: [],
    internal: {
      type: `BlogPostMdxDev`,
      contentDigest: crypto
        .createHash(`md5`)
        .update(JSON.stringify(fieldData))
        .digest(`hex`),
      content: JSON.stringify(fieldData), // optional
      description: `BlogPostMdxDev: "implements the BlogPost interface for Mdx"` // optional
    }
  });
};
```

### Step 02: resolver passthrough

If we run the site now, we'll see an error

```
Errors: Cannot return null for non-nullable field BlogPostMdxDev.content.
```

`content` and `excerpt` are fields that don't exist on the concrete `Mdx` node, so we need to use resolvers to access them. Enter `createFieldExtension`.

Add this custom field extension in `www`'s `createSchemaCustomization`

```js
const splitProxyString = str =>
  str.split(".").reduceRight((acc, chunk) => {
    return { [chunk]: acc };
  }, true);

actions.createFieldExtension({
  name: "proxyResolve",
  args: {
    from: { type: "String!" }
  },
  extend: (options, previousFieldConfig) => {
    return {
      resolve: async (source, args, context, info) => {
        await context.nodeModel.prepareNodes(
          info.parentType, // Mdx
          splitProxyString(options.from), // querying for resolvable field
          splitProxyString(options.from), // resolve this field
          [info.parentType.name] // The types to use are these
        );

        const newSource = await context.nodeModel.runQuery({
          type: info.parentType,
          query: { filter: { id: { eq: source.id } } },
          firstOnly: true
        });

        return _.get(newSource.__gatsby_resolved, options.from);
      }
    };
  }
});
```

Install lodash, and add imports to the top of www's `gatsby-node.js`.

```
yarn workspace www add lodash
```

```js
const _ = require("lodash");
```

### Step 03: collections of content

If we `yarn workspace www develop` now, we see that our wordpress posts _and_ our Mdx posts are now both displayed on the product blog. This isn't what we want since we have two _different_ blogs right now. Let's add a field to our interface.

in `gatsby-theme-blog-data/gatsby-node.js` add a "collection" field that is optional.

```js
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`interface BlogPost @nodeInterface {
      id: ID!
      title: String!
      slug: String!
      excerpt: String
      content: String!
      collection: String
    }`);
};
```

In our `gatsby-theme-product-blog` child theme, we can add a `collection` field to the nodes we're processing.

```js
const fieldData = {
  title: node.title,
  slug: node.slug,
  content: node.content,
  excerpt: node.excerpt,
  collection: "product"
};
```

and in `www` we'll do the same for the Mdx nodes we're using

```js
const fieldData = {
  title: node.frontmatter.title,
  slug: node.frontmatter.slug,
  collection: "developer"
};
```

### Step 04: filtering by collection

In our product blog's `gatsby-node` where we `createPages` we'll add a filter by collection.

```graphql
query loadProductBlogsQuery {
  allBlogPost(filter: { collection: { eq: "product" } }) {
    nodes {
      id
      slug
    }
  }
}
```

and in `src/pages/blog.js` change the query to use the filter as well.

```js
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
```

Now the only blogs that count for our product blog are the ones that are tagged with the product tag.

Do the same in www's `gatsby-node` for the Mdx posts.

```js
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);
  // Query for Mdx nodes to use in creating pages.
  return graphql(
    `
      query loadPagesQuery {
        allBlogPost(filter: { collection: { eq: "developer" } }) {
          nodes {
            id
            slug
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog post pages.
    result.data.allBlogPost.nodes.forEach(node => {
      createPage({
        path: `/dev-blog/${node.slug}`,
        component: blogPostTemplate,
        context: {
          id: node.id
        }
      });
    });
  });
};
```

In the blog-post template in www, make the switch to `blogPost` as well

```js
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
```

and finally in the `dev-blog.js` file in `www/src/pages` do the same switch

```js
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
```

Whew. Now we have two distinct blogs running off the same data model. In fact, if we back up a bit we _could_ render all of the posts on one or both of the collections. It doesn't matter what node types we back each collection with as long as we have logic to render them.
