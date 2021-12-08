import { gql } from '@apollo/client';

export const M_CANCEL_ORDER = gql`
  mutation($chefInputDto: ChefCancelInputDto!) {
    storeCancelOrder(chefInputDto: $chefInputDto) {
      success
      message {
        en
        ar
      }
      event {
        description
      }
    }
  }
`;
