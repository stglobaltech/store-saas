import { gql } from '@apollo/client';

export const Q_GET_CUSTOMERS_FOR_STORE = gql`
  query getCustomersForStore($userFindInputDto: UserFindInputDto!) {
    getCustomersForStore(userFindInputDto: $userFindInputDto) {
      users {
        _id
        name
        email
        countryCode
        mobile
        status
        deviceType
        osVersion
        deviceModel
        wallet {
          balance
          createdAt
          updatedAt
        }
        smsNotification
        emailNotification
      }
      pagination {
        hasPrevPage
        hasNextPage
        perPage
        page
      }
    }
  }
`;
