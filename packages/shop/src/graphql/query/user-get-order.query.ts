import { gql } from "@apollo/client";

export const Q_GET_USER_ORDER = gql`
  query userGetOrder($singleOrderFindDto: SingleOrderFindDto!) {
    userGetOrder(singleOrderFindDto: $singleOrderFindDto) {
      _id
      shortOrderId
      driverId
      driver {
        name
        countryCode
        mobile
      }
      cartId
      status
      cancelReason
      orderCart {
        _id
        products {
          _id
          productId
          name
          quantity
          price
          quotedPrice
        }
        vat
        deliveryCost
        totalPrice
        totalQuotedPrice
        address {
          addressId
          name
          address
          buildingNo
        }
      }
      createdAt
    }
  }
`;
