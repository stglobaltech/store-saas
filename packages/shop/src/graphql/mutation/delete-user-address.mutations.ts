import { gql } from "@apollo/client";

export const M_DELETE_USER_ADDRESS = gql`
  mutation deleteAddress($addressDeleteInput: AddressDeleteInputDto!) {
    deleteAddress(addressDeleteInput: $addressDeleteInput) {
      status
    }
  }
`;
