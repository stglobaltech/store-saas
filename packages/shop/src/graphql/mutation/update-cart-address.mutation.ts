import { gql } from "@apollo/client";

export const M_UPDATE_CART_ADDRESS = gql`
  mutation($updateCartAddressInput: UpdateCartAddressInput!) {
    updateCartAddress(updateCartAddressInput: $updateCartAddressInput) {
      addressId
      name
      address
    }
  }
`;
