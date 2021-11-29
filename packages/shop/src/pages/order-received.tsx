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
  ERROR_FETCHING_YOUR_LAST_ORDER,
  GENERAL_ERROR_MSG,
  UNAUTHORIZED,
  UNAUTHORIZED_MSG,
} from "utils/constant";
import { useAppState } from "contexts/app/app.provider";
import { FormattedMessage } from "react-intl";

const OrderReceivedPage = () => {
  const { data, error, loading } = useQuery(Q_GET_USER_ACTIVE_ORDERS);
  
  // const {
  //   data: subscriptionData,
  //   loading: subscriptionLoading,
  //   error: subscriptionError,
  // } = useSubscription(S_ORDER_PAYMENT_SUBSCRIPTION, {
  //   variables: {
  //     input: {
  //       userId: localStorage.getItem("userId"),
  //       cartId: localStorage.getItem("cartId"),
  //     },
  //   },
  // });

  const currency = (useAppState("workFlowPolicy") as any).currency;

  if (loading) return <Loader />;
  if (error) {
    if (error.message === UNAUTHORIZED) {
      return (
        <ErrorMessage>
          <FormattedMessage id="error" defaultMessage={UNAUTHORIZED_MSG} />
        </ErrorMessage>
      );
    }
  }

  const currentOrder = data?.userActiveOrders[0];

  if (!currentOrder)
    return (
      <ErrorMessage>
        <FormattedMessage
          id="error"
          defaultMessage={CURRENT_ACTIVE_ORDER_NOT_FOUND}
        />
      </ErrorMessage>
    );

  return (
    <>
      <SEO title="Invoice - Orderznow" description="Invoice Details" />
      <OrderReceived orderDetails={currentOrder} currency={currency} />
      {/* <OrderStatusSubscriptionWrapper orderId={currentOrder._id} /> */}
    </>
  );
};

export default OrderReceivedPage;
