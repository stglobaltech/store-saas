import React, { useCallback, useState } from 'react';
import { styled, withStyle, createThemedUseStyletron } from 'baseui';
import { Grid, Row as Rows, Col as Column } from 'components/FlexBox/FlexBox';
import { useQuery, useSubscription } from '@apollo/client';
import { Wrapper, Header, Heading } from 'components/Wrapper.style';
import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledCell,
} from './Orders.style';
import NoResult from 'components/NoResult/NoResult';
import { Q_GET_ORDERS, Q_GET_STORE_ID, S_CHEF_ORDER_PUSH } from 'services/GQL';
import Pagination from 'components/Pagination/Pagination';
import { useDrawerDispatch } from 'context/DrawerContext';

type CustomThemeT = { red400: string; textNormal: string; colors: any };
const themedUseStyletron = createThemedUseStyletron<CustomThemeT>();

const Status = styled('div', ({ $theme }) => ({
  ...$theme.typography.fontBold14,
  color: $theme.colors.textDark,
  display: 'flex',
  alignItems: 'center',
  lineHeight: '1',
  textTransform: 'capitalize',

  ':before': {
    content: '""',
    width: '10px',
    height: '10px',
    display: 'inline-block',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    borderBottomRightRadius: '10px',
    borderBottomLeftRadius: '10px',
    backgroundColor: $theme.borders.borderE6,
    marginRight: '10px',
  },
}));

const Col = withStyle(Column, () => ({
  '@media only screen and (max-width: 767px)': {
    marginBottom: '20px',

    ':last-child': {
      marginBottom: 0,
    },
  },
}));

const Row = withStyle(Rows, () => ({
  '@media only screen and (min-width: 768px)': {
    alignItems: 'center',
  },
}));

export default function Orders() {

  const dispatch = useDrawerDispatch();

  const {
    data: { storeId },
  } = useQuery(Q_GET_STORE_ID);

  const [orderState, setOrderState] = useState({
    ordersFindInputDto: {
      storeId: storeId,
      paginate: { page: 1, perPage: 10 },
    },
  });

  const openDrawer = useCallback(
    (item) =>
      dispatch({
        type: 'OPEN_DRAWER',
        drawerComponent: 'ORDER_DETAIL_CARD',
        data: item,
      }),
    [dispatch]
  );

  const [useCss, theme] = themedUseStyletron();

  const sent = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.primary,
    },
  });

  const failed = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.red400,
    },
  });

  const processing = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.textNormal,
    },
  });

  const paid = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.blue400,
    },
  });

  const { data, loading, error, refetch } = useQuery(Q_GET_ORDERS, {
    variables: {
      ordersFindInputDto: orderState.ordersFindInputDto,
    },
  });

  const { data: subData } = useSubscription(S_CHEF_ORDER_PUSH, {
    variables: {
      input: {
        storeId: storeId,
        type: 'single',
      },
    },
    onSubscriptionData: () => {
      console.log('bismillah');
    },
  });

  if (subData) {
    const { message, payload, title } = data.chefOrderSubscribe;
    console.log(payload.eventType, title.en, message.en, 'sub called');
    refetch();
  }

  const fetchNextPage = (page) => {
    setOrderState({
      ...orderState,
      ordersFindInputDto: {
        ...orderState.ordersFindInputDto,
        paginate: { page, perPage: 10 },
      },
    });
  };

  let loadingContent,
    errorContent,
    hasNextPage = false,
    hasPrevPage = false,
    page;

  if (loading)
    loadingContent = (
      <div>
        <h5>Loading...</h5>
      </div>
    );
  else if (error)
    errorContent = <div className='text-center'>Error Fetching Data</div>;
  else {
    const {
      gateGetOrders: { pagination },
    } = data;
    hasNextPage = pagination.hasNextPage;
    hasPrevPage = pagination.hasPrevPage;
    page = pagination.page;
  }

  return (
    <Grid fluid={true}>
      {error ? (
        errorContent
      ) : loading ? (
        loadingContent
      ) : (
        <Row>
          <Col md={12}>
            <Header
              style={{
                marginBottom: 30,
                boxShadow: '0 0 8px rgba(0, 0 ,0, 0.1)',
              }}
            >
              <Col md={3} xs={12}>
                <Heading>Orders</Heading>
              </Col>
            </Header>
            <Wrapper style={{ boxShadow: '0 0 5px rgba(0, 0 , 0, 0.05)' }}>
              <TableWrapper>
                <StyledTable
                  style={{ borderBottom: '0px' }}
                  $gridTemplateColumns='minmax(150px, auto) minmax(150px, auto) minmax(120px, auto) minmax(100px, auto) minmax(100px, auto) minmax(150px, auto)'
                >
                  <StyledHeadCell>ID</StyledHeadCell>
                  <StyledHeadCell>User Name</StyledHeadCell>
                  <StyledHeadCell>User Contact</StyledHeadCell>
                  <StyledHeadCell>Amount</StyledHeadCell>
                  <StyledHeadCell>Status</StyledHeadCell>
                  <StyledHeadCell>Time</StyledHeadCell>
                  {data ? (
                    data.gateGetOrders && data.gateGetOrders.orders.length ? (
                      data.gateGetOrders.orders.map((item, index) => (
                        <React.Fragment key={index}>
                          <StyledCell
                            onClick={() => openDrawer(item)}
                            style={{ cursor: 'pointer' }}
                          >
                            {item.shortOrderId}
                          </StyledCell>
                          <StyledCell>{item.user.name}</StyledCell>
                          <StyledCell>{item.user.mobile}</StyledCell>
                          <StyledCell>
                            {item.orderCart.totalPrice.toFixed()}
                          </StyledCell>
                          <StyledCell>
                            <Status
                              className={
                                item.status === 'FIN'
                                  ? sent
                                  : item.status === 'CONF'
                                  ? paid
                                  : item.status === 'PEN'
                                  ? processing
                                  : failed
                              }
                            >
                              {item.status}
                            </Status>
                          </StyledCell>
                          <StyledCell>
                            {new Date(item.createdAt).toLocaleString()}
                          </StyledCell>
                        </React.Fragment>
                      ))
                    ) : (
                      <NoResult
                        hideButton={false}
                        style={{
                          gridColumnStart: '1',
                          gridColumnEnd: 'one',
                        }}
                      />
                    )
                  ) : null}
                </StyledTable>
              </TableWrapper>
              {data && data.gateGetOrders && data.gateGetOrders.pagination && (
                <Row>
                  <Col
                    md={12}
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Pagination
                      fetchMore={fetchNextPage}
                      hasPrevPage={hasPrevPage}
                      hasNextPage={hasNextPage}
                      currentPage={page}
                    />
                  </Col>
                </Row>
              )}
            </Wrapper>
          </Col>
        </Row>
      )}
    </Grid>
  );
}
