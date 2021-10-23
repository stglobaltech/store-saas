import { gql } from '@apollo/client';

// export const GET_CATEGORIES = gql`
//   query getStoreCategories {
//     getStoreCategories {
//       _id
//       name {
//         en
//       }
//       iconUrl
//       type
//     }
//   }
// `;

export const GET_CATEGORIES = gql`
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
        }
        isEnable
      }
    }
  }
`;

// export const GET_CATEGORIES = gql`
//   query getCategories($type: String!) {
//     categories(type: $type) {
//       id
//       title
//       slug
//       icon
//       children {
//         id
//         title
//         slug
//       }
//     }
//   }
// `;
