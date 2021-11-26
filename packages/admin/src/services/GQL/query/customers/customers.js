import { gql } from "@apollo/client";

export const Q_GET_USERS = gql`
  query reeshaGetUsers($userFindInputDto: UserFindInputDto!) {
    reeshaGetUsers(userFindInputDto: $userFindInputDto) {
      users {
        _id
        name
        email
        countryCode
        status
        mobile
        isActivated
      }
      pagination {
        hasPrevPage
        hasNextPage
        page
      }
    }
  }
`;
