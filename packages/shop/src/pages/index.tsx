import styled from "styled-components";
import css from "@styled-system/css";
import { Modal } from "@redq/reuse-modal";
import { MobileBanner } from "components/banner/mobile-banner";
import { Banner } from "components/banner/banner";
import { sitePages } from "site-settings/site-pages";
import { Box } from "components/box";
import { HorizontalCategoryCardMenu } from "layouts/horizontal-category-menu/horizontal-category-card-menu";
import { ProductGrid } from "components/product-grid/product-grid-two";
import CartPopUp from "features/carts/cart-popup";
import { Q_GET_CART } from "graphql/query/get-cart.query";
import { AuthContext } from "contexts/auth/auth.context";
import { isTokenValidOrUndefined } from "utils/tokenValidation";
import { useCart } from "contexts/cart/use-cart";
import { useRouter } from "next/router";
import { useApolloClient, useQuery } from "@apollo/client";
import { removeToken } from "utils/localStorage";
import { Q_WORK_FLOW_POLICY_BASED_ON_DOMAIN } from "graphql/query/work-flow-policy-query";
import ErrorMessage from "components/error-message/error-message";
import {
  CART_DOES_NOT_EXIST,
  ERROR_FETCHING_CART,
  GENERAL_ERROR_MSG,
  WORK_FLOW_POLICY_NOT_CONFIGURED,
} from "utils/constant";
import { refactorGetCartDataBeforeAddingToCart } from "utils/refactor-product-before-adding-to-cart";
import { useEffect, useState, useContext } from "react";
import { useAppDispatch, useAppState } from "contexts/app/app.provider";
import { FormattedMessage } from "react-intl";
import Loader from "components/loader/loader";
import { Q_GET_STORE_BRANCHES } from "graphql/query/store-branches.query";
import { refactorBranches } from "utils/refactor-branches";

const PAGE_TYPE = "categories";

export const Main = styled.div<any>(
  css({
    backgroundColor: "gray.200",
    position: "relative",
  })
);

const CustomSpacing = styled.hr<any>(
  css({
    margin:"0 3% 0 1%"
  })
);

