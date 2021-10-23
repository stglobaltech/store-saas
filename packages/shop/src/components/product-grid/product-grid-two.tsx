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
}

export const ProductGrid = ({
  style,
  type,
  fetchLimit = 20,
  loadMore = true,
}: Props) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const {
    query: { category,search },
  } = router;


  useEffect(() => {
    setPage(1);
  }, [category]);

  const { data, error, loading } = useQuery(GET_PRODUCTS, {
    variables: {
      userStoreProductsFindInputDto: {
        storeId: type,
        paginate: {
          page: page,
          perPage: fetchLimit,
        },
      },
    },
    skip: !!category,
  });

  const {
    data: categoryProductsData,
    error: categoryProductsError,
    loading: categoryProductLoading,
  } = useQuery(GET_PRODUCTS_OF_A_CATEGORY, {
    variables: {
      productFindInput: {
        storeId: type,
        categoryId: category,
        paginate: {
          page: page,
          perPage: fetchLimit,
        },
      },
    },
    skip: !category,
  });

  if (error || categoryProductsError) return <ErrorMessage message={error.message || categoryProductsError.message} />;
  if (loading || categoryProductLoading) {
    return <Loader />;
  }
  if (
    (!data ||
      !data.getStoreProductsForUser ||
      data.getStoreProductsForUser.products.length === 0) &&
    !category
  ) {
    return <NoResultFound forPagination={true} prevPagePagination={()=>setPage(page=>page-1)}/>;
  }

  if (
    (!categoryProductsData ||
      !categoryProductsData.getProductsBasedOnCategoryForUser ||
      !categoryProductsData.getProductsBasedOnCategoryForUser.products
        .length) &&
    !!category
  ) {
    return <NoResultFound forPagination={true} prevPagePagination={()=>setPage(page=>page-1)}/>;
  }

  const handleLoadMore = (newPage: number) => {
    setPage(newPage);
  };

  let fetchedProducts, fetchedProductsPagination;
  if (data && data.getStoreProductsForUser) {
    const { products, pagination } = data.getStoreProductsForUser;
    fetchedProducts = products;
    fetchedProductsPagination = pagination;
  } else {
    const {
      products: categoryProducts,
      pagination: categoryProductsPagination,
    } = categoryProductsData.getProductsBasedOnCategoryForUser;
    fetchedProducts = categoryProducts;
    fetchedProductsPagination = categoryProductsPagination;
  }

  return (
    <section>
      <Grid style={style}>
        {fetchedProducts.map((product) => (
          <ProductCard data={product} key={product._id} />
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
