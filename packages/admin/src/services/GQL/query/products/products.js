import { gql } from "@apollo/client";

export const Q_GET_PRODUCTS_BASED_ON_STORE = gql`
  query getProductsBasedOnStore($storeProductFindInputDto: StoreProductFindInputDto!) {
    getProductsBasedOnStore(storeProductFindInputDto: $storeProductFindInputDto) {
      products {
        _id
        productName {
          en
        }
        description {
          en
        }
        picture
        price {
          price
          basePrice
          vatPrice
        }
        maxQuantity
        categoryId
      }
      pagination {
        hasPrevPage
        hasNextPage
        prevPage
        nextPage
        page
      }
    }
  }
`;

export const Q_GET_PRODUCTS_BASED_ON_CATEGORY = gql`
  query getProductsBasedOnCategory($productFindInput: ProductFindInputDto!) {
    getProductsBasedOnCategory(productFindInput: $productFindInput) {
      products {
        _id
        productName {
          en
        }
        description {
          en
        }
        picture
        price {
          price
          basePrice
          vatPrice
        }
        maxQuantity
        categoryId
      }
      pagination {
        hasPrevPage
        hasNextPage
        prevPage
        nextPage
        page
      }
    }
  }
`;