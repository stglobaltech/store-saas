import { gql } from "@apollo/client";

export const M_PLACE_ORDER = gql`
  mutation($createOrderInput: CreateReadyOrderInputDto!) {
    placeOrder(createOrderInput: $createOrderInput) {
      success
      message {
        en
        ar
      }
      stripeCheckoutUrl
    }
  }
`;
