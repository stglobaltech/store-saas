import { gql } from "@apollo/client";

export const Q_SEARCH_PRODUCTS_BASED_ON_CATEGORY_FOR_USER = gql`
  query searchProductForUser($productSearchInput: ProductSearchInputDto!) {
    searchProductForUser(productSearchInput: $productSearchInput) {
      products {
        _id
        productName {
          en
          ar
        }
        price {
          price
        }
        picture
        description {
          en
        }
        maxQuantity
        payType
        categoryId
      }
      pagination {
        hasNextPage
        nextPage
        hasPrevPage
        prevPage
        page
      }
    }
  }
`;
