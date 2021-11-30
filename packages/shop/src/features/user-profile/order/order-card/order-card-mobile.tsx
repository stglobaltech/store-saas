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
  S_CHEF_ORDER_SUBSCRIPTION,
  S_ORDER_STATUS_SUBSCRIPTION,
} from "graphql/subscriptions/order-status.subscription";
import { getUserId } from "utils/localStorage";
import {
  DELIVERED,
  DRIVER_ON_THE_WAY_TO_STORE,
  OUT_FOR_DELIVERY,
  PENDING,
  REACHED_STORE,
  STORE_ACCEPTED,
  STORE_CANCELLED_ORDER,
  STORE_ORDER_READY,
  STORE_REJECTED_ORDER,
} from "utils/constant";

const progressStoreAcceptedData = [
  PENDING,
  STORE_ACCEPTED,
  STORE_ORDER_READY,
  DRIVER_ON_THE_WAY_TO_STORE,
  REACHED_STORE,
  OUT_FOR_DELIVERY,
  DELIVERED,
];

const progressStoreRejectedData = [
  PENDING,
  STORE_REJECTED_ORDER,
  STORE_ORDER_READY,
  DRIVER_ON_THE_WAY_TO_STORE,
  OUT_FOR_DELIVERY,
  DELIVERED,
];

const progressStoreCancelledData = [
  PENDING,
  STORE_ACCEPTED,
  STORE_CANCELLED_ORDER,
  DRIVER_ON_THE_WAY_TO_STORE,
  OUT_FOR_DELIVERY,
  DELIVERED,
];

const progressStoreReadyOrderData = [
  PENDING,
  STORE_ACCEPTED,
  STORE_ORDER_READY,
  DRIVER_ON_THE_WAY_TO_STORE,
  OUT_FOR_DELIVERY,
  DELIVERED,
];

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
  storeProgressStatus?:any;
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
  storeProgressStatus
}) => {
  //   const displayDetail = className === 'active' ? '100%' : '0';
  const addAllClasses: string[] = ["accordion"];

  if (className) {
    addAllClasses.push(className);
  }

  const storeId = process.env.NEXT_PUBLIC_STG_CLIENT_ID;
  const userId = getUserId();

  const { data: chefEventsData } = useSubscription(S_CHEF_ORDER_SUBSCRIPTION, {
    variables: {
      input: {
        orderId,
        storeId,
        userId,
      },
    },
  });

  const { data: orderStatusData } = useSubscription(
    S_ORDER_STATUS_SUBSCRIPTION,
    {
      variables: {
        input: {
          orderId,
        },
      },
    }
  );

  let progressData = progressStoreAcceptedData;
  let progressStatus = storeProgressStatus ?? PENDING;

  if (
    chefEventsData &&
    chefEventsData.chefOrderSubscribeForUser &&
    chefEventsData.chefOrderSubscribeForUser.payload
  ) {
    if (
      chefEventsData.chefOrderSubscribeForUser.payload?.eventType ===
      STORE_ACCEPTED.label
    ) {
      progressData = progressStoreAcceptedData;
      progressStatus = STORE_ACCEPTED;
    } else if (
      chefEventsData.chefOrderSubscribeForUser.payload?.eventType ===
      STORE_REJECTED_ORDER.label
    ) {
      progressData = progressStoreRejectedData;
      progressStatus = STORE_REJECTED_ORDER;
    } else if (
      chefEventsData.chefOrderSubscribeForUser.payload?.eventType ===
      STORE_CANCELLED_ORDER.label
    ) {
      progressData = progressStoreCancelledData;
      progressStatus = STORE_CANCELLED_ORDER;
    } else if (
      chefEventsData.chefOrderSubscribeForUser.payload?.eventType ===
      STORE_ORDER_READY.label
    ) {
      progressData = progressStoreReadyOrderData;
      progressStatus = STORE_ORDER_READY;
    }
    refetch();
  }

  if (
    orderStatusData &&
    orderStatusData.orderStatusUpdateSubscribe &&
    orderStatusData.orderStatusUpdateSubscribe.tripStatus
  ) {
    if (
      orderStatusData.orderStatusUpdateSubscribe.tripStatus ===
      DRIVER_ON_THE_WAY_TO_STORE.label
    ) {
      progressData = progressStoreAcceptedData;
      progressStatus = DRIVER_ON_THE_WAY_TO_STORE;
    } else if (
      orderStatusData.orderStatusUpdateSubscribe.tripStatus ===
      REACHED_STORE.label
    ) {
      progressData = progressStoreAcceptedData;
      progressStatus = REACHED_STORE;
    } else if (
      orderStatusData.orderStatusUpdateSubscribe.tripStatus ===
      OUT_FOR_DELIVERY.label
    ) {
      progressData = progressStoreAcceptedData;
      progressStatus = OUT_FOR_DELIVERY;
    }else if(orderStatusData.orderStatusUpdateSubscribe.tripStatus===DELIVERED.label){
      progressData=progressStoreAcceptedData;
      progressStatus=DELIVERED;
    }
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
                <Progress data={progressData} status={progressStatus} />
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
