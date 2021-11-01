import { gql } from "@apollo/client";

export const M_SAVE_ADDRESS = gql`
  mutation($addressInput: AddressInputDto!) {
    saveAddress(addressInput: $addressInput) {
      id
      name
      address
      buildingNo
    }
  }
`;
