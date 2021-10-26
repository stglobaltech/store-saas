import gql from "graphql-tag";

export const M_EDIT_PRODUCT_CATEGORY = gql`
  mutation($categoryEditInput: CategoryEditInputDto!) {
    EditCategory(categoryEditInput: $categoryEditInput) {
      success
      message {
        en
        ar
      }
    }
  }
`;
