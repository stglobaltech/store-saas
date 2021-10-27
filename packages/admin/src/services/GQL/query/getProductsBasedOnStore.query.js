import { gql } from '@apollo/client';

export const Q_GET_PRODUCTS_BASED_ON_STORE = gql`
  query($storeProductFindInputDto: StoreProductFindInputDto!) {
    getProductsBasedOnStore(
      storeProductFindInputDto: $storeProductFindInputDto
    ) {
      products {
        _id
        productName {
          en
          ar
        }
      }
    }
  }
`;
