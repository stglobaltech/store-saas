import { gql } from "@apollo/client";

export const S_STRIPE_PAYMENT_LISTEN_EVENTS = gql`
  subscription orderPaymentStatusSubscription(
    $input: UserOrderPaymentInputDto!
  ) {
    orderPaymentStatusSubscription(input: $input) {
      status
    }
  }
`;
