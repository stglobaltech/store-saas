import React, { useState } from 'react';
import { withStyle } from 'baseui';
import { Grid, Row as Rows, Col as Column } from 'components/FlexBox/FlexBox';
import Input from 'components/Input/Input';
import { useQuery } from '@apollo/client';
import { Wrapper, Header, Heading } from 'components/Wrapper.style';
import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledBodyCell,
} from './Customers.style';
import NoResult from 'components/NoResult/NoResult';
import { Q_GET_CUSTOMERS_FOR_STORE, Q_GET_STORE_ID } from 'services/GQL';
import Pagination from 'components/Pagination/Pagination';
import { Form } from 'containers/DrawerItems/DrawerItems.style';
import { FormFields } from 'components/FormFields/FormFields';
import Button from 'components/Button/Button';
import { useForm } from 'react-hook-form';

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

export default function Customers() {
  const {
    data: { storeId },
  } = useQuery(Q_GET_STORE_ID);

  const [userFindInputDto, setUserFindInputDto] = useState({
    storeId,
    paginate: { page: 1, perPage: 10 },
  });

  const { data, error, fetchMore } = useQuery(Q_GET_CUSTOMERS_FOR_STORE, {
    variables: { userFindInputDto },
  });

  const { handleSubmit, register, setValue } = useForm();

  if (error) {
    return <div>Error! {error.message}</div>;
  }

  const clearFilters = () => {
    setValue('mobile', '');
    setUserFindInputDto({ storeId, paginate: { page: 1, perPage: 10 } });
  };

  const onSubmit = (values) => {
    console.log(values);

    setUserFindInputDto({
      storeId,
      paginate: { page: 1, perPage: 10 },
      ...values,
    });
  };

  let hasNextPage = false,
    hasPrevPage = false,
    page;

  if (data) {
    const {
      getCustomersForStore: { pagination },
    } = data;
    hasNextPage = pagination.hasNextPage;
    hasPrevPage = pagination.hasPrevPage;
    page = pagination.page;
  }

  const fetchNextPage = (page) => {
    setUserFindInputDto({ storeId, paginate: { page, perPage: 10 } });

    return fetchMore({
      variables: {
        userFindInputDto: {
          storeId,
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
              <Col md={3}>
                <Heading>Customers</Heading>
              </Col>
            </Header>
            <Row>
              <Col xs={12} md={12}>
                <Form
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ paddingBottom: 0, backgroundColor: 'transparent' }}
                >
                  <Row style={{ justifyContent: 'flex-end' }}>
                    <Col md={3} xs={12}>
                      <FormFields>
                        <Input
                          type='number'
                          name='mobile'
                          inputRef={register}
                          placeholder='Mobile number'
                        />{' '}
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
            <Wrapper style={{ boxShadow: '0 0 5px rgba(0, 0 , 0, 0.05)' }}>
              <TableWrapper>
                <StyledTable
                  style={{ borderBottom: '0px' }}
                  $gridTemplateColumns='minmax(max-content, auto) minmax(max-content, auto) minmax(max-content, auto) minmax(max-content, auto) minmax(max-content, auto)'
                >
                  <StyledHeadCell>ID</StyledHeadCell>
                  <StyledHeadCell>Name</StyledHeadCell>
                  <StyledHeadCell>Mobile</StyledHeadCell>
                  <StyledHeadCell>Email</StyledHeadCell>
                  <StyledHeadCell>Wallet Balance</StyledHeadCell>
                  {data ? (
                    data?.getCustomersForStore?.users?.length ? (
                      data.getCustomersForStore.users.map((item, index) => (
                        <React.Fragment key={index}>
                          <StyledBodyCell>{item._id}</StyledBodyCell>
                          <StyledBodyCell>{item.name}</StyledBodyCell>
                          <StyledBodyCell>{item.mobile}</StyledBodyCell>
                          <StyledBodyCell>{item.email}</StyledBodyCell>
                          <StyledBodyCell>{item.wallet.balance}</StyledBodyCell>
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
              {data?.getCustomersForStore?.pagination && (
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
