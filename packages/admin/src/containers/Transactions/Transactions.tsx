import React, { useState } from 'react';
import { styled, withStyle, createThemedUseStyletron } from 'baseui';
import { Grid, Row as Rows, Col as Column } from 'components/FlexBox/FlexBox';
import { useQuery } from '@apollo/client';
import { Wrapper, Header, Heading } from 'components/Wrapper.style';
import {
  TableWrapper,
  StyledTable,
  StyledHeadCellCenter,
  StyledCellCenter,
} from './Transactions.style';
import NoResult from 'components/NoResult/NoResult';
import { Q_GET_ALL_TRANSACTIONS, Q_GET_USER_ID } from 'services/GQL';
import Pagination from 'components/Pagination/Pagination';
import { useForm } from 'react-hook-form';
import { Form } from '../DrawerItems/DrawerItems.style';
import { FormFields } from 'components/FormFields/FormFields';
import Select from 'components/Select/Select';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import { InLineLoader } from '../../components/InlineLoader/InlineLoader';

type CustomThemeT = { red400: string; textNormal: string; colors: any };
const themedUseStyletron = createThemedUseStyletron<CustomThemeT>();

const Badge = styled('div', ({ $theme }) => ({
  ...$theme.typography.fontBold14,
  color: $theme.colors.textDark,
  display: 'inline-block',
  lineHeight: '1',
  textTransform: 'uppercase',
  padding: '4px',
  borderRadius: '4px',
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

export default function OrdersReport() {
  const [useCss, theme] = themedUseStyletron();

  const successBg = useCss({
    backgroundColor: theme.colors.primary,
  });

  const warningBg = useCss({
    backgroundColor: theme.colors.warning,
  });

  const operationTypes = [
    { value: 'CREDIT', label: 'CREDIT' },
    { value: 'DEBIT', label: 'DEBIT' },
  ];

  const purposeTypes = [
    'From card to wallet for order',
    'Card or wallet order from user to driver',
    'Cash order from the user to driver',
    'Dicount Cashback',
    'Refferal',
    'From card to wallet for Topup',
  ];

  const {
    data: { userId },
  } = useQuery(Q_GET_USER_ID);

  const { register, handleSubmit, setValue } = useForm();
  const [operationType, setOperationType] = useState([]);
  const [purposeType, setPurposeType] = useState([]);
  const [getTransactionsInputDto, setGetTransactionsInputDto] = useState({
    userId,
    paginate: { page: 1, perPage: 10 },
  });

  const { data, loading, error } = useQuery(Q_GET_ALL_TRANSACTIONS, {
    variables: { getTransactionsInputDto },
  });

  const fetchNextPage = (page) => {
    setGetTransactionsInputDto({
      ...getTransactionsInputDto,
      paginate: { page, perPage: 10 },
    });
  };

  const onSubmit = (values) => {
    let formValues;
    Object.keys(values).forEach((value) => {
      if (values[value]) formValues = { ...formValues, [value]: values[value] };
    });

    if (operationType.length)
      formValues = { ...formValues, operation: operationType[0].value };

    if (purposeType.length)
      formValues = { ...formValues, purpose: purposeType[0].value };

    setGetTransactionsInputDto({
      userId,
      paginate: { page: 1, perPage: 10 },
      ...formValues,
    });
  };

  const clearFilters = () => {
    setValue('orderId', '');
    setValue('startDate', '');
    setValue('endDate', '');
    setOperationType([]);
    setPurposeType([]);

    setGetTransactionsInputDto({
      userId,
      paginate: { page: 1, perPage: 10 },
    });
  };

  let hasNextPage = false,
    hasPrevPage = false,
    page;

  if (data) {
    const {
      getAllTransactions: { pagination },
    } = data;
    hasNextPage = pagination.hasNextPage;
    hasPrevPage = pagination.hasPrevPage;
    page = pagination.page;
  }

  return (
    <Grid fluid={true}>
      {error ? (
        <div>Error! {error.message}</div>
      ) : (
        <Row>
          <Col md={12}>
            <Header
              style={{
                marginBottom: 30,
                boxShadow: '0 0 5px rgba(0, 0 ,0, 0.05)',
              }}
            >
              <Col xs={12} md={10}>
                <Heading>Transactions</Heading>
              </Col>
            </Header>
            <Row>
              <Col xs={12} md={12}>
                <Form
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ paddingBottom: 0, backgroundColor: 'transparent' }}
                >
                  <Row>
                    <Col md={3}>
                      <FormFields>
                        <Select
                          options={operationTypes}
                          labelKey='label'
                          valueKey='value'
                          placeholder='Operation Type'
                          value={operationType}
                          searchable={false}
                          onChange={({ value }) => setOperationType(value)}
                        />
                      </FormFields>
                    </Col>
                    <Col md={3}>
                      <FormFields>
                        <Input
                          name='orderId'
                          placeholder='Order Id'
                          inputRef={register}
                        />
                      </FormFields>
                    </Col>
                    <Col md={3}>
                      <FormFields>
                        <Input
                          type='date'
                          name='startDate'
                          inputRef={register}
                        />
                      </FormFields>
                    </Col>
                    <Col md={3}>
                      <FormFields>
                        <Input type='date' name='endDate' inputRef={register} />
                      </FormFields>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <FormFields>
                        <Select
                          options={purposeTypes.map((purposeType) => {
                            return { label: purposeType, value: purposeType };
                          })}
                          labelKey='label'
                          valueKey='value'
                          placeholder='Purpose Type'
                          value={purposeType}
                          searchable={false}
                          onChange={({ value }) => setPurposeType(value)}
                        />
                      </FormFields>
                    </Col>
                    <Col md={1} style={{ alignSelf: 'end' }}>
                      <Button
                        type='submit'
                        overrides={{
                          BaseButton: {
                            style: ({ $theme, $size, $shape }) => {
                              return {
                                borderTopLeftRadius: '3px',
                                borderTopRightRadius: '3px',
                                borderBottomLeftRadius: '3px',
                                borderBottomRightRadius: '3px',
                                paddingTop: '12px',
                                paddingBottom: '12px',
                              };
                            },
                          },
                        }}
                      >
                        Search
                      </Button>
                    </Col>
                    <Col md={1} style={{ alignSelf: 'end' }}>
                      <Button
                        type='button'
                        onClick={clearFilters}
                        overrides={{
                          BaseButton: {
                            style: ({ $theme, $size, $shape }) => {
                              return {
                                borderTopLeftRadius: '3px',
                                borderTopRightRadius: '3px',
                                borderBottomLeftRadius: '3px',
                                borderBottomRightRadius: '3px',
                                paddingTop: '12px',
                                paddingBottom: '12px',
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
              <>
                <Wrapper style={{ boxShadow: '0 0 5px rgba(0, 0 , 0, 0.05)' }}>
                  <TableWrapper>
                    <StyledTable
                      style={{ borderBottom: '0px' }}
                      $gridTemplateColumns='minmax(max-content, auto) minmax(max-content, auto) minmax(max-content, auto) minmax(max-content, auto) minmax(max-content, auto) minmax(max-content, auto)'
                    >
                      <StyledHeadCellCenter>Order Id</StyledHeadCellCenter>
                      <StyledHeadCellCenter>Operation</StyledHeadCellCenter>
                      <StyledHeadCellCenter>Purpose</StyledHeadCellCenter>
                      <StyledHeadCellCenter>Amount</StyledHeadCellCenter>
                      <StyledHeadCellCenter>
                        Transaction Date
                      </StyledHeadCellCenter>
                      <StyledHeadCellCenter>
                        Previous Balance
                      </StyledHeadCellCenter>
                      {data ? (
                        data.getAllTransactions &&
                        data.getAllTransactions.transactions.length ? (
                          data.getAllTransactions.transactions.map(
                            (item, index) => (
                              <React.Fragment key={index}>
                                <StyledCellCenter>
                                  {item.orderId ? item.orderId : 'N / A'}
                                </StyledCellCenter>
                                <StyledCellCenter>
                                  <Badge
                                    className={
                                      item.operation === 'cr'
                                        ? successBg
                                        : warningBg
                                    }
                                  >
                                    {item.operation}
                                  </Badge>
                                </StyledCellCenter>
                                <StyledCellCenter>
                                  {item.purpose}
                                </StyledCellCenter>
                                <StyledCellCenter>
                                  {item.amount}
                                </StyledCellCenter>
                                <StyledCellCenter>
                                  {item.orderDate
                                    ? new Date(item.orderDate)
                                        .toString()
                                        .slice(0, 24)
                                    : new Date(item.updatedAt)
                                        .toString()
                                        .slice(0, 24)}
                                </StyledCellCenter>
                                <StyledCellCenter>
                                  {item.previousBalance}
                                </StyledCellCenter>
                              </React.Fragment>
                            )
                          )
                        ) : (
                          <NoResult
                            hideButton={false}
                            style={{
                              gridColumnStart: '1',
                              gridColumnEnd: 'one',
                            }}
                            msg={"No transactions witnessed so far"}
                          />
                        )
                      ) : null}
                    </StyledTable>
                  </TableWrapper>
                  {data &&
                    data.getAllTransactions &&
                    data.getAllTransactions.pagination && (
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
              </>
            )}
          </Col>
        </Row>
      )}
    </Grid>
  );
}
