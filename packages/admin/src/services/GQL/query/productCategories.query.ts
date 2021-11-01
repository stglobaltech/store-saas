import { gql } from "@apollo/client";

export const GET_PRODUCT_CATEGORIES = gql`
  query getCategories($storeId: String!) {
    getCategories(storeId: $storeId) {
      productCategories {
        _id
        name {
          en
          ar
        }
        isEnable
      }
    }
  }
`;
