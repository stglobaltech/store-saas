import { gql } from '@apollo/client';

export const Q_GET_ORDERS = gql`
  query($ordersFindInputDto: OrdersFindInputDto!) {
    gateGetOrders(ordersFindInputDto: $ordersFindInputDto) {
      orders {
        status
        _id
        shortOrderId
        orderType
        user {
          address
          name
          mobile
        }
        store {
          name {
            en
            ar
          }
        }
        createdAt
        userId
        orderCart {
          totalPrice
        }
      }
      pagination {
        hasPrevPage
        hasNextPage
        perPage
        page
      }
    }
  }
`;
