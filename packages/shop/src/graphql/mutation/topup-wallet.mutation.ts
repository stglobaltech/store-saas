import { gql } from "@apollo/client";

export const M_WALLET_TOPUP = gql`
  mutation walletTopup($input: WalletTopupInputDto!) {
    walletTopup(input: $input) {
      stripeCheckoutUrl
    }
  }
`;
