import { gql } from "@apollo/client";

export const Q_GET_CATEGORIES = gql`
  query getCategories($storeId: String!) {
    getCategories(storeId: $storeId) {
      productCategories {
        _id
        name {
          en
        }
      }
    }
  }
`;
