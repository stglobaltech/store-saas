import { gql } from "@apollo/client";

// export const S_ORDER_STATUS_SUBSCRIPTION = gql`
//   subscription orderStatusUpdateSubscribe(
//     $input: OrderChatSubscriptionInputDto!
//   ) {
//     orderStatusUpdateSubscribe(input: $input) {
//       success
//       message {
//         en
//         ar
//       }
//       event {
//         description
//       }
//       tripStatus
//       driverStatus
//       storeStatus
//       status
//     }
//   }
// `;


export const S_CHEF_ORDER_SUBSCRIPTION=gql`
subscription($input: ChefOrderSubscriptionInputDto!) {
  chefOrderSubscribe(input: $input) {
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