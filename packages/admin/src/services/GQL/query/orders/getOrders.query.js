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
          name
          mobile
        }
        createdAt
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
