import { gql } from "@apollo/client";

export const Q_GET_USERID = gql`
  query getUserID {
    userId @client
  }
`;

export const Q_IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;


export const Q_GET_STORE_ID = gql`
  query getStoreID {
    storeId @client
  }
`;

export const Q_GET_ROLES = gql`
  query getRoles {
    roles @client
  }
`;