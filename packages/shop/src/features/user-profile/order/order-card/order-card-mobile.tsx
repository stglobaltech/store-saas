import React from "react";
import Table from "rc-table";
import Collapse, { Panel } from "rc-collapse";
import Progress from "components/progress-box/progress-box";

import {
  OrderListHeader,
  TrackID,
  Status,
  OrderMeta,
  Meta,
  CardWrapper,
  OrderDetail,
  DeliveryInfo,
  DeliveryAddress,
  Address,
  CostCalculation,
  PriceRow,
  Price,
  ProgressWrapper,
  OrderTable,
  OrderTableMobile,
} from "./order-card.style";
import { FormattedMessage } from "react-intl";
import { useSubscription } from "@apollo/client";
import {
  S_STORE_CANCELLED_ORDER,
  S_STORE_FINISHED_ORDER,
} from "graphql/subscriptions/order-status.subscription";
import { getUserId } from "utils/localStorage";
import { constructEventOrder } from "utils/refactor-product-before-adding-to-cart";
import { useAppState } from "contexts/app/app.provider";

type MobileOrderCardProps = {
  orderId?: any;
  onClick?: (e: any) => void;
  className?: any;
  status?: any;
  date?: any;
  deliveryTime?: any;
  amount?: number;
  tableData?: any;
  columns?: any;
  address?: string;
  subtotal?: number;
  discount?: number;
  deliveryFee?: number;
  grandTotal?: number;
  orders?: any;
  refetch?: () => void;
};

const components = {
  table: OrderTable,
};

const OrderCard: React.FC<MobileOrderCardProps> = ({
  onClick,
  className,
  columns,
  orders,
  refetch,
  orderId,
}) => {
  //   const displayDetail = className === 'active' ? '100%' : '0';
  const addAllClasses: string[] = ["accordion"];

  if (className) {
    addAllClasses.push(className);
  }

  const workFlowPolicy = useAppState("workFlowPolicy");
  const storeId = useAppState("activeStoreId");
  const userId = getUserId();

  const { data: storeFinishedOrder } = useSubscription(S_STORE_FINISHED_ORDER, {
    variables: {
      input: {
        storeId,
        orderId,
        userId,
      },
    },
  });

  const { data: storeCancelledOrder } = useSubscription(
    S_STORE_CANCELLED_ORDER,
    {
      variables: {
        input: {
          storeId,
          orderId,
          userId,
        },
      },
    }
  );

  if (
    storeFinishedOrder &&
    storeFinishedOrder.userReceivedOrderSubscription &&
    storeFinishedOrder.userReceivedOrderSubscription.payload
  ) {
    refetch();
  }

  if (
    storeCancelledOrder &&
    storeCancelledOrder.storeCancelledOrderUserWeb &&
    storeCancelledOrder.storeCancelledOrderUserWeb.payload
  ) {
    refetch();
  }

  return (
    <>
      <Collapse
        accordion={true}
        className={addAllClasses.join(" ")}
        defaultActiveKey="active"
      >
        {orders.map((order: any) => (
          <Panel
            header={
              <CardWrapper onClick={onClick}>
                <OrderListHeader>
                  <TrackID>
                    Order <span>#{order.shortOrderId}</span>
                  </TrackID>
                  <Status>{order.status}</Status>
                </OrderListHeader>

                <OrderMeta>
                  <Meta>
                    Order Date:{" "}
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </Meta>
                  <Meta className="price">
                    Total Price:
                    <span>{order.orderCart.totalQuotedPrice}</span>
                  </Meta>
                </OrderMeta>
              </CardWrapper>
            }
            headerClass="accordion-title"
            key={order._id}
          >
            <OrderDetail>
              <DeliveryInfo>
                <DeliveryAddress>
                  <h3>Delivery Address</h3>
                  <Address>
                    {order.orderCart.address.name}-
                    {order.orderCart.address.buildingNo}-
                    {order.orderCart.address.address}
                  </Address>
                </DeliveryAddress>

                <CostCalculation>
                  <PriceRow>
                    Subtotal
                    <Price>{order.orderCart.totalQuotedPrice}</Price>
                  </PriceRow>
                  {/* <PriceRow>
                    Discount
                    <Price>
                      {CURRENCY}
                      {order.discount}
                    </Price>
                  </PriceRow> */}
                  <PriceRow>
                    Delivery Fee
                    <Price>{order.orderCart.deliveryCost}</Price>
                  </PriceRow>
                  <PriceRow className="grandTotal">
                    Total
                    <Price>
                      {Number(order.orderCart.totalQuotedPrice) +
                        Number(order.orderCart.deliveryCost)}
                    </Price>
                  </PriceRow>
                </CostCalculation>
              </DeliveryInfo>

              <ProgressWrapper>
                <Progress
                  data={constructEventOrder(order.event)[0] ?? []}
                  status={constructEventOrder(order.event)[1]}
                />
              </ProgressWrapper>

              <OrderTableMobile>
                <Table
                  columns={columns}
                  data={order.orderCart.products}
                  rowKey={(record) => record._id}
                  components={components}
                  scroll={{ x: 450 }}
                  // scroll={{ y: 250 }}
                />
              </OrderTableMobile>
            </OrderDetail>
          </Panel>
        ))}
      </Collapse>
    </>
  );
};

export default OrderCard;
