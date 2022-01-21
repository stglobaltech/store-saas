import { gql } from '@apollo/client';

export const M_TOGGLE_PRODUCT_ISActivated = gql`
  mutation(
    $productToggleIsActivatedInputDto: ProductToggleIsActivatedInputDto!
  ) {
    toggleProductIsActivatedState(
      productToggleIsActivatedInputDto: $productToggleIsActivatedInputDto
    ) {
      success
      message {
        ar
        en
      }
    }
  }
`;
