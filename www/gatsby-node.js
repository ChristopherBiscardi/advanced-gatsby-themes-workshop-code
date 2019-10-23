const path = require(`path`);
const crypto = require("crypto");
const _ = require("lodash");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

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
            info.parentType, // BlogPostMdxDev
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

  createTypes(`
    type BlogPostMdxDev implements Node & BlogPost
      @childOf(types: ["Mdx"]) {
      id: ID! 
      title: String! 
      slug: String! 
      excerpt: String @proxyResolve(from: "parent.excerpt")
      content: String! @proxyResolve(from: "parent.body")
    }
  `);
};

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

exports.onCreateNode = ({ node, actions, createNodeId }) => {
  const { createNode } = actions;

  if (node.internal.type !== "Mdx") {
    return;
  }

  const fieldData = {
    title: node.frontmatter.title,
    slug: node.frontmatter.slug,
    collection: "developer"
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
