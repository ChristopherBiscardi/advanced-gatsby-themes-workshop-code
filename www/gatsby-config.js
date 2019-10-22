require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  plugins: [
    `gatsby-theme-marketing`,
    `gatsby-theme-shopify`,
    `gatsby-plugin-mdx`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
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
    },
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
