import { gql } from '@apollo/client';

export const Q_GET_PRODUCTS_BASED_ON_STORE = gql`
  query getProductsBasedOnStore(
    $storeProductFindInputDto: StoreProductFindInputDto!
  ) {
    getProductsBasedOnStore(
      storeProductFindInputDto: $storeProductFindInputDto
    ) {
      products {
        _id
        productName {
          en
          ar
        }
        description {
          en
          ar
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
          ar
        }
        description {
          en
          ar
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

export const Q_SEARCH_PRODUCTS = gql`
  query searchProduct($productSearchInput: ProductSearchInputDto!) {
    searchProduct(productSearchInput: $productSearchInput) {
      products {
        _id
        productName {
          en
          ar
        }
        description {
          en
          ar
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
