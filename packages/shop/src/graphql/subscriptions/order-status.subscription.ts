import { gql } from "@apollo/client";

export const S_ORDER_STATUS_SUBSCRIPTION = gql`
  subscription orderStatusUpdateSubscribe(
    $input: OrderChatSubscriptionInputDto!
  ) {
    orderStatusUpdateSubscribe(input: $input) {
      success
      message{
        en
        ar
      }
      event{
        description
      }
      tripStatus
      driverStatus
      storeStatus
      status
    }
  }
`;
