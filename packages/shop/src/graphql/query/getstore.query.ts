import { gql } from "@apollo/client";

export const Q_GET_STORE = gql`
  query getStoresForUser($input: StoreFindInputDto!) {
    getStoresForUser(input: $input) {
      stores {
        logo
      }
    }
  }
`;
