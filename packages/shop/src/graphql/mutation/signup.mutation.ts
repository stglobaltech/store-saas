import { gql } from "@apollo/client";

export const M_USER_SIGNUP = gql`
  mutation userSignup($userSignupInputDto: UserSignupInputDto!) {
    userSignup(userSignupInputDto: $userSignupInputDto) {
      success
      message {
        en
      }
    }
  }
`;
