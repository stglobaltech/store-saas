import { gql } from "@apollo/client";

export const Q_GET_USER_TRANSACTIONS = gql`
  query getUserTransactions($input: GetTransactionsInputForUserDto!) {
    getTransactionsForUser(input: $input) {
      transactions {
        _id
        orderId
        operation
        purpose
        amount
        userType
        orderDate
        previousBalance
      }
      pagination {
        page
        hasNextPage
        hasPrevPage
      }
    }
  }
`;
