import { gql } from '@apollo/client';

export const M_FINISH_ORDER_WITHOUT_FLEET = gql`
  mutation($userReceivedOrder: UserRecievedOrderDto!) {
    userRecievedOrder(input: $userReceivedOrder) {
      success
      message {
        en
        ar
      }
    }
  }
`;

export const M_FINISH_ORDER_WITH_FLEET = gql`
  mutation($finishOrder: DriverStatusUpdateDto!) {
    storeFinishOrder(chefInputDto: $finishOrder) {
      success
      message {
        en
        ar
      }
      event {
        description
      }
      status
      driverStatus
      storeStatus
      tripStatus
    }
  }
`;
