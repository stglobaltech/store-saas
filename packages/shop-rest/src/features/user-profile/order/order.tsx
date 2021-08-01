import React, { useState, useEffect } from 'react';
import { Scrollbar } from 'components/scrollbar/scrollbar';
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
} from './order.style';

import OrderDetails from './order-details/order-details';
import OrderCard from './order-card/order-card';
import OrderCardMobile from './order-card/order-card-mobile';
import useComponentSize from 'utils/useComponentSize';
import { FormattedMessage } from 'react-intl';
import useOrders from 'data/use-orders';
import ErrorMessage from 'components/error-message/error-message';

const progressData = ['Order Received', 'Order On The Way', 'Order Delivered'];

const orderTableColumns = [
  {
    title: <FormattedMessage id='cartItems' defaultMessage='Items' />,
    dataIndex: '',
    key: 'items',
    width: 250,
    ellipsis: true,
    render: (text, record) => {
      return (
        <ItemWrapper>
          <ImageWrapper>
            <img src={record.image} alt={record.title} />
          </ImageWrapper>

          <ItemDetails>
            <ItemName>{record.title}</ItemName>
            <ItemSize>{record.weight}</ItemSize>
            <ItemPrice>${record.price}</ItemPrice>
          </ItemDetails>
        </ItemWrapper>
      );
    },
  },
  {
    title: (
      <FormattedMessage id='intlTableColTitle2' defaultMessage='Quantity' />
    ),
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'center',
    width: 100,
  },
  {
    title: <FormattedMessage id='intlTableColTitle3' defaultMessage='Price' />,
    dataIndex: '',
    key: 'price',
    align: 'right',
    width: 100,
    render: (text, record) => {
      return <p>${record.total}</p>;
    },
  },
];

const OrdersContent: React.FC<{}> = () => {
  const [targetRef, size] = useComponentSize();
  const orderListHeight = size.height - 79;
  const { data, error } = useOrders({ userId: 1, limit: 7 });
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    if (data?.length) {
      setSelection(data[0]);
    }
  }, [data?.length]);

  if (error) return <ErrorMessage message={error.message} />;
  if (!data) return <div>loading...</div>;

  return (
    <OrderBox>
      <DesktopView>
        <OrderListWrapper style={{ height: size.height }}>
          <Title style={{ padding: '0 20px' }}>
            <FormattedMessage
              id='intlOrderPageTitle'
              defaultMessage='My Order'
            />
          </Title>

          <Scrollbar className='order-scrollbar'>
            <OrderList>
              {data.length !== 0 ? (
                data.map((current: any) => (
                  <OrderCard
                    key={current.id}
                    orderId={current.id}
                    className={current.id === selection?.id ? 'active' : ''}
                    status={progressData[current.status - 1]}
                    date={current.date}
                    deliveryTime={current.deliveryTime}
                    amount={current.amount}
                    onClick={() => setSelection(current)}
                  />
                ))
              ) : (
                <NoOrderFound>
                  <FormattedMessage
                    id='intlNoOrderFound'
                    defaultMessage='No order found'
                  />
                </NoOrderFound>
              )}
            </OrderList>
          </Scrollbar>
        </OrderListWrapper>

        <OrderDetailsWrapper ref={targetRef}>
          <Title style={{ padding: '0 20px' }}>
            <FormattedMessage
              id='orderDetailsText'
              defaultMessage='Order Details'
            />
          </Title>
          {selection && (
            <OrderDetails
              progressStatus={selection.status}
              progressData={progressData}
              address={selection.deliveryAddress}
              subtotal={selection.subtotal}
              discount={selection.discount}
              deliveryFee={selection.deliveryFee}
              grandTotal={selection.amount}
              tableData={selection.products}
              columns={orderTableColumns}
            />
          )}
        </OrderDetailsWrapper>
      </DesktopView>

      <MobileView>
        <OrderList>
          <OrderCardMobile
            orders={data}
            // className={order && order.id === active ? 'active' : ''}
            progressData={progressData}
            columns={orderTableColumns}
            onClick={setSelection}
          />
        </OrderList>
      </MobileView>
    </OrderBox>
  );
};

export default OrdersContent;
