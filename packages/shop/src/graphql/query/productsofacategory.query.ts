import { gql } from "@apollo/client";

export const GET_PRODUCTS_OF_A_CATEGORY = gql`
  query getProductsBasedOnCategoryForUser(
    $productFindInput: ProductFindInputDto!
  ) {
    getProductsBasedOnCategoryForUser(
      productFindInput: $productFindInput
    ) {
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
