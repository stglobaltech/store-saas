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
  S_STORE_CANCELLED_ORDER,
  S_STORE_FINISHED_ORDER,
  S_ORDER_STATUS_SUBSCRIPTION
} from "graphql/subscriptions/order-status.subscription";
import { getUserId } from "utils/localStorage";
import { constructEventOrder } from "utils/refactor-product-before-adding-to-cart";
import { useAppState } from "contexts/app/app.provider";

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
  event?: any;
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
  event,
  refetch,
}) => {
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

  const {data:orderStatusData}=useSubscription(S_ORDER_STATUS_SUBSCRIPTION,{
    variables:{
      input:{
        orderId
      }
    }
  })

  const { data: storeCancelledOrder } = useSubscription(S_STORE_CANCELLED_ORDER, {
    variables: {
      input: {
        storeId,
        orderId,
        userId,
      },
    },
  });

  let constructedEvents = constructEventOrder(event);
  let progressStatusData = constructedEvents[0];
  let progressStatus = constructedEvents[1];

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

  if (
    orderStatusData &&
    orderStatusData.orderStatusUpdateSubscribe &&
    orderStatusData.orderStatusUpdateSubscribe.tripStatus
  ) {
    refetch();
  }


  return (
    <>
      <DeliveryInfo>
        <DeliveryAddress>
          <h3>
            <FormattedMessage
              id="deliveryAddresTitle"
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
        <Progress data={progressStatusData} status={progressStatus} />
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
