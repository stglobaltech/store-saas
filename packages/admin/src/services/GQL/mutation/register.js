import { gql } from '@apollo/client';

export const M_REGISTER = gql`
  mutation($gateSignUpDto: GateSignUpDto!) {
    gateSignup(gateSignUpDto: $gateSignUpDto) {
      success
      message {
        en
        ar
      }
      accessToken
      refreshToken
      userId
    }
  }
`;
