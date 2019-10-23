require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  plugins: [
    `gatsby-theme-marketing`,
    `gatsby-theme-product-blog`,
    `gatsby-theme-shopify`,
    `gatsby-plugin-mdx`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "dev-blog",
        path: `./content/dev-blog/`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "src-pages",
        path: `${__dirname}/src/pages/`
      }
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`] }
    }
  ]
};
