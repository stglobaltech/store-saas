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
import { useApolloClient } from "@apollo/client";
import { getStoreId, removeToken } from "utils/localStorage";
import {
  CART_DOES_NOT_EXIST,
  ERROR_FETCHING_CART,
  GENERAL_ERROR_MSG,
} from "utils/constant";
import { refactorGetCartDataBeforeAddingToCart } from "utils/refactor-product-before-adding-to-cart";
import { useEffect, useState, useContext } from "react";

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

export default function Categories({ products, deviceType }) {
  const page = sitePages[PAGE_TYPE];
  const client = useApolloClient();
  const router = useRouter();

  const { authDispatch, authState } = useContext<any>(AuthContext);
  const { clearCart, addItem } = useCart();
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
          entityId: getStoreId(),
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
    let isMounted = true;
    if (isMounted && authState?.isAuthenticated) {
      runGetCartQuery();
    }
    return () => {
      isMounted = false;
    };
  }, [authState?.isAuthenticated]);

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
        <HorizontalCategoryCardMenu type={PAGE_TYPE} />
        <CustomSpacing />
        <Box padding={["0 15px 100px ", "0 15px 30px ", "0 30px 30px"]}>
          <ProductGrid type={PAGE_TYPE} firstPageProducts={products} />
        </Box>
        <CartPopUp deviceType={deviceType} />
      </Main>
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
