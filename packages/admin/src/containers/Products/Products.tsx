import React, { useCallback, useState } from 'react';
import { styled, withStyle } from 'baseui';
import Button from 'components/Button/Button';
import { Grid, Row as Rows, Col as Column } from 'components/FlexBox/FlexBox';
import Input from 'components/Input/Input';
import Select from 'components/Select/Select';
import { useQuery } from '@apollo/client';
import { Header, Heading } from 'components/Wrapper.style';
import Fade from 'react-reveal/Fade';
import ProductCard from 'components/ProductCard/ProductCard';
import NoResult from 'components/NoResult/NoResult';
import { CURRENCY } from 'settings/constants';
import Placeholder from 'components/Placeholder/Placeholder';
import { useDrawerDispatch } from 'context/DrawerContext';
import {
  Q_GET_STORE_ID,
  Q_GET_CATEGORIES,
  Q_SEARCH_PRODUCTS,
  Q_STORE_PLAN_FOR_USER_WEB_ADMIN
} from 'services/GQL';
import { InLineLoader } from 'components/InlineLoader/InlineLoader';

export const ProductsRow = styled('div', ({ $theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  marginTop: '25px',
  backgroundColor: $theme.colors.backgroundF7,
  position: 'relative',
  zIndex: '1',

  '@media only screen and (max-width: 767px)': {
    marginLeft: '-7.5px',
    marginRight: '-7.5px',
    marginTop: '15px',
  },
}));

export const Col = withStyle(Column, () => ({
  '@media only screen and (max-width: 767px)': {
    marginBottom: '20px',

    ':last-child': {
      marginBottom: 0,
    },
  },
}));

const Row = withStyle(Rows, () => ({
  '@media only screen and (min-width: 768px) and (max-width: 991px)': {
    alignItems: 'center',
  },
}));

export const ProductCardWrapper = styled('div', () => ({
  height: '100%',
}));

export const LoaderWrapper = styled('div', () => ({
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexWrap: 'wrap',
}));

export const LoaderItem = styled('div', () => ({
  width: '25%',
  padding: '0 15px',
  marginBottom: '30px',
}));

