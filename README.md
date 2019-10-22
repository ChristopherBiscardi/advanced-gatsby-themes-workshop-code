# Composing Gatsby Themes

## Exercise 01: Setting up Yarn Workspaces

### Step 01: Create Folders

Create a packages/ folder and a www folder in the root of the project

```shell
mkdir packages www
```

The packages folder will be used for our themes and the www folder will be used for our site as we deconstruct it into themes

### Step 02: Move files into www

The following files need to be moved into `www`

```
content
gatsby-browser.js
gatsby-config.js
gatsby-node.js
gatsby-ssr.js
package.json
packages
public
src
wrap-root-element.js
```

That leaves us with a root directory that looks like this:

```
www
yarn.lock
README.md
```

If you run `git add -u` and `git add www`, the result of `git status -sb` will look something like this after moving the files.

```
## 01-yarn-workspaces
R  content/dev-blog/2020-09-26-hello-world/index.mdx -> www/content/dev-blog/2020-09-26-hello-world/index.mdx
R  content/dev-blog/2020-10-02-react/index.mdx -> www/content/dev-blog/2020-10-02-react/index.mdx
R  gatsby-browser.js -> www/gatsby-browser.js
R  gatsby-config.js -> www/gatsby-config.js
R  gatsby-node.js -> www/gatsby-node.js
R  gatsby-ssr.js -> www/gatsby-ssr.js
R  package.json -> www/package.json
R  src/components/header.js -> www/src/components/header.js
R  src/components/headings.js -> www/src/components/headings.js
R  src/components/text.js -> www/src/components/text.js
R  src/pages/app.js -> www/src/pages/app.js
R  src/pages/blog.js -> www/src/pages/blog.js
R  src/pages/company.js -> www/src/pages/company.js
R  src/pages/dev-blog.js -> www/src/pages/dev-blog.js
R  src/pages/index.js -> www/src/pages/index.js
R  src/pages/pricing.js -> www/src/pages/pricing.js
R  src/pages/swag.js -> www/src/pages/swag.js
R  src/templates/blog-post.js -> www/src/templates/blog-post.js
R  src/templates/wordpress-blog-post.js -> www/src/templates/wordpress-blog-post.js
R  wrap-root-element.js -> www/wrap-root-element.js
```

**!Important** : Make sure the `.env.development` file is moved to the `www` folder. Sometimes it can be missed by commands like `mv` since it starts with a `.`.

### Step 03: A new package.json

We will use yarn to initialize a new `package.json` in the root directory

```
yarn init -y
```

The resulting `package.json` of that will look like this.

```json
{
  "name": "advanced-gatsby-themes-workshop-code",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "git@github.com:ChristopherBiscardi/advanced-gatsby-themes-workshop-code.git",
  "author": "ChristopherBiscardi <chris@christopherbiscardi.com>",
  "license": "MIT"
}
```

We need to add these two fields to our root `package.json`. The first, `private: true` is there because yarn workspaces needs the root of the workspace to be private. This is OK for us as we don't plan to publish the entire workspace to npm anyway.

The second field, `workspaces` tells yarn which directories contain npm packages. In this case we've said that every directory _inside_ of `packages` contains a `package.json`. `www` is also considered a package.

It doesn't matter what order they are in. The result will look something like this.

```json
{
  "name": "advanced-gatsby-themes-workshop-code",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "git@github.com:ChristopherBiscardi/advanced-gatsby-themes-workshop-code.git",
  "author": "ChristopherBiscardi <chris@christopherbiscardi.com>",
  "license": "MIT",
  "private": true,
  "workspaces": ["packages/*", "www"]
}
```

### Step 04: Rename www

The package.json name in `www/package.json` doesn't *need* to be renamed. Hoever, we will choose to rename it to mirror the directory name.

```json
{
    "name": "just-a-gatsby-site"
}
```

becomes

```json
{
    "name": "www"
}
```

### Step 05

If all is set up correctly, we can run `yarn` in the root of the project.

```shell
yarn
```

Then, to check to make sure, we can run `develop` in the `www` workspace using `yarn workspace <name-of-workspace> <name-of-npm-script>`


```shell
yarn workspace www develop
```