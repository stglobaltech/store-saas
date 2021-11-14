import { gql } from "@apollo/client";

export const M_PLACE_ORDER = gql`
  mutation($createOrderInput: CreateReadyOrderInputDto!) {
    placeOrder(createOrderInput: $createOrderInput) {
      success
      message {
        en
        ar
      }
      stripeCheckoutUrl
      _id
      shortOrderId
      tmtGoOrderId
      cartId
      orderCart {
        _id
        products {
          _id
          productId
          name{
            en
            ar
          }
          quantity
          price
          quotedPrice
          message
        }
        vat
        deliveryCost
        totalPrice
        totalQuotedPrice
        address{
          buildingNo
          address
          name
        }
      }
      costToCustomer
      createdAt
      orderPayType
    }
  }
`;
