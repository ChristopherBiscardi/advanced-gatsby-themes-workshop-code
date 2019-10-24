exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  const wordPressPostTemplate = require.resolve(
    `./src/templates/wordpress-blog-post.js`
  );
  // Query for Mdx nodes to use in creating pages.
  return graphql(
    `
      query loadProductBlogsQuery {
        allWordpressPost {
          nodes {
            id
            date
            title
            slug
            content
            excerpt
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    result.data.allWordpressPost.nodes.forEach(node => {
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
