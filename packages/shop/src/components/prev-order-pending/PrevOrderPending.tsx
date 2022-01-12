import { Button } from "components/button/button";
import ErrorMessage from "components/error-message/error-message";
import Link from "next/link";
import React from "react";
import { FormattedMessage } from "react-intl";
import { PREV_ORDER_INCOMPLETE } from "utils/constant";

function PrevOrderPending() {
  return (
    <ErrorMessage>
      <FormattedMessage
        id="prevOrederPending"
        defaultMessage={PREV_ORDER_INCOMPLETE}
      />
      <Link href="/order-received">
        <Button>Track Your Order Status</Button>
      </Link>
    </ErrorMessage>
  );
}

export default PrevOrderPending;
