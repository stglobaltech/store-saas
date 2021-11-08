import { gql } from "@apollo/client";

export const Q_SEARCH_PRODUCT_BASED_ON_STORE = gql`
  query searchProductBasedOnStore(
    $storeProductSearchInputDto: StoreProductSearchInputDto!
  ) {
    searchProductBasedOnStore(
      storeProductSearchInputDto: $storeProductSearchInputDto
    ) {
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
    }
  }
`;
