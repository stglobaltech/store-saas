import { gql } from '@apollo/client';

export const UPDATE_ME = gql`
  mutation($meInput: String!) {
    updateMe(meInput: $meInput) {
      id
      name
      email
    }
  }
`;

export const M_USER_LOGIN=gql`
mutation userLogin($userLoginInputDto:UserLoginInputDto!){
  userLogin(userLoginInputDto:$userLoginInputDto){
    accessToken
    refreshToken
    success
    userId
  }
}
`;
