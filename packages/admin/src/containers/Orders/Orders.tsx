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
import { useForm } from "react-hook-form";
import { Form } from "../DrawerItems/DrawerItems.style";
import { FormFields, FormLabel } from "components/FormFields/FormFields";
import Select from "components/Select/Select";
import Input from "components/Input/Input";
import Button from "components/Button/Button";
import { InLineLoader } from 'components/InlineLoader/InlineLoader';

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

  const orderStatusTypes = [
    { value: "FIN", label: "FIN" },
    { value: "CONF", label: "CONF" },
    { value: "REJ", label: "REJ" },
    { value: "EXP", label: "EXP" },
    { value: "CAN", label: "CAN" },
    { value: "PEN", label: "PEN" }
  ];

  const dispatch = useDrawerDispatch();

  const openDrawer = useCallback(
    (item) =>
      dispatch({
        type: 'OPEN_DRAWER',
        drawerComponent: 'ORDER_DETAIL_CARD',
        data: item,
      }),
    [dispatch]
  );

  const { data: { storeId } } = useQuery(Q_GET_STORE_ID);

  const { register, handleSubmit, setValue } = useForm();
  const [orderStatus, setOrderStatus] = useState([]);
  const [ordersFindInputDto, setOrdersFindInputDto] = useState({
    storeId: storeId,
    paginate: { page: 1, perPage: 10 }
  });

  const { data, loading, error, refetch } = useQuery(Q_GET_ORDERS, {
    variables: { ordersFindInputDto }
  });

  useSubscription(S_CHEF_ORDER_PUSH, {
    variables: {
      input: {
        storeId: storeId,
        type: 'SINGLE',
      },
    },
    onSubscriptionData: () => {
      refetch();
    },
  });

  const fetchNextPage = (page) => {
    setOrdersFindInputDto({
      ...ordersFindInputDto,
      paginate: { page, perPage: 10 }
    });
  };

  const onSubmit = (values) => {
    let formValues;
    Object.keys(values).forEach((value) => {
      if (values[value]) formValues = { ...formValues, [value]: values[value] };
    });

    if (orderStatus.length)
      formValues = { ...formValues, status: orderStatus[0].value };

    setOrdersFindInputDto({
      storeId: storeId,
      paginate: { page: 1, perPage: 10 },
      ...formValues,
    });
  };

  const clearFilters = () => {
    setValue("orderId", "");
    setOrderStatus([]);

    setOrdersFindInputDto({
      storeId: storeId,
      paginate: { page: 1, perPage: 10 }
    });
  };

  let hasNextPage = false,
    hasPrevPage = false,
    page;

  if (data) {
    const { gateGetOrders: { pagination } } = data;
    hasNextPage = pagination.hasNextPage;
    hasPrevPage = pagination.hasPrevPage;
    page = pagination.page;
  }

  return (
    <Grid fluid={true}>
      {error ? (
        <div>Error Fetching Data</div>
      ) : (
        <Row>
          <Col md={12}>
            <Header
              style={{
                marginBottom: 30,
                boxShadow: '0 0 5px rgba(0, 0 ,0, 0.05)',
              }}
            >
              <Col md={3} xs={12}>
                <Heading>Orders</Heading>
              </Col>
            </Header>

            <Row>
              <Col xs={12} md={12}>
                <Form
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ paddingBottom: 0, backgroundColor: "transparent" }}
                >
                  <Row>
                  <Col md={3}>
                      <FormFields>
                        <FormLabel>Order Id</FormLabel>
                        <Input
                          name="orderId"
                          inputRef={register}
                        />
                      </FormFields>
                    </Col>

                    <Col md={3}>
                      <FormFields>
                        <FormLabel>Order Status</FormLabel>
                        <Select
                          options={orderStatusTypes}
                          labelKey="label"
                          valueKey="value"
                          placeholder="Order Status"
                          value={orderStatus}
                          searchable={false}
                          onChange={({ value }) => setOrderStatus(value)}
                        />
                      </FormFields>
                    </Col>

                    <Col md={2} style={{alignSelf: "end"}}>
                      <Button
                        type="submit"
                        overrides={{
                          BaseButton: {
                            style: ({ $theme, $size, $shape }) => {
                              return {
                                width: "100%",
                                borderTopLeftRadius: "3px",
                                borderTopRightRadius: "3px",
                                borderBottomLeftRadius: "3px",
                                borderBottomRightRadius: "3px",
                                paddingTop: "12px",
                                paddingBottom: "12px",
                              };
                            },
                          },
                        }}
                      >
                        Search
                      </Button>
                    </Col>

                    <Col md={2} style={{alignSelf: "end"}}>
                      <Button
                        type="button"
                        onClick={clearFilters}
                        overrides={{
                          BaseButton: {
                            style: ({ $theme, $size, $shape }) => {
                              return {
                                width: "100%",
                                borderTopLeftRadius: "3px",
                                borderTopRightRadius: "3px",
                                borderBottomLeftRadius: "3px",
                                borderBottomRightRadius: "3px",
                                paddingTop: "12px",
                                paddingBottom: "12px",
                              };
                            },
                          },
                        }}
                      >
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>

            {loading ? (
              <InLineLoader />
            ) : (
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
            )}
          </Col>
        </Row>
      )}
    </Grid>
  );
}
