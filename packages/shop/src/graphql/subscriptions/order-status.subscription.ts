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


export const S_STORE_FINISHED_ORDER=gql`
subscription userReceivedOrderSubscription($input:UserWebOrderSubscriptionInputDto!){
  userReceivedOrderSubscription(input:$input){
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


export const S_STORE_CANCELLED_ORDER=gql`
subscription storeCancelledOrderUserWeb($input:UserWebOrderSubscriptionInputDto!){
  storeCancelledOrderUserWeb(input:$input){
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