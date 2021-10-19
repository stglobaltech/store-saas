import { gql } from "@apollo/client";

export const Q_IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export const Q_GET_USER_ID = gql`
  query getUserID {
    userId @client
  }
`;

export const Q_GET_STORE_ID = gql`
  query getUserID {
    storeId @client
  }
`;

export const Q_GET_ROLES = gql`
  query getRoles {
    roles @client
  }
`;

export const Q_GET_PARENTRESTAURANTID = gql`
  query getParentRestaurantId {
    parentRestaurantId @client
  }
`;

export const Q_GET_STORENAMEEN = gql`
  query getStoreNameEn {
    storeNameEn @client
  }
`;
