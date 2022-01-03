import React from "react";
import { SEO } from "components/seo";
import OrderReceived from "features/order-received/order-received";
import { useCart } from "contexts/cart/use-cart";
import { useQuery, useSubscription } from "@apollo/client";
import { Q_GET_USER_ORDER } from "graphql/query/user-get-order.query";
import Loader from "components/loader/loader";
import ErrorMessage from "components/error-message/error-message";
import {
  S_CHEF_ORDER_SUBSCRIPTION,
  S_ORDER_STATUS_SUBSCRIPTION,
} from "graphql/subscriptions/order-status.subscription";
import { S_ORDER_PAYMENT_SUBSCRIPTION } from "graphql/subscriptions/stripe-payment.subscription";
import { useEffect } from "react";
import { Q_GET_USER_ACTIVE_ORDERS } from "graphql/query/get-user-active-order.query";
import {
  CURRENT_ACTIVE_ORDER_NOT_FOUND,
  ERROR_FETCHING_ACTIVE_ORDERS,
  UNAUTHORIZED,
  UNAUTHORIZED_MSG,
} from "utils/constant";
import { useAppState } from "contexts/app/app.provider";
import { FormattedMessage } from "react-intl";
import { getCartId, getUserId, removeCartId } from "utils/localStorage";

const OrderReceivedPage = () => {
  const cartId = getCartId();

  const { data, error, loading } = useQuery(Q_GET_USER_ACTIVE_ORDERS);
  const currency = (useAppState("workFlowPolicy") as any).currency;

  if (data?.userActiveOrders[0]?.cartId !== cartId && getCartId()) {
    return (
      <ErrorMessage>
        <FormattedMessage
          id="error"
          defaultMessage={CURRENT_ACTIVE_ORDER_NOT_FOUND}
        />
      </ErrorMessage>
    );
  }

  if (loading) return <Loader />;
  if (error) {
    if (error.message === UNAUTHORIZED) {
      return (
        <ErrorMessage>
          <FormattedMessage id="error" defaultMessage={UNAUTHORIZED_MSG} />
        </ErrorMessage>
      );
    } else {
      return (
        <ErrorMessage>
          <FormattedMessage
            id="error"
            defaultMessage={ERROR_FETCHING_ACTIVE_ORDERS}
          />
        </ErrorMessage>
      );
    }
  }

  const currentOrder = data?.userActiveOrders[0];

  if (!currentOrder) {
    return (
      <ErrorMessage>
        <FormattedMessage
          id="error"
          defaultMessage={CURRENT_ACTIVE_ORDER_NOT_FOUND}
        />
      </ErrorMessage>
    );
  } else {
    removeCartId();
  }

  return (
    <>
      <SEO title="Invoice - Orderznow" description="Invoice Details" />
      <OrderReceived orderDetails={currentOrder} currency={currency} />
      {/* <OrderStatusSubscriptionWrapper orderId={currentOrder._id} /> */}
    </>
  );
};

export default OrderReceivedPage;
