import { gql } from "@apollo/client";

export const S_ORDER_STATUS_SUBSCRIPTION = gql`
  subscription orderStatusUpdateSubscribe(
    $input: OrderChatSubscriptionInputDto!
  ) {
    orderStatusUpdateSubscribe(input: $input) {
      success
      message {
        en
        ar
      }
      event {
        description
      }
      tripStatus
      driverStatus
      storeStatus
      status
    }
  }
`;



//for testing sockets connections.Do not use it.
export const S_CHEF_ORDER_SUBSCRIPTION=gql`
subscription($input: ChefOrderSubscriptionForUserInputDto!) {
  chefOrderSubscribeForUser(input: $input) {
    payload {
      eventType
      orderId
    }
    title {
      en
      ar
    }
    message {
      en
      ar
    }
    appType
    topic
  }
}
`;