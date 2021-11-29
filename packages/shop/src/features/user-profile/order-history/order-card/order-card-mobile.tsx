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

import { CURRENCY } from "utils/constant";

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
  progressData?: any;
  progressStatus?: any;
  address?: string;
  subtotal?: number;
  discount?: number;
  deliveryFee?: number;
  grandTotal?: number;
  orders?: any;
};

const components = {
  table: OrderTable,
};

const OrderCard: React.FC<MobileOrderCardProps> = ({
  onClick,
  className,
  columns,
  progressData,
  orders,
}) => {
  //   const displayDetail = className === 'active' ? '100%' : '0';
  const addAllClasses: string[] = ["accordion"];

  if (className) {
    addAllClasses.push(className);
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
                    Order Date: <span>{new Date(order.createdAt).toLocaleString()}</span>
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
                  <Address>{order.orderCart.address.name}-{order.orderCart.address.buildingNo}-{order.orderCart.address.address}</Address>
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
                <Progress data={progressData} status={order.status} />
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
