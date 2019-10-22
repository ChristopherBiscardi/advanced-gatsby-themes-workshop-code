# Composing Gatsby Themes

## Exercise 02: Creating our first theme

Our first theme is gatsby-theme-marketing. These are the pages that our marketing team will control, whether through contractors or their own work. By putting these files into a separate theme we enable the marketing team to have autonomy over the pages that they control.

### Step 01: Create Folders

Create a `packages/gatsby-theme-marketing` folder and initialize a new `package.json` in it.

```shell
mkdir -p packages/gatsby-theme-marketing
cd packages/gatsby-theme-marketing
yarn init -y
```

The resulting `package.json` will look like this. The name here is important.

```json
{
  "name": "gatsby-theme-marketing",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT"
}
```

### Step 02: Move files into the theme

The following files need to be moved into `packages/gatsby-theme-marketing` from `www/src/pages/`.

```
company.js
index.js
pricing.js
```

That leaves us with a `packages/gatsby-theme-marketing` that looks like this:

```shell
> tree gatsby-theme-marketing
gatsby-theme-marketing
├── package.json
└── src
    └── pages
        ├── company.js
        ├── index.js
        └── pricing.js
```

Remember to remove `company.js`, `index.js`, and `pricing.js` from `www/src/pages`.

### Step 03: Use the theme

We need to add our new theme to our site's `package.json` and the site's `gatsby-config.js`.

In `www/package.json`, add `gatsby-theme-marketing` to the `dependencies` object.

```json
{
  "name": "www",
  "version": "1.0.0",
  "main": "index.js",
  "author": "christopherbiscardi <chris@christopherbiscardi.com> (@chrisbiscardi)",
  "license": "MIT",
  "dependencies": {
    ...
    "gatsby-theme-marketing": "*",
    ...
  },
}
```

and in `www/gatsby-config.js` add the theme to the `plugins` array.

```js
module.exports = {
  plugins: [
    `gatsby-theme-marketing`,
    ...
  ]
};
```

### Step 04: install and run

Run `yarn` in the root of the repo to install the theme package into `www`, then run `yarn workspace www develop` to check to make sure everything works.

```js
yarn
yarn workspace www develop
```

You should see this error.

```
yarn workspace www develop
yarn workspace v1.19.1
yarn run v1.19.1
$ gatsby develop
success open and validate gatsby-configs - 0.021s

 ERROR

UNHANDLED REJECTION Unable to find plugin "gatsby-theme-marketing". Perhaps you need to install its package?



  Error: Unable to find plugin "gatsby-theme-marketing". Perhaps you need to install its package?

  - load.js:109 resolvePlugin
    [advanced-gatsby-themes-workshop-code]/[gatsby]/dist/bootstrap/load-plugins/load.js:109:11

  - load.js:153 processPlugin
    [advanced-gatsby-themes-workshop-code]/[gatsby]/dist/bootstrap/load-plugins/load.js:153:20

  - load.js:172 config.plugins.forEach.plugin
    [advanced-gatsby-themes-workshop-code]/[gatsby]/dist/bootstrap/load-plugins/load.js:172:20

  - Array.forEach

  - load.js:171 module.exports
    [advanced-gatsby-themes-workshop-code]/[gatsby]/dist/bootstrap/load-plugins/load.js:171:20

  - index.js:55 module.exports
    [advanced-gatsby-themes-workshop-code]/[gatsby]/dist/bootstrap/load-plugins/index.js:55:19

  - index.js:167 module.exports
    [advanced-gatsby-themes-workshop-code]/[gatsby]/dist/bootstrap/index.js:167:34


not finished load plugins - 0.053s
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
error Command failed.
```

This error helpfully suggests

> Unable to find plugin "gatsby-theme-marketing". Perhaps you need to install its package?

Except we just installed the package!

What's happening is that the node.js require algorithm can't find our package. To find our package we can either use the default of `index.js` _or_ we can specify an already-existing file in the `main` field in our theme's `package.json`. We'll opt for the `index.js` file in case we ever want to export content from the theme.

```shell
touch packages/gatsby-theme-marketing/index.js
```

inside of `index.js`, it is conventional to include a single comment in themes and gatsby plugins, signaling that this file is intentionally empty.

```js
// boop
```

### Step 04: moving components over

If we add the `index.js` file and try to run `yarn workspace www develop` again, we see a new error. This is because we didn't copy over the `components` folder to our new theme.

```
ERROR #98123  WEBPACK

Generating development JavaScript bundle failed

Can't resolve '../components/header' in 'advanced-gatsby-themes-workshop-code/packages/gatsby-theme-marketing/src/pages'

File: ../packages/gatsby-theme-marketing/src/pages/company.js
```

You can use this command or finder to copy the files over.

```shell
cp -R www/src/components packages/gatsby-theme-marketing/src/
```

### Step 05: Theme dependencies

Since we're talking about advanced theme creation and usage in this course, we're going to change the default tokens of the marketing theme as if this theme could be used by many other people. Since this theme is quite small, it is unlikely that it would be used much if we published it. The changes here will help us when we get to more complicated themes like the Blog theme later.

Our marketing theme depends directly on `theme-ui` for the `jsx` pragma, `gatsby` for some components, and `react`. `gatsby` and `react` can be set as `peerDependencies` since every Gatsby site tends to install them, while `theme-ui` will be a direct dependency of our site. `theme-ui`'s peerDeps include `@emotion/core` and `@mdx-js/react` so we'll leave them out. We'll also add `@theme-ui/presets` to make it easy to swap our theme. The `package.json` in `gatsby-theme-marketing` ends up looking like this.

