import { gql } from '@apollo/client';

export const UPDATE_ME = gql`
  mutation($meInput: String!) {
    updateMe(meInput: $meInput) {
      id
      name
      email
    }
  }
`;
