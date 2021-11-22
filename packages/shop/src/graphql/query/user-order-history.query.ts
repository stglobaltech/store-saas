import { gql } from "@apollo/client";

export const Q_USER_ORDER_HISTORY = gql`
  query getUserOrders($orderFindInputDto: OrderFindInputDto!) {
    getUserOrders(orderFindInputDto: $orderFindInputDto) {
      orders {
        _id
        shortOrderId
        store {
          storeId
          name {
            en
            ar
          }
        }
        cartId
        status
        orderCart {
          products {
            name {
              en
              ar
            }
            quantity
            price
            quotedPrice
            productId
          }
          address{
            name
            address
            buildingNo
          }
          totalQuotedPrice
          deliveryCost
        }
        orderPayType
        paymentGateWay
        createdAt
      }
      pagination {
        hasNextPage
        hasPrevPage
        nextPage
        prevPage
        page
      }
    }
  }
`;
