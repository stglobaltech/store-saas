import React from "react";
import { SEO } from "components/seo";
import OrderReceived from "features/order-received/order-received";
import { useCart } from "contexts/cart/use-cart";
import { useQuery, useSubscription } from "@apollo/client";
import { Q_GET_USER_ORDER } from "graphql/query/user-get-order.query";
import Loader from "components/loader/loader";
import ErrorMessage from "components/error-message/error-message";
import { S_ORDER_STATUS_SUBSCRIPTION } from "graphql/subscriptions/order-status.subscription";
import { S_ORDER_PAYMENT_SUBSCRIPTION } from "graphql/subscriptions/stripe-payment.subscription";
import { useEffect } from "react";
import { Q_GET_USER_ACTIVE_ORDERS } from "graphql/query/get-user-active-order.query";
import { GENERAL_ERROR_MSG } from "utils/constant";

const OrderReceivedPage = () => {
  const { data, error, loading } = useQuery(Q_GET_USER_ACTIVE_ORDERS);

  const { getWorkFlowPolicyOfStore, clearCart } = useCart();

  if (loading) return <Loader />;
  if (error)
    return (
      <ErrorMessage
        message={
          "Couldn't fetch your last order! Try after sometime or contact our support team"
        }
      />
    );

  const currentOrder = data?.userActiveOrders[0];

  console.log('currentOrder',currentOrder);

  return (
    <>
      <SEO title="Invoice - Orderznow" description="Invoice Details" />
      <OrderReceived
        orderDetails={currentOrder}
        currency={getWorkFlowPolicyOfStore().currency}
      />
    </>
  );
};

export default OrderReceivedPage;
