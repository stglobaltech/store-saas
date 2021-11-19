import { gql } from "@apollo/client";

export const Q_WORK_FLOW_POLICY = gql`
  query getWorkFlowpolicyPlanOfStoreForUserWeb($storeId: String!) {
    getWorkFlowpolicyPlanOfStoreForUserWeb(storeId: $storeId) {
      data {
        plan {
          storeId
          storeName
          paymentType
          gateWayName
          currency
        }
      }
    }
  }
`;
