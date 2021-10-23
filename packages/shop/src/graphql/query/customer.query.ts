import { gql } from "@apollo/client";

export const Q_GET_ALL_ADDRESSES = gql`
  query getAllAddress {
    getAllAddress {
      id
      name
      address
    }
  }
`;
