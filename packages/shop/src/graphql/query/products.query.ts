import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetStoreProductsForUser(
    $userStoreProductsFindInputDto: StoreProductFindInputDto!
  ) {
    getStoreProductsForUser(
      userStoreProductsFindInputDto: $userStoreProductsFindInputDto
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
        options {
          _id
          name {
            en
          }
          values {
            _id
            name {
              en
            }
            price {
              price
            }
          }
        }
        meals {
          _id
          types {
            _id
            name {
              en
            }
            price {
              price
            }
          }
          packages {
            _id
            name {
              en
            }
            typeIds
          }
        }
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
