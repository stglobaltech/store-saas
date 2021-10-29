import { gql } from "@apollo/client";

export const M_CREATE_PRODUCT = gql`
  mutation createProduct($productCreateInput: ProductCreateInputDto!) {
    createProduct(productCreateInput: $productCreateInput) {
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
  }
`;

export const M_EDIT_PRODUCT = gql`
  mutation editProduct($productEditInput: ProductEditInputDto!) {
    editProduct(productEditInput: $productEditInput) {
      success
      message {
        en
      }
      product {
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
    }
  }
`;
