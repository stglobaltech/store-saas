import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Container, Heading, Wrapper, Button } from "./topup-wallet.style";
import { Input } from "components/forms/input";
import { FormattedMessage, useIntl } from "react-intl";
import { M_WALLET_TOPUP } from "graphql/mutation/topup-wallet.mutation";
import { useRouter } from "next/router";
import { useAppState } from "contexts/app/app.provider";

function TopupWallet() {
  const workFlowPolicy=useAppState("workFlowPolicy")
  const storeId = useAppState("activeStoreId");

  const [amount, setAmount] = useState(0);
  const intl = useIntl();

  const router = useRouter();

  const [topup] = useMutation(M_WALLET_TOPUP, {
    onCompleted: (data) => {
      if (data && data.walletTopup && data.walletTopup.stripeCheckoutUrl) {
        router.push(data.walletTopup.stripeCheckoutUrl);
      }
    },
  });

  function handleSubmit() {
    const successUrl =
      window.location.protocol + "//" + window.location.host + "/checkout";
    topup({
      variables: {
        input: {
          amount: Number(amount),
          storeId,
          successUrl,
        },
      },
    });
  }

  return (
    <Wrapper>
      <Container>
        <Heading>
          <FormattedMessage id='topupAmount' defaultMessage='Topup Amount' />
        </Heading>
        <form>
          <Input
            type="text"
            placeholder={intl.formatMessage({
              id: "userSignupMobile",
              defaultMessage: "Mobile",
            })}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            height="48px"
            backgroundColor="#F7F7F7"
            mt="10px"
          />
        </form>
        <Button
          variant="primary"
          size="big"
          style={{ width: "100%", margin: "20px 0" }}
          type="submit"
          onClick={handleSubmit}
        >
          <FormattedMessage id='rechargeWallet' defaultMessage='Topup Wallet' />
        </Button>
      </Container>
    </Wrapper>
  );
}

export default TopupWallet;
