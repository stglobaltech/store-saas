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

const progressData = ["PEN", "CONF", "EXP", "FIN", "CAN", "REJ"];

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

const OrdersContent: React.FC<{}> = () => {
  const [order, setOrder] = useState(null);
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);

  const workFlowPolicy = useAppState("workFlowPolicy") as any;

  const [targetRef, size] = useComponentSize();
  const orderListHeight = size.height - 79;
  const { data, error, loading } = useQuery(Q_USER_ORDER_HISTORY, {
    variables: {
      orderFindInputDto: {
        paginate: {
          page,
          perPage: 10,
        },
      },
    },
  });

  useEffect(() => {
    if (
      data &&
      data.getUserOrders &&
      data.getUserOrders.orders &&
      data.getUserOrders.orders.length
    ) {
      const currentOrder = data.getUserOrders.orders[0];
      setOrder(currentOrder);
      setActive(currentOrder._id);
    }
  }, [data && data.getUserOrders]);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) return <div>{error.message}</div>;

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
              defaultMessage="My Order"
            />
          </Title>
          <Scrollbar className="order-scrollbar">
            <OrderList>
              {data.getUserOrders.orders.length !== 0 ? (
                data.getUserOrders.orders.map((current: any) => (
                  <OrderCard
                    key={current._id}
                    orderId={current.shortOrderId}
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
              progressStatus={order.status}
              progressData={progressData}
              address={order.orderCart.address}
              subtotal={order.orderCart.totalQuotedPrice}
              discount={order.discount}
              deliveryFee={order.orderCart.deliveryCost}
              grandTotal={order.amount}
              tableData={order.orderCart.products}
              columns={orderTableColumns}
              orderId={order._id}
            />
          )}
        </OrderDetailsWrapper>
      </DesktopView>

      <MobileView>
        <OrderList>
          <OrderCardMobile
            orders={data.getUserOrders.orders}
            className={order && order._id === active ? 'active' : ''}
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
