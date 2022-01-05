import { gql } from '@apollo/client';

export const Q_WORK_FLOW_POLICY = gql`
  query workFlowPolicyApi {
    workFlowPolicyApi {
      plan {
        storeId
        storeName
        url
        domain
      }
    }
  }
`;

export const Q_STORE_PLAN_WORK_FLOW_POLICY = gql`
  query getParticularStorePlanForGate($storeId: String!) {
    getParticularStorePlanForGate(storeId: $storeId) {
      data {
        globalVat
        plan {
          vat
          isFleetRequired
          currency
        }
      }
    }
  }
`;
