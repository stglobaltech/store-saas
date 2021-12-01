import React from "react";
import Table from "rc-table";
import {
  DeliveryInfo,
  DeliveryAddress,
  Address,
  CostCalculation,
  PriceRow,
  Price,
  ProgressWrapper,
  OrderTableWrapper,
  OrderTable,
} from "./order-details.style";
import Progress from "components/progress-box/progress-box";
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

type OrderDetailsProps = {
  tableData?: any;
  columns?: any;
  progressData?: any;
  address?: any;
  subtotal?: number;
  discount?: number;
  deliveryFee?: number;
  grandTotal?: number;
  orderId?: string;
  storeProgressStatus?: any;
  refetch?: () => void;
};

const components = {
  table: OrderTable,
};

const OrderDetails: React.FC<OrderDetailsProps> = ({
  tableData,
  columns,
  address,
  subtotal,
  discount,
  deliveryFee,
  grandTotal,
  orderId,
  storeProgressStatus,
  refetch,
}) => {
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

  console.log('driver events',orderStatusData);

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
      <DeliveryInfo>
        <DeliveryAddress>
          <h3>
            <FormattedMessage
              id="deliveryAddressTitle"
              defaultMessage="Delivery Address"
            />
          </h3>
          <Address>
            <b>{address.name}</b> -{address.buildingNo}-{address.address}
          </Address>
        </DeliveryAddress>

        <CostCalculation>
          <PriceRow>
            <FormattedMessage id="subTotal" defaultMessage="Sub total" />
            <Price>{subtotal}</Price>
          </PriceRow>
          <PriceRow>
            <FormattedMessage
              id="intlOrderDetailsDiscount"
              defaultMessage="Discount"
            />
            <Price>{discount}</Price>
          </PriceRow>
          <PriceRow>
            <FormattedMessage
              id="intlOrderDetailsDelivery"
              defaultMessage="Delivery Fee"
            />
            <Price>{deliveryFee}</Price>
          </PriceRow>
          <PriceRow className="grandTotal">
            <FormattedMessage id="totalText" defaultMessage="Total" />
            <Price>{Number(subtotal) + Number(deliveryFee)}</Price>
          </PriceRow>
        </CostCalculation>
      </DeliveryInfo>

      <ProgressWrapper>
        <Progress data={progressData} status={progressStatus} />
      </ProgressWrapper>

      <OrderTableWrapper>
        <Table
          columns={columns}
          data={tableData}
          rowKey={(record) => record._id}
          components={components}
          className="orderDetailsTable"
          // scroll={{ y: 350 }}
        />
      </OrderTableWrapper>
    </>
  );
};

export default OrderDetails;
