import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query getCategoriesForUser {
    getCategoriesForUserBasedOnDomain {
      _id
      name {
        en
      }
      displayName {
        en
      }
      picture
      logo
      productCategories {
        _id
        name {
          en
        }
        isEnable
        imageUrl
      }
    }
  }
`;



export const GET_CATEGORIES_BY_STOREID = gql`
  query getCategoriesForUser($storeId: String!) {
    getCategoriesForUser(storeId: $storeId) {
      _id
      name {
        en
      }
      displayName {
        en
      }
      picture
      logo
      productCategories {
        _id
        name {
          en
          ar
        }
        isEnable
        imageUrl
      }
    }
  }
`;
