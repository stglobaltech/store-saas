import { gql } from "@apollo/client";

export const Q_GET_USER_PROFILE = gql`
  query getUserProfile {
    getUserProfile {
      mobile
      countryCode
      email
      name
      wallet {
        balance
        updatedAt
      }
    }
  }
`;
