import React, { useState } from 'react';
import { styled, withStyle, createThemedUseStyletron } from 'baseui';
import { Grid, Row as Rows, Col as Column } from 'components/FlexBox/FlexBox';
import Select from 'components/Select/Select';
import Input from 'components/Input/Input';
import { useQuery } from '@apollo/client';
import { Wrapper, Header, Heading } from 'components/Wrapper.style';
import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledCell,
} from './Orders.style';
import NoResult from 'components/NoResult/NoResult';
import { Q_GET_ORDERS, Q_GET_STORE_ID } from 'services/GQL';
import Pagination from 'components/Pagination/Pagination';

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

const statusSelectOptions = [
  { value: 'FIN', label: 'Finished' },
  { value: 'PEN', label: 'Pending' },
  { value: 'EXP', label: 'Expired' },
  { value: 'CONF', label: 'Confirmed' },
  { value: 'CAN', label: 'Cancelled' },
  { value: 'EXP', label: 'Expired' },
  { value: 'REJ', label: 'Rejected' },
];
const limitSelectOptions = [
  { value: 7, label: 'Last 7 orders' },
  { value: 15, label: 'Last 15 orders' },
  { value: 30, label: 'Last 30 orders' },
];

export default function Orders() {
  const {
    data: { storeId },
  } = useQuery(Q_GET_STORE_ID);

  const [orderState, setOrderState] = useState({
    ordersFindInputDto: {
      storeId: storeId,
      paginate: { page: 1, perPage: 10 },
    },
  });

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
  // eslint-disable-next-line
  const [status, setStatus] = useState([]);
  // eslint-disable-next-line
  const [limit, setLimit] = useState([]);
  // eslint-disable-next-line
  const [search, setSearch] = useState([]);

  const { data, loading, error } = useQuery(Q_GET_ORDERS, {
    variables: {
      ordersFindInputDto: orderState.ordersFindInputDto,
    },
  });

  if (error) {
    return <div>Error! {error.message}</div>;
  }

  // function handleLimit({ value }) {
  //   setLimit(value);
  //   if (value.length) {
  //     refetch({
  //       status: status.length ? status[0].value : null,
  //       limit: value[0].value,
  //     });
  //   } else {
  //     refetch({
  //       limit: null,
  //     });
  //   }
  // }

  // function handleSearch(event) {
  //   const { value } = event.currentTarget;
  //   setSearch(value);
  //   refetch({ searchText: value });
  // }

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
        <p>Loading</p>
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

              <Col md={9} xs={12}>
                <Row>
                  <Col md={3} xs={12}>
                    <Select
                      options={statusSelectOptions}
                      labelKey='label'
                      valueKey='value'
                      placeholder='Status'
                      value={status}
                      searchable={false}
                      // onChange={handleStatus}
                    />
                  </Col>

                  <Col md={3} xs={12}>
                    <Select
                      options={limitSelectOptions}
                      labelKey='label'
                      valueKey='value'
                      value={limit}
                      placeholder='Order Limits'
                      searchable={false}
                      // onChange={handleLimit}
                    />
                  </Col>

                  <Col md={6} xs={12}>
                    <Input
                      value={search}
                      placeholder='Ex: Search By Address'
                      // onChange={handleSearch}
                      clearable
                    />
                  </Col>
                </Row>
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
                          <StyledCell>{item.shortOrderId}</StyledCell>
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