export default function Categories({
  productCategories,
  products,
  deviceType,
}) {
  const page = sitePages[PAGE_TYPE];
  const client = useApolloClient();
  const router = useRouter();

  const storePolicy = useAppState("workFlowPolicy");
  const branches = useAppState("branches");
  const storeId=useAppState("activeStoreId");
  const { authDispatch, authState } = useContext<any>(AuthContext);
  const appDispatch = useAppDispatch();
  const { clearCart, addItem } = useCart();
  const [getCartState, setGetCartState] = useState({
    loading: false,
    error: "",
  });

  const { data, loading, error } = useQuery(
    Q_WORK_FLOW_POLICY_BASED_ON_DOMAIN,
    { fetchPolicy: "cache-and-network" }
  );

  const {
    data: storeBranches,
    loading: storeBranchesLoading,
    error: storeBranchesError,
  } = useQuery(Q_GET_STORE_BRANCHES);

  const runGetCartQuery = async () => {
    setGetCartState({ ...getCartState, loading: true, error: "" });
    try {
      clearCart();
      const { data: getCartData, error: getCartError } = await client.query({
        query: Q_GET_CART,
        variables: {
          entityId: storeId,
        },
        fetchPolicy: "no-cache",
      });
      if (getCartError)
        setGetCartState({
          ...getCartState,
          loading: false,
          error: ERROR_FETCHING_CART,
        });
      if (getCartData && getCartData.getCart && getCartData.getCart.products) {
        clearCart();
        getCartData.getCart.products.forEach((product) => {
          addItem(
            refactorGetCartDataBeforeAddingToCart(product),
            product.quantity
          );
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
      data &&
      data.getWorkFlowPolicyOfStoreBasedOnDomain &&
      data.getWorkFlowPolicyOfStoreBasedOnDomain.data &&
      data.getWorkFlowPolicyOfStoreBasedOnDomain.data.plan &&
      data.getWorkFlowPolicyOfStoreBasedOnDomain.data.plan.length &&
      storeBranches &&
      storeBranches.getStoreBranchesBasedOnDomain &&
      storeBranches.getStoreBranchesBasedOnDomain.length && !branches.length && !Object.keys(storePolicy).length
    ) {
      appDispatch({
        type: "POLICY_AND_BRANCHES",
        payload: {
          policy: data.getWorkFlowPolicyOfStoreBasedOnDomain.data.plan[0],
          branches: refactorBranches(
            storeBranches.getStoreBranchesBasedOnDomain
          ),
          storeId: data.getWorkFlowPolicyOfStoreBasedOnDomain.data.plan[0].storeId
        },
      })
      let isMounted = true;
      if (isMounted && authState?.isAuthenticated && storeId) {
        runGetCartQuery();
      }
      return () => {
        isMounted = false;
      };
    }
  }, [data, authState?.isAuthenticated, storeBranches,storeId]);

  if (
    data &&
    data.getWorkFlowPolicyOfStoreBasedOnDomain &&
    data.getWorkFlowPolicyOfStoreBasedOnDomain.data &&
    !data.getWorkFlowPolicyOfStoreBasedOnDomain.data.plan &&
    !error &&
    !loading
  ) {
    return (
      <ErrorMessage>
        <FormattedMessage
          id="errorStoreNotConfigured"
          defaultMessage={WORK_FLOW_POLICY_NOT_CONFIGURED}
        />
      </ErrorMessage>
    );
  }

  if (error || storeBranchesError)
    return (
      <ErrorMessage>
        <FormattedMessage id="errorMessage" defaultMessage={GENERAL_ERROR_MSG} />
      </ErrorMessage>
    );

  if (loading || storeBranchesLoading) return <Loader />;

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
      {storePolicy && branches.length && storeId ? (
        <Main>
          <HorizontalCategoryCardMenu
            type={PAGE_TYPE}
            productCategoriesSSR={productCategories}
          />
          {/* <CustomSpacing /> */}
          <Box padding={["0 15px 100px ", "0 15px 30px ", "0 30px 30px"]}>
            <ProductGrid type={PAGE_TYPE} firstPageProducts={products} />
          </Box>
          <CartPopUp deviceType={deviceType} />
        </Main>
      ) : null}
    </Modal>
  );
}

















//Statically generated pages
// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const storeId = process.env.NEXT_PUBLIC_STG_CLIENT_ID;
//   const apolloClient = initializeApollo();
//   try {
//     const {
//       data: {
//         getCategoriesForUser: { productCategories },
//       },
//       networkStatus,
//     } = await apolloClient.query({
//       query: GET_CATEGORIES_BY_STOREID,
//       variables: { storeId },
//     });

//     const { data: workFlowPolicyData } = await apolloClient.query({
//       query: Q_WORK_FLOW_POLICY,
//       variables: {
//         storeId,
//       },
//     });

//     let query, variables;
//     if (params.category === "all_products") {
//       query = GET_PRODUCTS;
//       variables = {
//         userStoreProductsFindInputDto: {
//           storeId,
//           isAvailable: true,
//           paginate: {
//             page: 1,
//             perPage: 30,
//           },
//         },
//       };
//     } else {
//       query = GET_PRODUCTS_OF_A_CATEGORY;
//       variables = {
//         productFindInput: {
//           categoryId: params.category,
//           storeId,
//           paginate: {
//             page: 1,
//             perPage: 30,
//           },
//         },
//       };
//     }
//     const { data, error } = await apolloClient.query({
//       query,
//       variables,
//     });

//     return {
//       props: {
//         storeId,
//         productCategories,
//         products: data,
//         workFlowPolicyDataSSR: workFlowPolicyData,
//       },
//       revalidate: 60,
//     };
//   } catch {
//     return {
//       props: {
//         storeId: null,
//         productCategories: null,
//         products: null,
//       },
//     };
//   }
// };

// export const getStaticPaths: GetStaticPaths = async () => {
//   const apolloClient = initializeApollo();
//   const paths = [];
//   const storeId = process.env.NEXT_PUBLIC_STG_CLIENT_ID;
//   try {
//     const {
//       data: {
//         getCategoriesForUser: { productCategories },
//       },
//       networkStatus,
//     } = await apolloClient.query({
//       query: GET_CATEGORIES_BY_STOREID,
//       variables: { storeId },
//     });
//     productCategories.forEach((category) =>
//       paths.push({ params: { category: category._id } })
//     );
//     paths.push({ params: { category: "all_products" } });
//     return {
//       paths,
//       fallback: true,
//     };
//   } catch {
//     return { paths: [], fallback: true };
//   }
// };
