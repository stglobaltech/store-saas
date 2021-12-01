import { gql } from "@apollo/client";

export const M_UPDATE_PRODUCT_QUANTITY = gql`
  mutation($quantityUpdateInput: UpdateProductQuantityInput!) {
    updateCartProductQuantity(quantityUpdateInput: $quantityUpdateInput) {
      totalPrice
      totalQuotedPrice
    }
  }
`;
