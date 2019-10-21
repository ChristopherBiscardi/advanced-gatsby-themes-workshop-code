import React from 'react'
import {graphql} from 'gatsby'
import Header from '../components/header'
import Img from "gatsby-image"
import Client from 'shopify-buy';
import { navigate } from "@reach/router"

const client = Client.buildClient({
  domain: 'corgico.myshopify.com',
  storefrontAccessToken: process.env.GATSBY_SHOPIFY_ACCESS_TOKEN
});


async function buyCorgis(shopifyId) {
  const checkout = await client.checkout.create();
  const res = await client
                .checkout
                .addLineItems(checkout.id, [{
                  variantId: shopifyId,
                  quantity: 1
                }])
  console.log(checkout.webUrl)
  navigate(checkout.webUrl)
}

console.log(client.checkout)

export default ({data, ...props}) => {
    return <div>
      <Header/>
      <ul>{
        data.allShopifyProduct.nodes.map(({
        id,
        shopifyId,
        description,
        images,
        title,
        handle,
        variants
        }) => <li key={id}>
          <h2>{title}</h2>
          <p>{description}</p>
          <ul style={{display:'flex'}}>{
            variants.map(variant => <li key={variant.id}>
              <h3>{variant.title}</h3>
              <div>{variant.price}</div>
              <button onClick={() => buyCorgis(variant.shopifyId)}>Buy Now!</button>
              <div style={{maxWidth: 200}}>
              <Img fluid={variant.image.localFile.childImageSharp.fluid}/>
              </div>
            </li>
          )}</ul>
        </li>)
      }</ul>
    </div>
}

export const query = graphql`
query StorePageQuery {
  allShopifyProduct(filter: {availableForSale: {eq: true}}) {
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
`