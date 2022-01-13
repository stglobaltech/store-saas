import { gql } from "@apollo/client";

export const Q_GET_STORE_BRANCHES = gql`
  query getStoreBranches {
    getStoreBranchesBasedOnDomain {
      _id
      name {
        en
        ar
      }
    }
  }
`;
