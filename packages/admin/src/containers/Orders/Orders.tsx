import React, { useState } from 'react';
import { styled, withStyle, createThemedUseStyletron } from 'baseui';
import dayjs from 'dayjs';
import { Grid, Row as Rows, Col as Column } from 'components/FlexBox/FlexBox';
import Select from 'components/Select/Select';
import Input from 'components/Input/Input';
import { useQuery, gql } from '@apollo/client';
import {
  Wrapper,
  Header,
  Heading,
} from 'components/Wrapper.style';
import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledCell,
} from './Orders.style';
import NoResult from 'components/NoResult/NoResult';
import { Q_GET_ORDERS, Q_GET_STORE_ID } from 'services/GQL';
import { Button } from 'baseui/button';

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
  { value: 'delivered', label: 'Delivered' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'failed', label: 'Failed' },
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

  const [status, setStatus] = useState([]);
  const [limit, setLimit] = useState([]);
  const [search, setSearch] = useState([]);

  const { data, error, refetch, fetchMore } = useQuery(Q_GET_ORDERS, {
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

  // function onAllCheck(event) {
  //   if (event.target.checked) {
  //     const idx = data && data.orders.map((order) => order.id);
  //     setCheckedId(idx);
  //   } else {
  //     setCheckedId([]);
  //   }
  //   setChecked(event.target.checked);
  // }

  // function handleCheckbox(event) {
  //   const { name } = event.currentTarget;
  //   if (!checkedId.includes(name)) {
  //     setCheckedId((prevState) => [...prevState, name]);
  //   } else {
  //     setCheckedId((prevState) => prevState.filter((id) => id !== name));
  //   }
  // }

  const fetchNextPage = (page) => {
    setOrderState({
      ...orderState,
      ordersFindInputDto: {
        ...orderState.ordersFindInputDto,
        paginate: { page, perPage: 10 },
      },
    });
    return fetchMore({
      variables: {
        ordersFindInputDto: {
          ...orderState.ordersFindInputDto,
          paginate: { page, perPage: 10 },
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return fetchMoreResult;
      },
    });
  };

  return (
    <Grid fluid={true}>
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
              <StyledTable $gridTemplateColumns='minmax(150px, auto) minmax(150px, auto) minmax(120px, auto) minmax(100px, auto) minmax(100px, auto) minmax(150px, auto)'>
                {/* <StyledHeadCell>
                  <Checkbox
                    type='checkbox'
                    value='checkAll'
                    checked={checked}
                    onChange={onAllCheck}
                    overrides={{
                      Checkmark: {
                        style: {
                          borderTopWidth: '2px',
                          borderRightWidth: '2px',
                          borderBottomWidth: '2px',
                          borderLeftWidth: '2px',
                          borderTopLeftRadius: '4px',
                          borderTopRightRadius: '4px',
                          borderBottomRightRadius: '4px',
                          borderBottomLeftRadius: '4px',
                        },
                      },
                    }}
                  />
                </StyledHeadCell> */}
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
                        {/* <StyledCell>
                            <Checkbox
                              name={row[1]}
                              checked={checkedId.includes(row[1])}
                              onChange={handleCheckbox}
                              overrides={{
                                Checkmark: {
                                  style: {
                                    borderTopWidth: '2px',
                                    borderRightWidth: '2px',
                                    borderBottomWidth: '2px',
                                    borderLeftWidth: '2px',
                                    borderTopLeftRadius: '4px',
                                    borderTopRightRadius: '4px',
                                    borderBottomRightRadius: '4px',
                                    borderBottomLeftRadius: '4px',
                                  },
                                },
                              }}
                            />
                          </StyledCell> */}
                        <StyledCell>{item.shortOrderId}</StyledCell>
                        <StyledCell>{item.user.name}</StyledCell>
                        <StyledCell>{item.user.mobile}</StyledCell>
                        <StyledCell>{item.orderCart.totalPrice.toFixed()}</StyledCell>
                        <StyledCell>{item.status}</StyledCell>
                        <StyledCell>
                          {new Date(item.createdAt).toLocaleString()}
                        </StyledCell>

                        {/* <StyledCell>
                            {dayjs(row[3]).format('DD MMM YYYY')}
                          </StyledCell>
                          <StyledCell>{row[4]}</StyledCell>
                          <StyledCell>${row[5]}</StyledCell>
                          <StyledCell>{row[6]}</StyledCell>
                          <StyledCell>{row[7]}</StyledCell>
                          <StyledCell style={{ justifyContent: 'center' }}>
                            <Status
                              className={
                                row[8].toLowerCase() === 'delivered'
                                  ? sent
                                  : row[8].toLowerCase() === 'pending'
                                  ? paid
                                  : row[8].toLowerCase() === 'processing'
                                  ? processing
                                  : row[8].toLowerCase() === 'failed'
                                  ? failed
                                  : ''
                              }
                            >
                              {row[8]}
                            </Status>
                          </StyledCell> */}
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
                  <Button
                    disabled={!data.gateGetOrders.pagination.hasPrevPage}
                    onClick={() =>
                      fetchNextPage(
                        orderState.ordersFindInputDto.paginate.page - 1
                      )
                    }
                  >
                    Prev
                  </Button>
                  <Button>{data.gateGetOrders.pagination.page}</Button>
                  <Button
                    disabled={!data.gateGetOrders.pagination.hasNextPage}
                    onClick={() =>
                      fetchNextPage(
                        orderState.ordersFindInputDto.paginate.page + 1
                      )
                    }
                  >
                    Next
                  </Button>
                </Col>
              </Row>
            )}
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  );
}
