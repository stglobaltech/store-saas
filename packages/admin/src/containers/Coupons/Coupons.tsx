import React, { useCallback, useState } from 'react';
import { withStyle } from 'baseui';
import { Grid, Row as Rows, Col as Column } from 'components/FlexBox/FlexBox';
import { useDrawerDispatch } from 'context/DrawerContext';

import Select from 'components/Select/Select';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';

import { Plus } from 'assets/icons/PlusMinus';
import { useQuery } from '@apollo/client';
import { Wrapper, Header, Heading } from 'components/Wrapper.style';

import { Q_GET_STORE_ID, Q_GET_DISCOUNTS } from 'services/GQL';

import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledBodyCell
} from './Coupon.style';
import NoResult from 'components/NoResult/NoResult';
import { PencilIcon } from 'assets/icons/PencilIcon';
import { CloseIcon } from 'assets/icons/CloseIcon';
import Pagination from 'components/Pagination/Pagination';
import { InLineLoader } from '../../components/InlineLoader/InlineLoader';

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

export default function Coupons() {
  const dispatch = useDrawerDispatch();

  const openDrawer = useCallback(
    (data) => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'COUPON_FORM', data }),
    [dispatch]
  );

  const openEditDrawer = useCallback(
    (data) => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'EDIT_COUPON_FORM', data }),
    [dispatch]
  );

  const openDeleteDrawer = useCallback(
    (data) => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'DELETE_COUPON_FORM', data }),
    [dispatch]
  );

  const { data: { storeId } } = useQuery(Q_GET_STORE_ID);

  let hasPrevPage = false, hasNextPage = false, page;
  const [getDiscountsInputDto, setGetDiscountsInputDto] = useState({
    storeId,
    paginate: {
      page: 1,
      perPage: 10
    }
  });

  const { loading, data, error, refetch } = useQuery(Q_GET_DISCOUNTS, {
    variables: { getDiscountsInputDto }
  });

  const fetchMore = (page) => {
    setGetDiscountsInputDto({
      ...getDiscountsInputDto,
      paginate: {
        page,
        perPage: 10
      }
    });
  };

  if(loading)
    return <InLineLoader />;
  else if(error)
    return <div>Error! {error.message}</div>;
  else {
    const { getDiscounts: { pagination } } = data;
    hasNextPage = pagination.hasNextPage;
    hasPrevPage = pagination.hasPrevPage;
    page = pagination.page;
  }

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Header
            style={{
              marginBottom: 30,
              boxShadow: '0 0 5px rgba(0, 0 ,0, 0.05)',
            }}
          >
            <Col md={2}>
              <Heading>Coupons</Heading>
            </Col>

            <Col md={10}>
              <Row>
                <Col md={3}>
                  <Select
                    options={[]}
                    labelKey="label"
                    valueKey="value"
                    placeholder="Status"
                    value={[]}
                    searchable={false}
                  />
                </Col>

                <Col md={5}>
                  <Input
                    placeholder="Ex: Search By Name"
                    clearable
                  />
                </Col>

                <Col md={4}>
                  <Button
                    type="button"
                    onClick={() => openDrawer(refetch)}
                    startEnhancer={() => <Plus />}
                    overrides={{
                      BaseButton: {
                        style: ({ $theme, $size, $shape }) => {
                          return {
                            width: '100%',
                            borderTopLeftRadius: '3px',
                            borderTopRightRadius: '3px',
                            borderBottomLeftRadius: '3px',
                            borderBottomRightRadius: '3px',
                          };
                        },
                      },
                    }}
                  >
                    Create
                  </Button>
                </Col>
              </Row>
            </Col>
          </Header>

          <Wrapper style={{ boxShadow: '0 0 5px rgba(0, 0 , 0, 0.05)' }}>
            <TableWrapper style={{ height: 'auto' }}>
              <StyledTable
                style={{ borderBottom: '0px' }}
                $gridTemplateColumns="minmax(150px, auto) minmax(150px, auto) minmax(120px, 120px) minmax(120px, 120px) minmax(150px, max-content) minmax(150px, max-content) minmax(120px, 120px)"
              >
                <StyledHeadCell>Name</StyledHeadCell>
                <StyledHeadCell>Category</StyledHeadCell>
                <StyledHeadCell>Starts On</StyledHeadCell>
                <StyledHeadCell>Ends On</StyledHeadCell>
                <StyledHeadCell>Discount For</StyledHeadCell>
                <StyledHeadCell>Discount Type</StyledHeadCell>
                <StyledHeadCell>Action</StyledHeadCell>

                {data ? (
                  data.getDiscounts && data.getDiscounts.discounts.length ? (
                    data.getDiscounts.discounts
                      .map((item, index) => {
                        return (
                          <React.Fragment key={index}>
                            <StyledBodyCell>{`${item.name} / ${item.arName}`}</StyledBodyCell>
                            <StyledBodyCell>{item.category}</StyledBodyCell>
                            <StyledBodyCell>{item.startsOn}</StyledBodyCell>
                            <StyledBodyCell>{item.endsOn}</StyledBodyCell>
                            <StyledBodyCell>{item.discountFor}</StyledBodyCell>
                            <StyledBodyCell>{item.discountType}</StyledBodyCell>
                            <StyledBodyCell>
                              <PencilIcon
                                className='icon-lg pointer'
                                onClick={() => openEditDrawer({item, refetch})}
                              />
                              <CloseIcon
                                className='icon-lg icon-danger pointer'
                                onClick={() => openDeleteDrawer({discountID: item._id, refetch})}
                              />
                            </StyledBodyCell>
                          </React.Fragment>
                        );
                      })
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
            {data && data.getDiscounts && data.getDiscounts.pagination && (
              <Row style={{marginTop: '8px'}}>
                <Col
                  md={12}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Pagination
                    fetchMore={fetchMore}
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
    </Grid>
  );
}
