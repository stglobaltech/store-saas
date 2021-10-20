import { gql } from '@apollo/client';

export const M_UPDATE_WORK_FLOW_POLICY = gql`
  mutation updateWorkFlowPolicyApi($configUpdateDto: WorkFlowPolicyInputDto!) {
    updateWorkFlowPolicyApi(configUpdateDto: $configUpdateDto) {
      plan {
        planName
        storeId
        storeName
        url
      }
    }
  }
`;
