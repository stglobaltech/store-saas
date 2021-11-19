import { gql } from "@apollo/client";

export const Q_GET_USER_ACTIVE_ORDERS = gql`
  query userActiveOrders {
    userActiveOrders {
      _id
      shortOrderId
      userId
      cartId
      orderPayType
      orderCart {
        _id
        products {
          name {
            en
            ar
          }
          quantity
          price
          quotedPrice
        }
        address {
          name
          address
          buildingNo
        }
        message
        vat
        deliveryCost
        totalPrice
        totalQuotedPrice
      }
      createdAt
    }
  }
`;
