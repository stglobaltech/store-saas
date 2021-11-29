import { GetStaticProps, GetStaticPaths } from "next";
import styled from "styled-components";
import css from "@styled-system/css";
import { Modal } from "@redq/reuse-modal";
import { MobileBanner } from "components/banner/mobile-banner";
import { Banner } from "components/banner/banner";
import { sitePages } from "site-settings/site-pages";
import { initializeApollo } from "utils/apollo";
import { GET_CATEGORIES } from "graphql/query/category.query";
import { Box } from "components/box";
import { HorizontalCategoryCardMenu } from "layouts/horizontal-category-menu/horizontal-category-card-menu";
import { ProductGrid } from "components/product-grid/product-grid-two";
import CartPopUp from "features/carts/cart-popup";
import { GET_PRODUCTS_OF_A_CATEGORY } from "graphql/query/productsofacategory.query";
import { GET_PRODUCTS } from "graphql/query/products.query";
import { Q_GET_CART } from "graphql/query/get-cart.query";
import { AuthContext } from "contexts/auth/auth.context";
import React from "react";
import { isTokenValidOrUndefined } from "utils/tokenValidation";
import { useCart } from "contexts/cart/use-cart";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";
import { removeToken } from "utils/localStorage";
import { Q_WORK_FLOW_POLICY } from "graphql/query/work-flow-policy-query";
import ErrorMessage from "components/error-message/error-message";
import {
  CART_DOES_NOT_EXIST,
  ERROR_FETCHING_CART,
  GENERAL_ERROR_MSG,
} from "utils/constant";
import { refactorGetCartDataBeforeAddingToCart } from "utils/refactor-product-before-adding-to-cart";
import { Q_GET_STORE_ID } from "graphql/query/loggedIn-queries.query";
import { useEffect } from "react";
import { useState } from "react";
import { useAppDispatch } from "contexts/app/app.provider";
import { FormattedMessage } from "react-intl";

const PAGE_TYPE = "categories";

export const Main = styled.div<any>(
  css({
    backgroundColor: "gray.200",
    position: "relative",
  })
);

const CustomSpacing = styled.div<any>(
  css({
    marginTop: "75px",
  })
);

