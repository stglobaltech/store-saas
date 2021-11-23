import React from "react";
import Link from "next/link";
import OrderReceivedWrapper, {
  OrderReceivedContainer,
  OrderInfo,
  OrderDetails,
  TotalAmount,
  BlockTitle,
  Text,
  InfoBlockWrapper,
  InfoBlock,
  ListItem,
  ListTitle,
  ListDes,
  Item,
} from "./order-received.style";
import { FormattedMessage } from "react-intl";

type OrderReceivedProps = {
  orderDetails: any;
  currency: string;
};

const OrderReceived: React.FunctionComponent<OrderReceivedProps> = ({
  orderDetails,
  currency,
}) => {
  return (
    <OrderReceivedWrapper>
      <OrderReceivedContainer>
        <Link href="/order">
          <a className="home-btn">
            <FormattedMessage
              id="orderHistoryAndTracking"
              defaultMessage="Track your orders"
            />
          </a>
        </Link>

        <OrderInfo>
          <BlockTitle>
            <FormattedMessage
              id="orderReceivedText"
              defaultMessage="Order Received"
            />
          </BlockTitle>

          <Text>
            <FormattedMessage
              id="orderReceivedSuccess"
              defaultMessage="Thank you. Your order has been received"
            />
          </Text>

          <InfoBlockWrapper>
            <InfoBlock>
              <Text bold className="title">
                <FormattedMessage
                  id="orderNumberText"
                  defaultMessage="Order Number"
                />
              </Text>
              <Text>{orderDetails.shortOrderId}</Text>
            </InfoBlock>

            <InfoBlock>
              <Text bold className="title">
                <FormattedMessage id="orderDateText" defaultMessage="Date" />
              </Text>
              <Text>{new Date(orderDetails.createdAt).toDateString()}</Text>
            </InfoBlock>

            <InfoBlock>
              <Text bold className="title">
                <FormattedMessage id="totalText" defaultMessage="Total" />
              </Text>
              <Text>
                {currency} {orderDetails.orderCart.totalPrice}
              </Text>
            </InfoBlock>

            <InfoBlock>
              <Text bold className="title">
                <FormattedMessage
                  id="paymenMethodText"
                  defaultMessage="Payment Method"
                />
              </Text>
              <Text>{orderDetails.orderPayType}</Text>
            </InfoBlock>
          </InfoBlockWrapper>
        </OrderInfo>

        <OrderDetails>
          <BlockTitle>
            <FormattedMessage
              id="orderDetailsText"
              defaultMessage="Order Details"
            />
          </BlockTitle>

          <ListItem>
            <ListTitle>
              <Text bold>
                <FormattedMessage
                  id="totalItemText"
                  defaultMessage="Total Items types Ordered"
                />
              </Text>
            </ListTitle>
            <ListDes>
              <Text>{orderDetails.orderCart.products.length}</Text>
            </ListDes>
          </ListItem>

          <ListItem>
            <ListTitle>
              <Text bold>
                <FormattedMessage
                  id="itemUnitsOrdered"
                  defaultMessage="Total Item Units Ordered"
                />
              </Text>
            </ListTitle>
            <ListDes>
              <Text>
                {orderDetails.orderCart.products.map((product, index) => {
                  return (
                    <Item key={index}>
                      {product.name.en} X {product.quantity}
                    </Item>
                  );
                })}
              </Text>
            </ListDes>
          </ListItem>

          <ListItem>
            <ListTitle>
              <Text bold>
                <FormattedMessage
                  id="orderTimeText"
                  defaultMessage="Order Time"
                />
              </Text>
            </ListTitle>
            <ListDes>
              <Text>
                {new Date(orderDetails.createdAt).toLocaleTimeString()}
              </Text>
            </ListDes>
          </ListItem>

          <ListItem>
            <ListTitle>
              <Text bold>
                <FormattedMessage
                  id="deliveryLocationText"
                  defaultMessage="Delivery Location"
                />
              </Text>
            </ListTitle>
            <ListDes>
              <Text>
                {orderDetails.orderCart.address.buildingNo}
                {orderDetails.orderCart.address.address}
              </Text>
            </ListDes>
          </ListItem>
        </OrderDetails>

        <TotalAmount>
          <BlockTitle>
            <FormattedMessage
              id="totalAmountText"
              defaultMessage="Total Amount"
            />
          </BlockTitle>

          <ListItem>
            <ListTitle>
              <Text bold>
                <FormattedMessage id="subTotal" defaultMessage="Sub total" />
              </Text>
            </ListTitle>
            <ListDes>
              <Text>{orderDetails.orderCart.totalQuotedPrice}</Text>
            </ListDes>
          </ListItem>
          {/* 
          <ListItem>
            <ListTitle>
              <Text bold>
                <FormattedMessage
                  id="paymenMethodText"
                  defaultMessage="Payment Method"
                />
              </Text>
            </ListTitle>
            <ListDes>
              <Text>{orderDetails.orderPayType}</Text>
            </ListDes>
          </ListItem> */}

          <ListItem>
            <ListTitle>
              <Text bold>
                <FormattedMessage
                  id="products"
                  defaultMessage="Delivery Charge"
                />
              </Text>
            </ListTitle>
            <ListDes>
              <Text>{orderDetails.orderCart.deliveryCost}</Text>
            </ListDes>
          </ListItem>

          <ListItem>
            <ListTitle>
              <Text bold>
                <FormattedMessage id="totalText" defaultMessage="Total" />
              </Text>
            </ListTitle>
            <ListDes>
              <Text>{orderDetails.orderCart.totalQuotedPrice}</Text>
            </ListDes>
          </ListItem>
        </TotalAmount>
      </OrderReceivedContainer>
    </OrderReceivedWrapper>
  );
};

export default OrderReceived;