```json
{
  "name": "gatsby-theme-marketing",
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

### Step 06: Styling

To change the default token set used by our theme, we'll copy the `gatsby-ssr.js`, `gatsby-browser.js`, and `wrap-root-element.js` from `www` into our theme.

Note that `wrap-root-element.js` references some global styles so we'll want to remove those and the corresponding `@emotion/core` import. Also change the `deep` import to `swiss`, which will be our marketing default theme. We're left with this.

```js
import React from "react";
import { ThemeProvider } from "theme-ui";
import { swiss } from "@theme-ui/presets";
import * as H from "./src/components/headings";
import * as Text from "./src/components/text";

const components = {
  ...H,
  ...Text
};

export default ({ element }) => (
  <ThemeProvider theme={swiss} components={components}>
    {element}
  </ThemeProvider>
);
```

Now we can run `yarn workspace www develop` and... Our _entire site_ changes colors! oh no!

This is an easy problem to fall into when developing themes for general consumption. We have a solution though: using our own React context.

### Step 07: Bootstrapping our own context

We need to replace the `jsx` pragma from `theme-ui` with our own. Luckily there's a package for that: [`isolated-theme-ui`](https://github.com/ChristopherBiscardi/gatsby-plugins/tree/master/packages/isolated-theme-ui).

`isolated-theme-ui` depends on the same low-level packages `theme-ui` does, so we'll just add it to the dependencies for our theme.

```json
{
  "name": "gatsby-theme-marketing",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "@emotion/core": "^10.0.21",
    "@theme-ui/presets": "^0.2.44",
    "theme-ui": "^0.2.44",
    "isolated-theme-ui": "1.0.1"
  },
  "peerDependencies": {
    "gatsby": "^2.16.5",
    "react": "^16.10.2",
    "react-dom": "^16.10.2"
  }
}
```

We're going to bootstrap our own React context in `gatsby-theme-marketing/src/context.js`. Our context will support theme-ui tokens and MDX components (more on how to take advantage of the mdx pragma later).

```js
/** @jsx jsx */
import React from "react";
import { jsxPragma, mdxPragma } from "isolated-theme-ui";

export const MyThemeContext = React.createContext({
  theme: {},
  components: {}
});

// our custom pragmas, bootstrapped with our context
export const jsx = jsxPragma(MyThemeContext);
export const mdx = mdxPragma(MyThemeContext);
```

`gatsby-theme-marketing/wrap-root-element` uses our custom context and becomes

```js
import React from "react";
import { MyThemeContext } from "./src/context";

import theme from "./src/theme";
import * as H from "./src/components/headings";
import * as Text from "./src/components/text";

const components = {
  ...H,
  ...Text
};

export default ({ element }) => (
  <MyThemeContext.Provider
    value={{
      theme,
      components
    }}
  >
    {element}
  </MyThemeContext.Provider>
);
```

We'll also move our token set into `gatsby-theme-marketing/src/theme.js`. This allows the user's site to shadow it later without changing the `wrapRootElement` logic.

```js
import { swiss } from "@theme-ui/presets";

export default swiss;
```

### Step 08: Using the custom pragma

Now that we've set everything up, we need to replace any instance of `import { jsx } from "theme-ui";` with our custom pragma (`import { jsx } from "../context";`)

For example, `gatsby-theme-marketing/src/components/text.js`

```js
/** @jsx jsx */
import { jsx } from "../context";
import { Link as GatsbyLink } from "gatsby";

export const p = props => (
  <p
    {...props}
    sx={{ color: "text", fontFamily: "body", lineHeight: "body" }}
  />
);

export const Link = props => (
  <GatsbyLink
    {...props}
    sx={{
      color: "primary",
      "&:hover": {
        color: "secondary"
      }
    }}
  />
);
```

### Step 09: Global Styles Bonus Round

Remember when we removed the global styles from `wrapRootElement`? If we added them back, the styles would permanently apply based on which `wrapRootElement` in which theme "won". There are two solutions to this problem. We can add our global styles back on every page we control, or we can add global styles in `wrapPageElement` if we happen to know which URLs we control.

The first solution (global styles per-page) looks like this on the `company.js` page consuming our context via React hooks. This approach will cause these styles to mount and unmount when our page is rendered, which in this case is what we want because otherwise we'd be stomping on the user's styles. Remember that the user can always override the tokens to make this look more regular between pages and in the meantime when they install our theme nothing on their application (or our theme) will break.

```js
import React, { useContext } from "react";
import { Global } from "@emotion/core";
import { MyThemeContext } from "../context";
import Header from "../components/header";
import * as H from "../components/headings";
import * as Text from "../components/text";

export default props => {
  const { theme } = useContext(MyThemeContext);
  return (
    <div>
      <Global styles={{ body: { backgroundColor: theme.colors.background } }} />
      <Header />
      <H.h1>Company Page</H.h1>
      <Text.p>about us and stuff</Text.p>
      <H.h2>Employees</H.h2>
      <Text.p>hopefully they don't leave</Text.p>
      <H.h2>Investors</H.h2>
      <Text.p>Thanks for money yo</Text.p>
    </div>
  );
};
```

### Step 10: Usage in our site

Now we have a separated Gatsby theme (`gatsby-theme-marketing`) that can be published to npm and consumed by anyone. The theme isolates it's styles from the consuming application when installed using a custom React context, preventing unwanted or unexpected clashes that can lead to installation failures.

Typically the desire is to have the entire site in one token set though, so let's shadow the marketing tokens in our site. Remember that all the consuming site has to do at this point is to install the theme package and use it in gatsby-config.js

To change the tokens to match that of our site, create a new file at `www/src/gatsby-theme-marketing/theme.js` and include the following contents. The rest of our site uses the `deep` token set, so we use that.

```js
import { deep } from "@theme-ui/presets";

export default deep
```

That's it. The theme was installed without affecting the current site and we can also override the token set using a single file.