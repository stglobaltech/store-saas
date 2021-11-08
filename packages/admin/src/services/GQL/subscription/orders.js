import { gql } from '@apollo/client';

export const S_CHEF_ORDER_PUSH = gql`
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
