import React from "react";
import {
  SingleOrderList,
  OrderListHeader,
  TrackID,
  Status,
  OrderMeta,
  Meta,
} from "./order-card.style";
import { FormattedMessage } from "react-intl";
import { useSubscription } from "@apollo/client";
import {
  S_CHEF_ORDER_SUBSCRIPTION,
  S_ORDER_STATUS_SUBSCRIPTION,
} from "graphql/subscriptions/order-status.subscription";

type OrderCardProps = {
  orderId?: any;
  onClick?: (e: any) => void;
  className?: any;
  status?: any;
  date?: any;
  deliveryTime?: any;
  amount?: number;
  currency?: string;
  orderPayType?: string;
  shortOrderId?: string;
};

const OrderCard: React.FC<OrderCardProps> = ({
  orderId,
  onClick,
  className,
  status,
  date,
  amount,
  currency,
  orderPayType,
  shortOrderId,
}) => {
  // const { data: orderStatusData, error: orderStatusError } = useSubscription(
  //   S_ORDER_STATUS_SUBSCRIPTION,
  //   {
  //     variables: {
  //       input: {
  //         orderId,
  //       },
  //     },
  //   }
  // );

  return (
    <>
      <SingleOrderList onClick={onClick} className={className}>
        <OrderListHeader>
          <TrackID>
            <FormattedMessage
              id="intlOrderCardTitleText"
              defaultMessage="Order"
            />
            <span>#{shortOrderId}</span>
          </TrackID>
        </OrderListHeader>

        <OrderMeta>
          <Meta>
            <FormattedMessage
              id="intlOrderCardDateText"
              defaultMessage="Order Date"
            />
            : <span>{new Date(date).toDateString()}</span>
          </Meta>
          <Meta>
            <FormattedMessage id="sss" defaultMessage="Payment Method" />:{" "}
            <span>{orderPayType}</span>
          </Meta>
          <Meta className="price">
            <FormattedMessage
              id="intlOrderCardTotalText"
              defaultMessage="Total Price"
            />
            :
            <span>
              {currency}
              {amount}
            </span>
          </Meta>
        </OrderMeta>
      </SingleOrderList>
    </>
  );
};

export default OrderCard;
