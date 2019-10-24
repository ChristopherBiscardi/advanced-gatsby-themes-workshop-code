# Composing Gatsby Themes

## Exercise 03: Composing Gatsby Themes

Our next theme will be a shopify theme. This will be slightly more interesting than the marketing theme since the shopify theme uses additional plugins.

### Step 01: Create Folders

Create a `packages/gatsby-theme-shopify` folder and initialize a new `package.json` in it.

```shell
mkdir -p packages/gatsby-theme-shopify
cd packages/gatsby-theme-shopify
yarn init -y
```

The resulting `package.json` will look like this. The name here is important.

```json
{
  "name": "gatsby-theme-shopify",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT"
}
```

### Step 02: Move files into the theme

The following files need to be moved into `packages/gatsby-theme-shopify` from `www/src/pages/`. This moves our swag store into the theme.

```
swag.js
```

That leaves us with a `packages/gatsby-theme-shpoify` that looks like this:

```shell
> tree gatsby-theme-shopify
gatsby-theme-marketing
├── package.json
└── src
    └── pages
        └── swag.js
```

Remember to remove `swag.js` from `www/src/pages`.

### Step 03: Use the theme

We need to add our new theme to our site's `package.json` and the site's `gatsby-config.js`.

In `www/package.json`, add `gatsby-theme-shopify` to the `dependencies` object.

```json
{
  "name": "www",
  "version": "1.0.0",
  "main": "index.js",
  "author": "christopherbiscardi <chris@christopherbiscardi.com> (@chrisbiscardi)",
  "license": "MIT",
  "dependencies": {
    ...
    "gatsby-theme-shopify": "*",
    ...
  },
}
```

and in `www/gatsby-config.js` add the theme to the `plugins` array.

```js
module.exports = {
  plugins: [
    `gatsby-theme-shopify`,
    ...
  ]
};
```

### Step 04: index.js

```shell
touch packages/gatsby-theme-shopify/index.js
```

inside of `index.js`, it is conventional to include a single comment in themes and gatsby plugins, signaling that this file is intentionally empty.

```js
// boop
```

### Step 05: moving components over

We need to move the components over again like we did for the marketing theme. Since we already wrote this code we can copy/paste it from our marketing theme this time. Copy all of these files over from the marketing theme into the shopify theme. We'll keep all of this code the same across both themes so we could abstract it. For today we'll do some copy/paste since the two themes could be developed by two different people in different repos.

```shell
packages/gatsby-theme-marketing
├── gatsby-browser.js
├── gatsby-ssr.js
├── src
│   ├── components
│   │   ├── header.js
│   │   ├── headings.js
│   │   └── text.js
│   ├── context.js
│   └── theme.js
└── wrap-root-element.js
```

Change the tokens in `theme.js` to use `funk` this time.

```js
import { funk } from "@theme-ui/presets";

export default funk;
```

### Step 06: Theme dependencies

We'll also use the same dependencies from our marketing theme.

```json
{
  "name": "gatsby-theme-shopify",
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

### Step 07: Using the custom pragma

Now that we've set everything up, we need to replace any instance of `import { jsx } from "theme-ui";` with our custom pragma (`import { jsx } from "../context";`) in `packages/gatsby-theme-shopify/src/pages/swag.js` just like we did in the marketing theme. Note that we have some extra dependencies here. We'll deal with them in a second.

Don't forget to add the `Global`, `useContext`, `MyThemeContext` imports and usages if you want the background color to stick around on this page.

```js
/** @jsx jsx */
import { useContext } from "react";
import { MyThemeContext, jsx } from "../context";
import { graphql } from "gatsby";
import { Global } from "@emotion/core";
import Header from "../components/header";
import Img from "gatsby-image";
import Client from "shopify-buy";
import { navigate } from "@reach/router";
import * as H from "../components/headings";
import * as Text from "../components/text";

const client = Client.buildClient({
  domain: "corgico-dev.myshopify.com",
  storefrontAccessToken: process.env.GATSBY_SHOPIFY_ACCESS_TOKEN
});

async function buyCorgis(shopifyId) {
  const checkout = await client.checkout.create();
  await client.checkout.addLineItems(checkout.id, [
    {
      variantId: shopifyId,
      quantity: 1
    }
  ]);
  // console.log(checkout.webUrl)
  navigate(checkout.webUrl);
}

export default ({ data, ...props }) => {
  const { theme } = useContext(MyThemeContext);

  return (
    <div>
      <Global styles={{ body: { backgroundColor: theme.colors.background } }} />
      ...
    </div>
  );
};

