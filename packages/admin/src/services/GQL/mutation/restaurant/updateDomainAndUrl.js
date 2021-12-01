import { gql } from "@apollo/client";

export const M_UPDATE_DOMAIN_AND_URL = gql`
  mutation updateDomainAndUrl($input: UpdateDomainAndUrlInputDto!) {
    updateDomainAndUrl(input: $input) {
      _id
      domain
      url
    }
  }
`;
