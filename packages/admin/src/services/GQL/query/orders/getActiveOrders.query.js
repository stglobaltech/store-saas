import { gql } from '@apollo/client';

export const Q_GET_ACTIVE_ORDERS = gql`
  query($input: StoreActiveOrderInputDto!) {
    storeActiveOrders(activeOrdersDto: $input) {
      order {
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
