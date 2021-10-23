import { gql } from "@apollo/client";

export const M_LOGIN = gql`
  mutation ($gateLoginDto: GateLoginDto!) {
    gateLogin(gateLoginDto: $gateLoginDto) {
      success
      accessToken
      refreshToken
      userId
      message {
        en
        ar
      }
    }
  }
`;