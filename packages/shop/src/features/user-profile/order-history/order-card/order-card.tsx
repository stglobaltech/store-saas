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
  key?: string;
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
  key,
}) => {

  return (
    <div key={key}>
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
            <FormattedMessage id="paymenMethodText" defaultMessage="Payment Method" />:{" "}
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
    </div>
  );
};

export default OrderCard;
