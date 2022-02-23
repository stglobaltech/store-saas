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
import { useAppState } from "contexts/app/app.provider";
import { Paginate } from "components/pagination/pagination";
import { useLocale } from 'contexts/language/language.provider';

const OrdersContent: React.FC<{
  data: any;
  handleNextPage: (nextPage: number) => void;
}> = ({ data, handleNextPage }) => {
  const locale = useLocale();
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
              <ItemName>{locale === 'en' ? record.name.en : record.name.ar}</ItemName>
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

  const [order, setOrder] = useState(null);
  const [active, setActive] = useState("");

  const workFlowPolicy = useAppState("workFlowPolicy") as any;

  const [targetRef, size] = useComponentSize();
  const orderListHeight = size.height - 79;

  useEffect(() => {
    const firstorder = data?.getUserOrders?.orders[0];
    if (firstorder) {
      setOrder(firstorder);
      setActive(firstorder._id);
    }
  }, [data && data.getUserOrders && data.getUserOrders.orders]);

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
              id="userOrderHistory"
              defaultMessage="My Orders"
            />
          </Title>
          <Scrollbar className="order-scrollbar">
            <OrderList>
              {data?.getUserOrders?.orders?.length !== 0 ? (
                data.getUserOrders?.orders.map((current: any) => (
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
                    id="userOrderHistoryNotFound"
                    defaultMessage="No order found"
                  />
                </NoOrderFound>
              )}
            </OrderList>
          </Scrollbar>
          <Paginate
            currentPage={data?.getUserOrders?.pagination?.page}
            hasNextPage={data?.getUserOrders?.pagination?.hasNextPage}
            hasPrevPage={data?.getUserOrders?.pagination?.hasPrevPage}
            fetchPage={handleNextPage}
          />
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
              event={order.event}
              orderStatus={order.status}
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
            orders={data?.getUserOrders?.orders}
            className={order && order._id === active ? "active" : ""}
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
