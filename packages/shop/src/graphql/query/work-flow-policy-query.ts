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



export const Q_WORK_FLOW_POLICY_BASED_ON_DOMAIN = gql`
  query getWorkFlowPolicyOfStoreBasedOnDomain {
    getWorkFlowPolicyOfStoreBasedOnDomain {
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
