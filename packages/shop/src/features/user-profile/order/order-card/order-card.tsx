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
  orderPayType?:string;
};

const OrderCard: React.FC<OrderCardProps> = ({
  orderId,
  onClick,
  className,
  status,
  date,
  amount,
  currency,
  orderPayType
}) => {
  return (
    <>
      <SingleOrderList onClick={onClick} className={className}>
        <OrderListHeader>
          <TrackID>
            <FormattedMessage
              id="intlOrderCardTitleText"
              defaultMessage="Order"
            />
            <span>#{orderId}</span>
          </TrackID>
          <Status>{status}</Status>
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
            <FormattedMessage
              id="sss"
              defaultMessage="Payment Method"
            />
            : <span>{orderPayType}</span>
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
