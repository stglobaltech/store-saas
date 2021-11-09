import React, { useCallback, useState, useEffect } from 'react';
import { styled, withStyle } from 'baseui';
import Button from 'components/Button/Button';
import { Grid, Row as Rows, Col as Column } from 'components/FlexBox/FlexBox';
import Input from 'components/Input/Input';
import Select from 'components/Select/Select';
import { useQuery, useLazyQuery } from '@apollo/client';
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
  Q_GET_PRODUCTS_BASED_ON_STORE,
  Q_GET_PRODUCTS_BASED_ON_CATEGORY
} from 'services/GQL';

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
    (data) => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'PRODUCT_FORM', data: data }),
    [dispatch]
  );

  const { data: { storeId } } = useQuery(Q_GET_STORE_ID);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState({
    products: [],
    pagination: {
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
      page: 1,
    }
  });

  const [storeProductFindInputDto, setStoreProductFindInputDto] = useState({
    storeId,
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

  const { data: storeBasedData, loading: storeBasedLoading, error: storeBasedError, refetch: storeBasedRefetch } = useQuery(Q_GET_PRODUCTS_BASED_ON_STORE, {
    variables: { storeProductFindInputDto }
  });

  const [getCategoryBasedProducts, {
    data: categoryBasedData, loading: categoryBasedLoading, error: categoryBasedError, refetch: categoryBasedRefetch
  }] = useLazyQuery(Q_GET_PRODUCTS_BASED_ON_CATEGORY);

  useEffect(() => {
    if(category.length && categoryBasedData) {
      const { getProductsBasedOnCategory } = categoryBasedData;
      setProducts(getProductsBasedOnCategory);
    } else if(storeBasedData) {
      const { getProductsBasedOnStore } = storeBasedData;
      setProducts(getProductsBasedOnStore);
    }
    // eslint-disable-next-line
  }, [storeBasedData, categoryBasedData]);

  const goToPage = (page) => {
    if(category.length) {
      getCategoryBasedProducts({
        variables: {
          productFindInput: {
            categoryId: category[0].value,
            storeId,
            paginate: {
              page: page,
              perPage: 12
            }
          }
        }
      })
    } else {
      setStoreProductFindInputDto({
        ...storeProductFindInputDto,
        paginate: {
          page: page,
          perPage: 12
        }
      });
    }
  };

  const handleCategory = ({ value }) => {
    setCategory(value);
    getCategoryBasedProducts({
      variables: {
        productFindInput: {
          categoryId: value[0].value,
          storeId,
          paginate: {
            page: 1,
            perPage: 12
          }
        }
      }
    })
  };

  const handleSearch = (e) => {
    const value = e.currentTarget.value;
    setSearch(value);
  };

  if (getCategoriesError || storeBasedError || categoryBasedError) {
    return (
      <div>
        Error! {
          getCategoriesError.message ? getCategoriesError.message : (
          storeBasedError.message ? storeBasedError.message : categoryBasedError.message
        )}
      </div>
    )
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
                    value={category}
                    searchable={false}
                    onChange={handleCategory}
                  />
                </Col>

                <Col md={6} xs={12}>
                  <Input
                    value={search}
                    placeholder="Ex: Search By Name"
                    onChange={handleSearch}
                    clearable
                  />
                </Col>

                <Col md={3} xs={12}>
                  <Button
                    onClick={() => openCreateDrawer(category.length ? categoryBasedRefetch : storeBasedRefetch)}
                    overrides={{
                      BaseButton: {
                        style: () => ({
                          width: '100%',
                          borderTopLeftRadius: '3px',
                          borderTopRightRadius: '3px',
                          borderBottomLeftRadius: '3px',
                          borderBottomRightRadius: '3px',
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
            {products.products.length ? (
              products.products.length !== 0 ? (
                products.products.map((item: any, index: number) => (
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
                        currency={CURRENCY}
                        price={item.price.price}
                        data={{...item,
                          queryToRefetch: category.length ? categoryBasedRefetch : storeBasedRefetch
                        }}
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
          {products.products.length && (
            <Row>
              <Col
                md={12}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <Button
                  disabled={storeBasedLoading || categoryBasedLoading || !products.pagination.hasPrevPage}
                  onClick={() => goToPage(products.pagination.prevPage)}
                  overrides={{
                    BaseButton: {
                      style: () => ({
                        marginRight: '5px',
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px',
                        borderBottomLeftRadius: '3px',
                        borderBottomRightRadius: '3px',
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
                      }),
                    },
                  }}
                >
                  {products.pagination.page}
                </Button>

                <Button
                  disabled={storeBasedLoading || categoryBasedLoading || !products.pagination.hasNextPage}
                  onClick={() => goToPage(products.pagination.nextPage)}
                  overrides={{
                    BaseButton: {
                      style: () => ({
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px',
                        borderBottomLeftRadius: '3px',
                        borderBottomRightRadius: '3px',
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