export const query = graphql`...`;
```

### Step 08: Other dependencies

Up until this point we've mostly copied what we did with the marketing theme. We now have some additional dependencies to bring over into the `package.json` in the shopify theme (and also a plugin).

We rely on `reach/router`, which comes with Gatsby so we won't worry about it, and `shopify-buy` in our swag store. We also depend on the `gatsby-source-shopify` plugin and by extension, the set of sharp plugins that support the corgi images. Add the following dependencies to the shopify theme's `package.json` `dependencies`.

```json
{
  "gatsby-image": "^2.2.29",
  "gatsby-source-shopify": "^3.0.24",
  "shopify-buy": "^2.8.0",
  "gatsby-plugin-sharp": "^2.2.32",
  "gatsby-transformer-sharp": "^2.2.23"
}
```

We can now *remove* the `shopify-buy` and `gatsby-source-shopify` plugins from our `www` package.json.

### Step 09: moving the plugins

Next we need to move the source plugin over from the site into our theme. *copy* the sharp plugins and *move* the shopify plugin, resulting in the following `gatsby-config.js` file in `packages/gatsby-theme-shopify/gatsby-config.js`.

```js
module.exports = {
  plugins: [
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: "gatsby-source-shopify",
      options: {
        // The domain name of your Shopify shop. This is required.
        // Example: 'gatsby-source-shopify-test-shop' if your Shopify address is
        // 'gatsby-source-shopify-test-shop.myshopify.com'.
        shopName: "corgico-dev",

        // An API access token to your Shopify shop. This is required.
        // You can generate an access token in the "Manage private apps" section
        // of your shop's Apps settings. In the Storefront API section, be sure
        // to select "Allow this app to access your storefront data using the
        // Storefront API".
        // See: https://help.shopify.com/api/custom-storefronts/storefront-api/getting-started#authentication
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN,

        // Set verbose to true to display a verbose output on `npm run develop`
        // or `npm run build`. This prints which nodes are being fetched and how
        // much time was required to fetch and process the data.
        // Defaults to true.
        verbose: true,

        // Number of records to fetch on each request when building the cache
        // at startup. If your application encounters timeout errors during
        // startup, try decreasing this number.
        paginationSize: 250,

        // List of collections you want to fetch.
        // Possible values are: 'shop' and 'content'.
        // Defaults to ['shop', 'content'].
        includeCollections: ["shop"]
      }
    }
  ]
};
```

The `www/gatsby-config.js` is now one plugin shorter than it used to be.

### Step 10: Theme Options

`gatsby-source-shopify` takes a set of options but the way we have the `gatsby-config` set up doesn't allow us to pass any in. We can change that by making the `gatsby-config` a function export, which only works in themes. We end up with the following (comments removed). Our theme now takes a `sourceShopify` option that can be used to customize any value in the shopify source options. Using a spread allows us to upgrade with the underlying plugin: We won't need to bump the version of our theme if the shopify source plugin allows a new option, we can let users handle it.

```js
module.exports = options => ({
  plugins: [
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: "gatsby-source-shopify",
      options: {
        shopName: "corgico-dev",
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
        verbose: true,
        paginationSize: 250,
        includeCollections: ["shop"],
        ...options.sourceShopify
      }
    }
  ]
});
```

### Step 11: hardcoded domain

The domain of our store is hardcoded in `swag.js`

```js
const client = Client.buildClient({
  domain: "corgico-dev.myshopify.com",
  storefrontAccessToken: process.env.GATSBY_SHOPIFY_ACCESS_TOKEN
});
```

We'll change this to use an environment variable.

```js
const client = Client.buildClient({
  domain: process.env.GATSBY_SHOPIFY_DOMAIN,
  storefrontAccessToken: process.env.GATSBY_SHOPIFY_ACCESS_TOKEN
});
```

Remember to add this value to your `.env.development`.

The `GATSBY` prefix is special, it takes environment variables and injects them into the webpack bundle without us having to do extra work. Since this value can be easily configured, this is great. Depending on how we accessed this value there are a number of other options we can choose including [StaticQuery and Custom Configuration Nodes](https://www.christopherbiscardi.com/post/applying-theme-options-using-custom-configuration-nodes/), Manual usage of [Webpack's DefinePlugin](https://www.christopherbiscardi.com/post/applying-theme-options-using-webpacks-defineplugin/), and [React Context](https://www.christopherbiscardi.com/post/applying-theme-options-using-react-context/). There's a lot of flexibility in decision making here.

### Step 12: Usage in our site

To change the tokens to match that of our site, create a new file at `www/src/gatsby-theme-shopify/theme.js` and include the following contents. The rest of our site uses the `deep` token set, so we use that.

```js
import { deep } from "@theme-ui/presets";

export default deep;
```

That's it. The theme was installed without affecting the current site and we can also override the token set using a single file.
