import { gql } from '@apollo/client';

export const Q_WORK_FLOW_POLICY = gql`
  query workFlowPolicyApi {
    workFlowPolicyApi {
      plan {
        storeId
        storeName
        url
      }
    }
  }
`;
