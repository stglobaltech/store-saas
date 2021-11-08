import { gql } from "@apollo/client";


export const GET_LOGGED_IN_CUSTOMER = gql`
  query getUser($id: String = "1") {
    me(id: $id) {
      id
      name
      email
      address {
        id
        type
        name
        info
      }
      contact {
        id
        type
        number
      }
      card {
        id
        type
        cardType
        name
        lastFourDigit
      }
    }
  }
`;

export const Q_GET_ALL_ADDRESSES = gql`
  query getAllAddress {
    getAllAddress {
      id
      name
      address
      buildingNo
    }
  }
`;
