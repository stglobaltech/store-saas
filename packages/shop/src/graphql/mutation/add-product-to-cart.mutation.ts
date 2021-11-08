import { gql } from "@apollo/client";

export const M_ADD_PRODUCT_TO_CART = gql`
  mutation($addProductInput: AddProductInput!) {
    addProductToCart(addProductInput: $addProductInput) {
      productId
      totalPrice
      totalQuotedPrice
    }
  }
`;
