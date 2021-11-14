import React from "react";
import { SEO } from "components/seo";
import OrderReceived from "features/order-received/order-received";
import { useCart } from "contexts/cart/use-cart";
import { useQuery, useSubscription } from "@apollo/client";
import { Q_GET_USER_ORDER } from "graphql/query/user-get-order.query";
import Loader from "components/loader/loader";
import ErrorMessage from "components/error-message/error-message";
import { S_ORDER_STATUS_SUBSCRIPTION } from "graphql/subscriptions/order-status.subscription";
import { S_STRIPE_PAYMENT_LISTEN_EVENTS } from "graphql/subscriptions/stripe-payment.subscription";
import { useEffect } from "react";
import { Q_GET_USER_ACTIVE_ORDERS } from "graphql/query/get-user-active-order.query";

const OrderReceivedPage = () => {
  const { data, error, loading } = useQuery(Q_GET_USER_ACTIVE_ORDERS);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message="Something went wrong :(" />;

  const currentOrder = data?.userActiveOrders[0];

  return (
    <>
      <SEO title="Invoice - PickBazar" description="Invoice Details" />
      <OrderReceived orderDetails={currentOrder} />
    </>
  );
};

export default OrderReceivedPage;
