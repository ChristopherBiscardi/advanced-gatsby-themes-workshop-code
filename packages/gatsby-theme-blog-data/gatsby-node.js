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
