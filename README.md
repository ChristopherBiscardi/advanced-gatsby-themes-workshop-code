# Composing Gatsby Themes

## Exercise 03: Creating our third theme

Our next theme will be a set of blog themes that supports multiple blogs from a core data abstraction. This is where we'll start to get into schema customization as we will support both the product blog and the developer blog using the same core data theme by creating a set of child themes. Let's start with `gatsby-theme-product-blog`.

### Step 01: Create Folders, files, etc

At this point this setup should start to feel familiar. We need a `package.json`, to move a set of files into the new theme, and then pull the plugins and templates over to the theme while removing them from the site.

Create a `packages/gatsby-theme-product-blog` folder and initialize a new `package.json` in it.

```shell
mkdir -p packages/gatsby-theme-product-blog
cd packages/gatsby-theme-product-blog
yarn init -y
```

### Step 02: Move files into the theme

The following files need to be moved into `packages/gatsby-theme-product-blog` from `www/src/pages/`. This moves our blog page and the blog post template pages into the theme.

```
www/
├── src
│   ├── pages
│   │   └── blog.js
│   └── templates
│       └── wordpress-blog-post.js
└── wrap-root-element.js
```

 Remember to get the `components` folder from one of the other themes so that it has the modified pragma support, along with the relevant gatsby-* files (ssr, browser) and the `wrap-root-element.js`.

That leaves us with a `packages/gatsby-theme-product-blog` that looks like this:

```shell
> tree gatsby-theme-product-blog
packages/gatsby-theme-product-blog
├── gatsby-browser.js
├── gatsby-ssr.js
├── package.json
└── src
    ├── components
    │   ├── header.js
    │   ├── headings.js
    │   └── text.js
    ├── context.js
    ├── pages
    │   └── blog.js
    ├── templates
    │   └── wordpress-blog-post.js
    └── theme.js
```

Remember to remove `templates/wordpress-blog-post.js` and `pages/blog.js` from `www`.

### Step 03: Use the theme

We need to add our new theme to our site's `package.json` and the site's `gatsby-config.js`.

In `www/package.json`, add `gatsby-theme-product-blog` to the `dependencies` object.

```json
{
  "name": "www",
  "version": "1.0.0",
  "main": "index.js",
  "author": "christopherbiscardi <chris@christopherbiscardi.com> (@chrisbiscardi)",
  "license": "MIT",
  "dependencies": {
    ...
    "gatsby-theme-product-blog": "*",
    ...
  },
}
```

and in `www/gatsby-config.js` add the theme to the `plugins` array.

```js
module.exports = {
  plugins: [
    `gatsby-theme-product-blog`,
    ...
  ]
};
```

### Step 04: index.js

```shell
touch packages/gatsby-theme-product-blog/index.js
```

inside of `index.js`, it is conventional to include a single comment in themes and gatsby plugins, signaling that this file is intentionally empty.

```js
// boop
```

### Step 05: Theme dependencies

We'll also use the same dependencies from our other themes to start.

```json
{
  "name": "gatsby-theme-product-blog",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "@theme-ui/presets": "^0.2.44",
    "theme-ui": "^0.2.44"
  },
  "peerDependencies": {
    "gatsby": "^2.16.5",
    "react": "^16.10.2",
    "react-dom": "^16.10.2"
  }
}
```

Now that we have our dependencies set up we can run `yarn` in the root of our project again.

### Step 06: gatsby-node logic

If we run `yarn workspace www develop` now, we see the following error because we haven't moved our gatsby-node logic over yet.

```shell
 ERROR #11325

Your site's "gatsby-node.js" created a page with a component that doesn't exist.

The path to the missing component is "/Users/christopherbiscardi/github/christopherbiscardi/advanced-gatsby-themes-workshop-code/www/src/templates/wordpress-blog-post.js"

The page object passed to createPage:
{
    "path": "/blog/example-post",
    "component": "/advanced-gatsby-themes-workshop-code/www/src/templates/wordpress-blog-post.js",
    "context": {
        "id": "00feda10-5293-5914-919c-d1338af40168"
    }
}
```

Move the wordpress source plugin to the theme's `gatsby-config`.

```js
module.exports = {
  plugins: [
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

also move the source from the www package.json to the theme's package.json

```js
{
  "name": "gatsby-theme-product-blog",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "@theme-ui/presets": "^0.2.44",
    "theme-ui": "^0.2.44",
    "gatsby-source-wordpress": "^3.1.43"
  },
  "peerDependencies": {
    "gatsby": "^2.16.5",
    "react": "^16.10.2",
    "react-dom": "^16.10.2"
  }
}
```

For `www/gatsby-node.js` it is easier to copy the entire file into the theme, then delete the mdx query and mdx template handling. Since we've moved the templates and `gatsby-node.js` logic to the theme, we will also have to make sure the path we're using to require the template is correct. To do this from inside a npm package, targeting a .js file, we can use `require.resolve` instead of `path.resolve`.

`packages/gatsby-theme-product-blog/gatsby-node.js` should look like this.

```js
const path = require(`path`);

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  const wordPressPostTemplate = require.resolve(
    `./src/templates/wordpress-blog-post.js`
  );
  // Query for Mdx nodes to use in creating pages.
  return graphql(
    `
      query loadPagesQuery {
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
```

Remember to also remove the wordpress logic from the `www/gatsby-node.js`.

re-run yarn in the root of the project and run develop

```shell
yarn
yarn workspace www develop
```

### Step 12: Usage in our site

To change the tokens to match that of our site, create a new file at `www/src/gatsby-theme-product-blog/theme.js` and include the following contents. The rest of our site uses the `deep` token set, so we use that.

```js
import { deep } from "@theme-ui/presets";

export default deep;
```

That's it. The theme was installed without affecting the current site and we can also override the token set using a single file.
