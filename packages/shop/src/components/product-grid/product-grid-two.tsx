import React, { useState, useEffect } from "react";
import { ProductCard } from "components/product-card/product-card-six";
import styled from "styled-components";
import css from "@styled-system/css";
import ErrorMessage from "components/error-message/error-message";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "graphql/query/products.query";
import { GET_PRODUCTS_OF_A_CATEGORY } from "graphql/query/productsofacategory.query";
import { useRouter } from "next/router";
import { Button } from "components/button/loadmore-button";
import { FormattedMessage } from "react-intl";
import { Box } from "components/box";
import NoResultFound from "components/no-result/no-result";
import Placeholder from "components/placeholder/placeholder";
import { LoaderItem, LoaderWrapper } from "./product-list/product-list.style";
import Loader from "components/loader/loader";
import { Paginate } from "components/pagination/pagination";
import { Q_SEARCH_PRODUCT_BASED_ON_STORE } from "graphql/query/searchProductInStore.query";
import { Q_SEARCH_PRODUCTS_BASED_ON_CATEGORY_FOR_USER } from "graphql/query/search-products-based-on-category-for-user.query";
import { useCart } from "contexts/cart/use-cart";
import { Q_GET_CART } from "graphql/query/get-cart.query";
import { refactorGetCartDataBeforeAddingToCart } from "utils/refactor-product-before-adding-to-cart";
import { getToken } from "utils/localStorage";
import { Q_GET_STORE_ID } from "graphql/query/loggedIn-queries.query";
import { useAppState } from "contexts/app/app.provider";

const Grid = styled.div(
  css({
    display: "grid",
    gridGap: "10px",
    gridTemplateColumns: "repeat(1, minmax(180px, 1fr))",

    "@media screen and (min-width: 480px)": {
      gridTemplateColumns: "repeat(2, minmax(180px, 1fr))",
    },

    "@media screen and (min-width: 740px)": {
      gridTemplateColumns: "repeat(3, minmax(180px, 1fr))",
    },

    "@media screen and (min-width: 991px)": {
      gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
    },

    "@media screen and (min-width: 1200px)": {
      gridTemplateColumns: "repeat(5, minmax(180px, 1fr))",
    },

    "@media screen and (min-width: 1400px)": {
      gridTemplateColumns: "repeat(6, minmax(180px, 1fr))",
    },

    "@media screen and (min-width: 1700px)": {
      gridTemplateColumns: "repeat(7, minmax(180px, 1fr))",
    },
  })
);

interface Props {
  type: string;
  loadMore?: boolean;
  fetchLimit?: number;
  style?: any;
  firstPageProducts?: any;
}

