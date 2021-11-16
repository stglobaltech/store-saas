import { gql } from "@apollo/client";

export const S_ORDER_PAYMENT_SUBSCRIPTION = gql`
  subscription orderPaymentStatusSubscription(
    $input: UserOrderPaymentInputDto!
  ) {
    orderPaymentStatusSubscription(input: $input) {
      status
    }
  }
`;
