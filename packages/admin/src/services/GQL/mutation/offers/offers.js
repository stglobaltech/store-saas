import { gql } from "@apollo/client";

export const M_CREATE_DISCOUNT = gql`
  mutation createDiscount($discountCreateInput: DiscountCreateInput!) {
    createDiscount(discountCreateInput: $discountCreateInput) {
      success
      message {
        en
        ar
      }
    }
  }
`;

export const M_EDIT_DISCOUNT = gql`
  mutation editDiscount($discountEditInput: DiscountCreateInput!) {
    editDiscount(discountEditInput: $discountEditInput) {
      success
      message {
        en
        ar
      }
    }
  }
`;

export const M_DELETE_DISCOUNT = gql`
  mutation deleteDiscount($discountID: String!) {
    deleteDiscount(discountID: $discountID) {
      success
      message {
        en
        ar
      }
    }
  }
`;
