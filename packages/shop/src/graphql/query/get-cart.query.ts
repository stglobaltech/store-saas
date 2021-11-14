import { gql } from "@apollo/client";

export const Q_GET_CART = gql`
  query getCart($entityId: String!) {
    getCart(entityId: $entityId) {
      _id
      totalPrice
      products {
        _id
        quantity
        price
        quotedPrice
        message
      }
      deliveryCost
      offer{
        discountIn
      }
    }
  }
`;