export default function Categories({
  workFlowPolicyData,
  productCategories,
  products,
  storeId,
  deviceType,
}) {
  const page = sitePages[PAGE_TYPE];
  const client = useApolloClient();
  const router = useRouter();

  const { authDispatch, authState } = React.useContext<any>(AuthContext);
  const appDispatch = useAppDispatch();
  const { clearCart, items, addItem, isInCart } = useCart();
  const [getCartState, setGetCartState] = useState({
    loading: false,
    error: "",
  });

  const runGetCartQuery = async () => {
    setGetCartState({ ...getCartState, loading: true, error: "" });
    try {
      const { data: getCartData, error: getCartError } = await client.query({
        query: Q_GET_CART,
        variables: {
          entityId: storeId,
        },
      });
      if (getCartError)
        setGetCartState({
          ...getCartState,
          loading: false,
          error: ERROR_FETCHING_CART,
        });
      if (getCartData && getCartData.getCart && getCartData.getCart.products) {
        getCartData.getCart.products.forEach((product) => {
          if (!isInCart(product.productId)) {
            addItem(
              refactorGetCartDataBeforeAddingToCart(product),
              product.quantity
            );
          }
        });
      }
    } catch (error) {
      if (error.message === CART_DOES_NOT_EXIST)
        setGetCartState({ ...getCartState, loading: false, error: "" });
      else
        setGetCartState({
          ...getCartState,
          loading: false,
          error: error.message || GENERAL_ERROR_MSG,
        });
    }
  };

  useEffect(() => {
    if (
      workFlowPolicyData &&
      workFlowPolicyData.getWorkFlowpolicyPlanOfStoreForUserWeb &&
      workFlowPolicyData.getWorkFlowpolicyPlanOfStoreForUserWeb.data &&
      workFlowPolicyData.getWorkFlowpolicyPlanOfStoreForUserWeb.data.plan &&
      workFlowPolicyData.getWorkFlowpolicyPlanOfStoreForUserWeb.data.plan.length
    ) {
      appDispatch({
        type: "WORK_FLOW_POLICY",
        payload:
          workFlowPolicyData.getWorkFlowpolicyPlanOfStoreForUserWeb.data
            .plan[0],
      });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted && authState.isAuthenticated) {
      runGetCartQuery();
    }
    return () => {
      isMounted = false;
    };
  }, [authState.isAuthenticated]);

  if (
    !workFlowPolicyData ||
    !workFlowPolicyData.getWorkFlowpolicyPlanOfStoreForUserWeb ||
    !workFlowPolicyData.getWorkFlowpolicyPlanOfStoreForUserWeb.data ||
    !workFlowPolicyData.getWorkFlowpolicyPlanOfStoreForUserWeb.data.plan ||
    !workFlowPolicyData.getWorkFlowpolicyPlanOfStoreForUserWeb.data.plan.length
  ) {
    return (
      <ErrorMessage>
        <FormattedMessage id="error" defaultMessage={GENERAL_ERROR_MSG} />
      </ErrorMessage>
    );
  }

  if (!isTokenValidOrUndefined()) {
    removeToken();
    clearCart();
    authDispatch({ type: "SIGN_OUT" });
    router.replace("/");
  }

  return (
    <Modal>
      <MobileBanner intlTitleId={page.banner_title_id} type={PAGE_TYPE} />
      <Banner
        intlTitleId={page?.banner_title_id}
        intlDescriptionId={page?.banner_description_id}
        imageUrl={page?.banner_image_url}
        style={{ maxHeight: 100 }}
      />
      <Main>
        <HorizontalCategoryCardMenu
          type={PAGE_TYPE}
          productCategories={productCategories}
        />
        <CustomSpacing />
        <Box padding={["0 15px 100px ", "0 15px 30px ", "0 30px 30px"]}>
          <ProductGrid type={PAGE_TYPE} firstPageProducts={products} />
        </Box>
        <CartPopUp deviceType={deviceType} />
      </Main>
    </Modal>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const storeId = process.env.NEXT_PUBLIC_STG_CLIENT_ID;
  const apolloClient = initializeApollo();

  const {
    data: {
      getCategoriesForUser: { productCategories },
    },
    networkStatus,
  } = await apolloClient.query({
    query: GET_CATEGORIES,
    variables: {
      storeId,
    },
  });

  const { data: workFlowPolicyData } = await apolloClient.query({
    query: Q_WORK_FLOW_POLICY,
    variables: {
      storeId,
    },
  });

  let query, variables;
  if (params.category === "all_products") {
    query = GET_PRODUCTS;
    variables = {
      userStoreProductsFindInputDto: {
        storeId,
        isAvailable: true,
        paginate: {
          page: 1,
          perPage: 30,
        },
      },
    };
  } else {
    query = GET_PRODUCTS_OF_A_CATEGORY;
    variables = {
      productFindInput: {
        categoryId: params.category,
        storeId,
        paginate: {
          page: 1,
          perPage: 30,
        },
      },
    };
  }
  const { data, error } = await apolloClient.query({
    query,
    variables,
  });

  return {
    props: {
      storeId,
      productCategories,
      products: data,
      workFlowPolicyData: workFlowPolicyData,
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo();
  const paths = [];
  const storeId = process.env.NEXT_PUBLIC_STG_CLIENT_ID;
  const {
    data: {
      getCategoriesForUser: { productCategories },
    },
    networkStatus,
  } = await apolloClient.query({
    query: GET_CATEGORIES,
    variables: {
      storeId,
    },
  });
  productCategories.forEach((category) =>
    paths.push({ params: { category: category._id } })
  );
  paths.push({ params: { category: "all_products" } });
  return {
    paths,
    fallback: true,
  };
};
