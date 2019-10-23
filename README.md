# Composing Gatsby Themes

## Creating a blog interface

Now that we have a blog theme, we can turn our attention to how to abstract this theme into a data structure that can support both our product blog, sourced from WordPress, and our dev blog, sourced from MDX files.

### Step 01: A core theme

We're going to start a new theme to abstract the WordPress blog theme we already created, `gatsby-theme-blog-data`. This theme will be a parent theme of the product blog theme.

```shell
mkdir packages/gatsby-theme-blog-data
cd packages/gatsby-theme-blog-data
yarn init -y
```

This theme won't have any ui, so we won't install theme-ui.

### Step 02: a BlogPost interface

If we take a look at the information we're using in our dev template

```graphql
frontmatter {
  title
}
body
```

```graphql
childMdx {
    frontmatter {
    title
    slug
    }
    excerpt
}
```

and the content in our wordpress template and page

```graphql
id
title
slug
excerpt
```

```graphql
wordpressPost(id: { eq: $id }) {
    title
    content
}
```

which gives us a unified set of fields that represent a blog post

```
id
title
slug
excerpt
content
```

Our interface then will be

```graphql
interface BlogPost @nodeinterface {
    id: ID!
    title: String!
    slug: String!
    excerpt: String
    content: String!
}
```

in `packages/gatsby-theme-blog-data/gatsby-node.js` we'll create our types.

```js
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  createTypes(`interface BlogPost @nodeInterface {
    id: ID!
    title: String!
    slug: String!
    excerpt
    content: String!
  }`);
};
```

### Step 03: Use the theme

We've been using our themes in `www` so far. This time we're going to consume our theme in `gatsby-theme-product-blog`. Add `gatsby-theme-blog-data` to `gatsby-theme-product-blog`'s package.json.

```json
{
  "name": "gatsby-theme-product-blog",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "@theme-ui/presets": "^0.2.44",
    "theme-ui": "^0.2.44",
    "gatsby-source-wordpress": "^3.1.43",
    "gatsby-theme-blog-data": "*"
  },
  "peerDependencies": {
    "gatsby": "^2.16.5",
    "react": "^16.10.2",
    "react-dom": "^16.10.2"
  }
}
```

and the `gatsby-config.js`

```js
module.exports = {
  plugins: [
    `gatsby-theme-blog-data`,
    {
      resolve: "gatsby-source-wordpress",
      options: {
        baseUrl: "advancedgatsbythemescourse.wordpress.com",
        protocol: "https",
        hostingWPCOM: true,
        auth: {
          wpcom_app_clientSecret: process.env.WORDPRESS_CLIENT_SECRET,
          wpcom_app_clientId: process.env.WORDPRESS_CLIENT_ID,
          wpcom_user: process.env.WORDPRESS_EMAIL,
          wpcom_pass: process.env.WORDPRESS_PASSWORD
        }
      }
    }
  ]
};
```

### Step 04: Run the site

Run yarn to link the workspaces and run the site.

```shell
yarn
yarn workspace www develop
```

Go to the graphiql pane: http://localhost:8000/___graphql and explore the data model. You can use this query (which will return empty, but not fail).

```graphql
{
  allBlogPost {
    edges {
      node {
        id
      }
    }
  }
}
```

We now have our `BlogPost` interface ready to go.

### Step 05: Concrete node types

To be able to query our WordPress posts, we need to create a set of proxy nodes that are concrete node in the gatsby system that implement the interface. In our case we can use these fields on the `wordpress__POST` node type.

```graphql
{
  wordpressPost {
    id
    slug
    title
    content
    excerpt
  }
}
```

We'll create the types for our new proxy node in `gatsby-theme-product-blog`'s `gatsby-node.js`.

```js
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type BlogPostWordPress implements Node & BlogPost
      @childOf(types: ["wordpress__POST"]) {
      id: ID!
      title: String!
      slug: String!
      excerpt: String
      content: String!
    }
  `);
};
```

We can now query this type in graphiql. We still don't get any results though.

```graphql
{
  allBlogPostWordPress {
    edges {
      node {
        id
      }
    }
  }
}
```

### Step 06: Concrete nodes

To "fill" our type full of nodes, we need to take advantage of `onCreateNode` to process `wordpress__POST` nodes into our new type. Again in `gatsby-theme-product-blog`'s `gatsby-node.js` use this `onCreateNode`.

```js
const crypto = require("crypto");

exports.onCreateNode = ({ node, actions, createNodeId }) => {
  const { createNode } = actions;

  if (node.internal.type !== "wordpress__POST") {
    return;
  }

  const fieldData = {
    title: node.title,
    slug: node.slug,
    content: node.content,
    excerpt: node.excerpt
  };

  createNode({
    id: createNodeId(`${node.id} >>> BlogPostWordPress`),
    ...fieldData,
    parent: node.id,
    children: [],
    internal: {
      type: `BlogPostWordPress`,
      contentDigest: crypto
        .createHash(`md5`)
        .update(JSON.stringify(fieldData))
        .digest(`hex`),
      content: JSON.stringify(fieldData), // optional
      description: `BlogPostWordPress: "implements the BlogPost interface for WordPress posts"`
    }
  });
};
```

From here on out, `rm -rf www/.cache` is your troubleshooting friend. Any time we're editing `onCreateNode`, data, and relationships between them and you run into trouble, deleting the cache can be your first move (and then restarting `gatsby develop`) because Gatsby will aggressively cache these values.

The following query will now work.

```graphql
{
  allBlogPost {
    edges {
      node {
        id
        title
      }
    }
  }
  allBlogPostWordPress {
    edges {
      node {
        id
        title
      }
    }
  }
}
```

### Step 07: Modifying Queries

In our product blog theme `gatsby-node.js` we will now change the queries to query for the `BlogPost` interface.

```graphql
query loadProductBlogsQuery {
  allBlogPost {
    nodes {
      id
      slug
    }
  }
}
```

and in `templates/wordpress-blog-post.js` and `src/pages/blog.js` change the queries as well.

```js
export const query = graphql`
  query WordPressBlogPostQuery($id: String!) {
    blogPost(id: { eq: $id }) {
      title
      content
    }
  }
`;
```

```js
export const query = graphql`
  query AllProductBlogsPage {
    allBlogPost {
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

Note that in both places we need to change the data access to use `blogPost` instead of `wordpress`

Re-run the site, the blog should work on the blog post interface now.

This interface lets us query `blogPost` and back that interface with _any_ node, including Mdx, WordPress, Contentful, JSON or Yaml files, etc.
