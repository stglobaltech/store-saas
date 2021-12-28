import { gql } from "@apollo/client";

export const M_REMOVE_PRODUCT_FROM_CART = gql`
  mutation removeProductFromCart($removeInput: RemoveCartProductInput!) {
    removeProductFromCart(removeInput: $removeInput) {
      totalPrice
      totalQuotedPrice
    }
  }
`;
