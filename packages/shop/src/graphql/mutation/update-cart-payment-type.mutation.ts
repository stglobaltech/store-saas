import { gql } from "@apollo/client";

export const M_UPDATE_CART_PAYMENT_TYPE = gql`
  mutation updatePaymentCartType($input: UpdateCartPaymentType!) {
    updateOrderPaymentType(input: $input) {
      success
      message {
        en
        ar
      }
    }
  }
`;
