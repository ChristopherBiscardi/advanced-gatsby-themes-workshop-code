const path = require(`path`);
const crypto = require("crypto");

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

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  const wordPressPostTemplate = require.resolve(
    `./src/templates/wordpress-blog-post.js`
  );
  // Query for Mdx nodes to use in creating pages.
  return graphql(
    `
      query loadProductBlogsQuery {
        allBlogPost {
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

    result.data.allBlogPost.nodes.forEach(node => {
      createPage({
        path: `/blog/${node.slug}`,
        component: wordPressPostTemplate,
        context: {
          id: node.id
        }
      });
    });
  });
};

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
      description: `BlogPostWordPress: "implements the BlogPost interface for WordPress posts"` // optional
    }
  });
};
