import { gql } from "@apollo/client";

export const Q_STORE_PLAN_FOR_USER_WEB_ADMIN = gql`
  query getStorePlanForUserWebAdmin($storeId: String!) {
    getStorePlanForUserWebAdmin(storeId: $storeId) {
      data {
        plan {
          vat
        }
        globalVat
      }
    }
  }
`;
