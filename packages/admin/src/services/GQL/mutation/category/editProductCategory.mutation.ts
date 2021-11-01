import gql from "graphql-tag";

export const M_EDIT_PRODUCT_CATEGORY = gql`
  mutation($categoryEditInput: CategoryEditInputDto!) {
    editCategory(categoryEditInput: $categoryEditInput) {
      success
      message {
        en
        ar
      }
    }
  }
`;
