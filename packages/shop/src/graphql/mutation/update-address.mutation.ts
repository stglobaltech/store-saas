import { gql } from "@apollo/client";

export const M_UPDATE_ADDRESS = gql`
  mutation($addressInput: AddressInputDto!) {
    saveAddress(addressInput: $addressInput) {
      id
      name
      address
      buildingNo
    }
  }
`;
