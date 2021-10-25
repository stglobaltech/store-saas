import { gql } from '@apollo/client';

export const M_UPDATE_STORECONTACTADDRESS = gql`
  mutation($storeEditInput: StoreContactAddressEditInputDto!) {
    editStoreContactAddress(storeEditInput: $storeEditInput) {
      success
      message {
        en
        ar
      }
    }
  }
`;
