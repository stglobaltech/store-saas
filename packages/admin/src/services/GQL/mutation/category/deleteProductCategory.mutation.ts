import gql from 'graphql-tag';

export const M_DELETE_PRODUCT_CATEGORY = gql`
  mutation($categoryDeleteInput: CategoryDeleteInputDto!) {
    deleteCategory(categoryDeleteInput: $categoryDeleteInput) {
      success
      message {
        en
        ar
      }
    }
  }
`;
