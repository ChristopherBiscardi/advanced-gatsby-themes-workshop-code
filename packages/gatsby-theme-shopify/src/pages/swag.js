/** @jsx jsx */
import { useContext } from 'react';
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
      <Header />
      <ul sx={{ listStyleType: "none", margin: 0, padding: 0 }}>
        {data.allShopifyProduct.nodes.map(
          ({ id, shopifyId, description, images, title, handle, variants }) => (
            <li key={id}>
              <H.h2>{title}</H.h2>
              <Text.p>{description}</Text.p>
              <ul
                style={{
                  display: "flex",
                  listStyleType: "none",
                  margin: 0,
                  padding: 0
                }}
              >
                {variants.map((variant, i) => (
                  <li key={variant.id}>
                    <H.h3>{variant.title}</H.h3>
                    <Text.p>{variant.price}</Text.p>
                    <button onClick={() => buyCorgis(variant.shopifyId)}>
                      Buy Now!
                    </button>
                    <div style={{ width: (variant.price / 2.0) * 40 }}>
                      <Img
                        fluid={variant.image.localFile.childImageSharp.fluid}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export const query = graphql`
  query StorePageQuery {
    allShopifyProduct(filter: { availableForSale: { eq: true } }) {
      nodes {
        id
        shopifyId
        description
        images {
          id
          localFile {
            childImageSharp {
              fluid(maxWidth: 500, quality: 100) {
                ...GatsbyImageSharpFluid
                presentationWidth
              }
            }
          }
        }
        title
        handle
        variants {
          id
          shopifyId
          title
          sku
          price
          image {
            id
            localFile {
              childImageSharp {
                fluid(maxWidth: 500, quality: 100) {
                  ...GatsbyImageSharpFluid
                  presentationWidth
                }
              }
            }
          }
        }
      }
    }
  }
`;
