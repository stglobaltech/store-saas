import { gql } from '@apollo/client';

export const M_UPDATE_RESTAURANT = gql`
  mutation($storeEditInput: StoreEditInputDto!) {
    editStore(storeEditInput: $storeEditInput) {
      _id
      name {
        en
        ar
      }
      branchCode
      description {
        en
        ar
      }
      logo
      picture
    }
  }
`;