export default function Products() {
  const dispatch = useDrawerDispatch();
  const openCreateDrawer = useCallback(
    (data) => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'PRODUCT_FORM', data }),
    [dispatch]
  );

  const { data: { storeId } } = useQuery(Q_GET_STORE_ID);

  const {data:workFlowPolicyData,loading:workFlowPolicyLoading,error:workFlowPolicyError}=useQuery(Q_STORE_PLAN_FOR_USER_WEB_ADMIN,{
    variables:{
      storeId
    },
    fetchPolicy:"network-only"
  });

  console.log('workFlowPolicyData',workFlowPolicyData);

  const [categories, setCategories] = useState([]);
  const [filterInput, setFilterInput] = useState({
    category: [],
    productKey: ""
  });

  const [productSearchInput, setProductSearchInput] = useState({
    storeId,
    categoryId: null,
    productKey: "",
    paginate: {
      page: 1,
      perPage: 12
    }
  });

  const { error: getCategoriesError } = useQuery(Q_GET_CATEGORIES, {
    variables: { storeId },
    onCompleted: ({ getCategories }) => {
      const { productCategories } = getCategories;
      if(productCategories.length) {
        const categoryOptions = productCategories.map((option) => {
          return { label: option.name.en, value: option._id };
        });

        setCategories(categoryOptions);
      }
    }
  });

  const { data, loading, error, refetch } = useQuery(Q_SEARCH_PRODUCTS, {
    variables: { productSearchInput }
  });

  const goToPage = (page) => {
    setProductSearchInput({
      ...productSearchInput,
      paginate: {
        page: page,
        perPage: 12
      }
    });
  };

  const handleSearch = (category, productKey) => {
    setProductSearchInput({
      ...productSearchInput,
      categoryId: category.length ? category[0].value : null,
      productKey,
      paginate: {
        page: 1,
        perPage: 12
      }
    });
  };

  if(workFlowPolicyLoading) return <InLineLoader />

  if (getCategoriesError || error || workFlowPolicyError)
    return <div>Error Fetching Data</div>;

  let hasNextPage = false,
    hasPrevPage = false,
    page;

  if (data) {
    const { searchProduct: { pagination } } = data;
    hasNextPage = pagination.hasNextPage;
    hasPrevPage = pagination.hasPrevPage;
    page = pagination.page;
  }

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Header style={{ marginBottom: 15 }}>
            <Col md={2} xs={12}>
              <Heading>Products</Heading>
            </Col>

            <Col md={10} xs={12}>
              <Row>
                <Col md={3} xs={12}>
                  <Select
                    options={categories}
                    labelKey="label"
                    valueKey="value"
                    placeholder="Category"
                    value={filterInput.category}
                    searchable={false}
                    onChange={({ value }) => {
                      setFilterInput({...filterInput, category: value});
                      handleSearch(value, filterInput.productKey);
                    }}
                  />
                </Col>

                <Col md={6} xs={12}>
                  <Input
                    placeholder="Search..."
                    value={filterInput.productKey}
                    onChange={(e) => {
                      setFilterInput({...filterInput, productKey: e.currentTarget.value});
                      handleSearch(filterInput.category, e.currentTarget.value);
                    }}
                    clearable
                  />
                </Col>

                <Col md={3} xs={12}>
                  <Button
                    onClick={() => openCreateDrawer(refetch)}
                    overrides={{
                      BaseButton: {
                        style: () => ({
                          width: '100%',
                          borderTopLeftRadius: '3px',
                          borderTopRightRadius: '3px',
                          borderBottomLeftRadius: '3px',
                          borderBottomRightRadius: '3px',
                          paddingTop: "12px",
                          paddingBottom: "12px"
                        }),
                      },
                    }}
                  >
                    Add Product
                  </Button>
                </Col>
              </Row>
            </Col>
          </Header>

          <Row>
            {data && data.searchProduct ? (
              data.searchProduct.products.length ? (
                data.searchProduct.products.map((item: any, index: number) => (
                  <Col
                    md={4}
                    lg={3}
                    sm={6}
                    xs={12}
                    key={index}
                    style={{ margin: '15px 0' }}
                  >
                    <Fade bottom duration={800} delay={index * 10}>
                      <ProductCard
                        title={item.productName.en}
                        image={item.picture}
                        currency={workFlowPolicyData?.getStorePlanForUserWebAdmin?.data?.plan[0]?.currency}
                        price={item.price.price}
                        data={{...item, queryToRefetch: refetch}}
                      />
                    </Fade>
                  </Col>
                ))
              ) : (
                <NoResult />
              )
            ) : (
              <LoaderWrapper>
                <LoaderItem>
                  <Placeholder />
                </LoaderItem>
                <LoaderItem>
                  <Placeholder />
                </LoaderItem>
                <LoaderItem>
                  <Placeholder />
                </LoaderItem>
                <LoaderItem>
                  <Placeholder />
                </LoaderItem>
              </LoaderWrapper>
            )}
          </Row>
          {data && data.searchProduct && data.searchProduct.pagination && (
            <Row>
              <Col
                md={12}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <Button
                  disabled={loading || !hasPrevPage}
                  onClick={() => goToPage(page - 1)}
                  overrides={{
                    BaseButton: {
                      style: () => ({
                        marginRight: '5px',
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px',
                        borderBottomLeftRadius: '3px',
                        borderBottomRightRadius: '3px',
                        paddingTop: "8px",
                        paddingBottom: "8px"
                      }),
                    },
                  }}
                >
                  Prev
                </Button>

                <Button
                  overrides={{
                    BaseButton: {
                      style: () => ({
                        marginRight: '5px',
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px',
                        borderBottomLeftRadius: '3px',
                        borderBottomRightRadius: '3px',
                        paddingTop: "8px",
                        paddingBottom: "8px"
                      }),
                    },
                  }}
                >
                  {page}
                </Button>

                <Button
                  disabled={loading || !hasNextPage}
                  onClick={() => goToPage(page + 1)}
                  overrides={{
                    BaseButton: {
                      style: () => ({
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px',
                        borderBottomLeftRadius: '3px',
                        borderBottomRightRadius: '3px',
                        paddingTop: "8px",
                        paddingBottom: "8px"
                      }),
                    },
                  }}
                >
                  Next
                </Button>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Grid>
  );
}
