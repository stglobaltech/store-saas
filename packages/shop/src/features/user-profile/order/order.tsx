import React, { useState, useEffect } from "react";
import { Scrollbar } from "components/scrollbar/scrollbar";
import { useQuery, gql } from "@apollo/client";
import {
  DesktopView,
  MobileView,
  OrderBox,
  OrderListWrapper,
  OrderList,
  OrderDetailsWrapper,
  Title,
  ImageWrapper,
  ItemWrapper,
  ItemDetails,
  ItemName,
  ItemSize,
  ItemPrice,
  NoOrderFound,
} from "./order.style";

import OrderDetails from "./order-details/order-details";
import OrderCard from "./order-card/order-card";
import OrderCardMobile from "./order-card/order-card-mobile";
import useComponentSize from "utils/useComponentSize";
import { FormattedMessage } from "react-intl";
import { Q_USER_ORDER_HISTORY } from "graphql/query/user-order-history.query";
import { useAppState } from "contexts/app/app.provider";
import { Q_GET_USERID } from "graphql/query/loggedIn-queries.query";
import { Q_GET_USER_ACTIVE_ORDERS } from "graphql/query/get-user-active-order.query";
import ErrorMessage from "components/error-message/error-message";
import {
  DELIVERED,
  ERROR_FETCHING_ACTIVE_ORDERS,
  OUT_FOR_DELIVERY,
  PENDING,
  REACHED_STORE,
  STORE_ACCEPTED,
  STORE_ORDER_READY,
} from "utils/constant";

const progressData = [
  PENDING,
  STORE_ACCEPTED,
  STORE_ORDER_READY,
  REACHED_STORE,
  OUT_FOR_DELIVERY,
  DELIVERED,
];

const orderTableColumns = [
  {
    title: <FormattedMessage id="cartItems" defaultMessage="Items" />,
    dataIndex: "",
    key: "items",
    width: 250,
    ellipsis: true,
    render: (text, record) => {
      return (
        <ItemWrapper>
          <ImageWrapper>
            {/* <img src={record.image} alt={record.title} /> */}
          </ImageWrapper>

          <ItemDetails>
            <ItemName>{record.name.en}</ItemName>
            <ItemSize>{record.quantity}</ItemSize>
            <ItemPrice>
              {Math.floor(record.quotedPrice / record.quantity)}
            </ItemPrice>
          </ItemDetails>
        </ItemWrapper>
      );
    },
  },
  {
    title: (
      <FormattedMessage id="intlTableColTitle2" defaultMessage="Quantity" />
    ),
    dataIndex: "quantity",
    key: "quantity",
    align: "center",
    width: 100,
  },
  {
    title: <FormattedMessage id="intlTableColTitle3" defaultMessage="Price" />,
    dataIndex: "",
    key: "price",
    align: "right",
    width: 100,
    render: (text, record) => {
      return <p>{record.quotedPrice}</p>;
    },
  },
];

const OrdersContent: React.FC<{
  data: any;
  error: any;
  loading: any;
  refetch: () => void;
}> = ({ data, error, loading, refetch }) => {
  const [order, setOrder] = useState(null);
  const [active, setActive] = useState("");

  const workFlowPolicy = useAppState("workFlowPolicy") as any;

  const [targetRef, size] = useComponentSize();
  const orderListHeight = size.height - 79;

  useEffect(() => {
    if (
      data &&
      data.userActiveOrders &&
      data.userActiveOrders &&
      data.userActiveOrders.length
    ) {
      const currentOrder = data.userActiveOrders[0];
      if (order && active) {
        const currentClickedOrder = data.userActiveOrders.filter(
          (o) => o._id === order._id
        );
        if (currentClickedOrder) {
          setOrder(currentClickedOrder[0]);
          setActive(currentClickedOrder[0]._id);
        } else {
          setOrder(currentOrder);
          setActive(currentOrder._id);
        }
      } else {
        setOrder(currentOrder);
        setActive(currentOrder._id);
      }
    }
  }, [data && data.userActiveOrders]);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error)
    return (
      <ErrorMessage>
        <FormattedMessage
          id="error"
          defaultMessage={ERROR_FETCHING_ACTIVE_ORDERS}
        />
      </ErrorMessage>
    );

  const handleClick = (order: any) => {
    setOrder(order);
    setActive(order._id);
  };

  return (
    <OrderBox>
      <DesktopView>
        <OrderListWrapper style={{ height: size.height }}>
          <Title style={{ padding: "0 20px" }}>
            <FormattedMessage
              id="intlOrderPageTitle"
              defaultMessage="My ongoing orders"
            />
          </Title>
          <Scrollbar className="order-scrollbar">
            <OrderList>
              {data.userActiveOrders.length !== 0 ? (
                data.userActiveOrders.map((current: any) => (
                  <OrderCard
                    key={current._id}
                    shortOrderId={current.shortOrderId}
                    orderId={current._id}
                    className={current._id === active ? "active" : ""}
                    status={current.status}
                    date={current.createdAt}
                    orderPayType={current.orderPayType}
                    amount={current.orderCart.totalQuotedPrice}
                    onClick={() => {
                      handleClick(current);
                    }}
                    currency={workFlowPolicy.currency}
                  />
                ))
              ) : (
                <NoOrderFound>
                  <FormattedMessage
                    id="intlNoOrderFound"
                    defaultMessage="No order found"
                  />
                </NoOrderFound>
              )}
            </OrderList>
          </Scrollbar>
        </OrderListWrapper>

        <OrderDetailsWrapper ref={targetRef}>
          <Title style={{ padding: "0 20px" }}>
            <FormattedMessage
              id="orderDetailsText"
              defaultMessage="Order Details"
            />
          </Title>
          {order && order._id && (
            <OrderDetails
              progressStatus={order.storeStatus}
              progressData={progressData}
              address={order.orderCart.address}
              subtotal={order.orderCart.totalQuotedPrice}
              discount={order.discount}
              deliveryFee={order.orderCart.deliveryCost}
              grandTotal={order.amount}
              tableData={order.orderCart.products}
              columns={orderTableColumns}
              orderId={order._id}
              refetch={refetch}
            />
          )}
        </OrderDetailsWrapper>
      </DesktopView>

      <MobileView>
        <OrderList>
          <OrderCardMobile
            orders={data.userActiveOrders}
            className={order && order._id === active ? "active" : ""}
            progressData={progressData}
            columns={orderTableColumns}
            onClick={() => {
              handleClick(order);
            }}
          />
        </OrderList>
      </MobileView>
    </OrderBox>
  );
};

export default OrdersContent;