export const ProductGrid = ({
  style,
  fetchLimit = 30,
  loadMore = true,
}: Props) => {
  const router = useRouter();
  const workFlowPolicy = useAppState("workFlowPolicy") as any;
  const storeId = useAppState("activeStoreId");
  const [page, setPage] = useState(1);
  const {
    query: { category, search },
  } = router;

  useEffect(() => {
    setPage(1);
  }, [category, search]);

  const { data, error, loading } = useQuery(GET_PRODUCTS, {
    variables: {
      userStoreProductsFindInputDto: {
        storeId,
        isAvailable: true,
        paginate: {
          page: page,
          perPage: fetchLimit,
        },
      },
    },
    skip: category !== undefined || !!search,
  });

  const {
    data: categoryProductsData,
    error: categoryProductsError,
    loading: categoryProductLoading,
  } = useQuery(GET_PRODUCTS_OF_A_CATEGORY, {
    variables: {
      productFindInput: {
        storeId,
        categoryId: category,
        paginate: {
          page: page,
          perPage: fetchLimit,
        },
      },
    },
    skip: category === undefined || !!search,
  });

  const {
    data: searchedProductInCategory,
    loading: searchedProductInCategoryLoading,
    error: searchedProductInCategoryError,
  } = useQuery(Q_SEARCH_PRODUCTS_BASED_ON_CATEGORY_FOR_USER, {
    variables: {
      productSearchInput: {
        storeId,
        categoryId: category,
        productKey: search,
        paginate: {
          page,
          perPage: 30,
        },
      },
    },
    skip: category === "all_products" || !search,
  });

  const {
    data: searchedProduct,
    loading: searchedProductLoading,
    error: searchedProductError,
  } = useQuery(Q_SEARCH_PRODUCTS_BASED_ON_CATEGORY_FOR_USER, {
    variables: {
      productSearchInput: {
        storeId,
        productKey: search,
        paginate: {
          page,
          perPage: 30,
        },
      },
    },
    skip: category !== "all_products" || !search,
  });

  if (
    error ||
    categoryProductsError ||
    searchedProductInCategoryError ||
    searchedProductError
  )
    return (
      <ErrorMessage>
        <FormattedMessage
          id="error"
          defaultMessage={
            error.message ||
            categoryProductsError.message ||
            searchedProductInCategoryError.message ||
            searchedProductError.message
          }
        />
      </ErrorMessage>
    );
  if (
    loading ||
    categoryProductLoading ||
    searchedProductInCategoryLoading ||
    searchedProductLoading
  ) {
    return <Loader />;
  }

  if (
    data &&
    data.getStoreProductsForUser &&
    data.getStoreProductsForUser.products &&
    !data.getStoreProductsForUser.products.length
  ) {
    return (
      <NoResultFound
        forPagination={page !== 1 ? true : false}
        prevPagePagination={() => setPage((page) => (page >= 2 ? page - 1 : 1))}
      />
    );
  }

  if (
    categoryProductsData &&
    categoryProductsData.getProductsBasedOnCategoryForUser &&
    categoryProductsData.getProductsBasedOnCategoryForUser.products &&
    !categoryProductsData.getProductsBasedOnCategoryForUser.products.length
  ) {
    return (
      <NoResultFound
        forPagination={page !== 1 ? true : false}
        prevPagePagination={() => setPage((page) => (page >= 2 ? page - 1 : 1))}
      />
    );
  }

  if (
    searchedProductInCategory &&
    searchedProductInCategory.searchProductForUser &&
    searchedProductInCategory.searchProductForUser.products &&
    !searchedProductInCategory.searchProductForUser.products.length
  ) {
    return (
      <NoResultFound
        forPagination={page !== 1 ? true : false}
        prevPagePagination={() => setPage((page) => (page >= 2 ? page - 1 : 1))}
      />
    );
  }

  if (
    searchedProduct &&
    searchedProduct.searchProductForUser &&
    searchedProduct.searchProductForUser.products &&
    !searchedProduct.searchProductForUser.products.length
  ) {
    return (
      <NoResultFound
        forPagination={page !== 1 ? true : false}
        prevPagePagination={() => setPage((page) => (page >= 2 ? page - 1 : 1))}
      />
    );
  }

  const handleLoadMore = (newPage: number) => {
    setPage(newPage);
  };

  let fetchedProducts: any = [],
    fetchedProductsPagination: any = {};

  if (data && data.getStoreProductsForUser) {
    const { products, pagination } = data.getStoreProductsForUser;
    fetchedProducts = products;
    fetchedProductsPagination = pagination;
  }
  if (
    categoryProductsData &&
    categoryProductsData.getProductsBasedOnCategoryForUser &&
    categoryProductsData.getProductsBasedOnCategoryForUser.products
  ) {
    const {
      products: categoryProducts,
      pagination: categoryProductsPagination,
    } = categoryProductsData?.getProductsBasedOnCategoryForUser;
    fetchedProducts = categoryProducts;
    fetchedProductsPagination = categoryProductsPagination;
  }
  if (
    searchedProductInCategory &&
    searchedProductInCategory.searchProductForUser &&
    searchedProductInCategory.searchProductForUser.products
  ) {
    const {
      products: searchedProductsInCategory,
      pagination: searchedProductsPaginationInCategory,
    } = searchedProductInCategory.searchProductForUser;
    fetchedProducts = searchedProductsInCategory;
    fetchedProductsPagination = searchedProductsPaginationInCategory;
  }
  if (
    searchedProduct &&
    searchedProduct.searchProductForUser &&
    searchedProduct.searchProductForUser.products
  ) {
    const {
      products: searchedProducts,
      pagination: searchedProductsPagination,
    } = searchedProduct.searchProductForUser;
    fetchedProducts = searchedProducts;
    fetchedProductsPagination = searchedProductsPagination;
  }
  // if (category === "all_products" && !search) {
  //   const { products, pagination } = firstPageProducts.getStoreProductsForUser;
  //   fetchedProducts = products;
  //   fetchedProductsPagination = pagination;
  // } else if (category !== "all_products" && !search) {
  //   if (
  //     firstPageProducts &&
  //     firstPageProducts.getProductsBasedOnCategoryForUser
  //   ) {
  //     fetchedProducts =
  //       firstPageProducts.getProductsBasedOnCategoryForUser.products;
  //     fetchedProductsPagination =
  //       firstPageProducts.getProductsBasedOnCategoryForUser.pagination;
  //   }
  // } else if (category !== "all_products" && search) {
  //   const {
  //     products: searchedProductsInCategory,
  //     pagination: searchedProductsPaginationInCategory,
  //   } = searchedProductInCategory.searchProductForUser;
  //   fetchedProducts = searchedProductsInCategory;
  //   fetchedProductsPagination = searchedProductsPaginationInCategory;
  // } else {
  //   const {
  //     products: searchedProducts,
  //     pagination: searchedProductsPagination,
  //   } = searchedProduct.searchProductForUser;
  //   fetchedProducts = searchedProducts;
  //   fetchedProductsPagination = searchedProductsPagination;
  // }

  return (
    <section style={{ marginTop: "15px" }}>
      <h4 style={{ marginBottom: "20px", color: "#04aa6d", padding: "10px" }}>
        <FormattedMessage id="products" defaultMessage="Products" />
      </h4>
      <Grid style={style}>
        {fetchedProducts.map((product) => (
          <ProductCard
            data={product}
            key={product._id}
            currency={workFlowPolicy.currency}
          />
        ))}
      </Grid>

      <Paginate
        currentPage={page}
        hasNextPage={fetchedProductsPagination.hasNextPage}
        hasPrevPage={fetchedProductsPagination.hasPrevPage}
        fetchPage={handleLoadMore}
      />
    </section>
  );
};
