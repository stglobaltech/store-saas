import gql from 'graphql-tag';

export const M_CREATE_PRODUCT_CATEGORY = gql`
  mutation($categoryCreateInput: CategoryCreateInputDto!) {
    createCategory(categoryCreateInput: $categoryCreateInput) {
      success
      message {
        en
        ar
      }
    }
  }
`;
