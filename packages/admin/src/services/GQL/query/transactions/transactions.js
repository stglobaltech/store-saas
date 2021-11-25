import { gql } from "@apollo/client";

export const Q_GET_ALL_TRANSACTIONS = gql`
  query getAllTransactions($getTransactionsInputDto: GetTransactionsInputDto!) {
    getAllTransactions(getTransactionsInputDto: $getTransactionsInputDto) {
      transactions {
        _id
        userId
        orderId
        operation
        purpose
        amount
        userType
        orderDate
        previousBalance
        updatedAt
      }
      pagination {
        hasPrevPage
        hasNextPage
        page
        perPage
      }
    }
  }
`;
