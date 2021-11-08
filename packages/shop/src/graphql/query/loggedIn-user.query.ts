import { gql } from "@apollo/client";

export const Q_GET_USERID = gql`
  query getUserID {
    userId @client
  }
`;

