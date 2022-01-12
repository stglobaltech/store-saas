import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { SEO } from "components/seo";
import { Modal } from "@redq/reuse-modal";
import ProductSingleWrapper, {
  ProductSingleContainer,
} from "assets/styles/product-single.style";
import { GET_PRODUCT_DETAILS } from "graphql/query/product.query";
import { initializeApollo } from "utils/apollo";
import { useQuery } from "@apollo/client";
import Loader from "components/loader/loader";
import { FormattedMessage } from "react-intl";
import ErrorMessage from "components/error-message/error-message";
import { GENERAL_ERROR_MSG } from "utils/constant";

const ProductDetails = dynamic(
  () =>
    import("components/product-details/product-details-one/product-details-one")
);

const CartPopUp = dynamic(() => import("features/carts/cart-popup"), {
  ssr: false,
});

type Props = {
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
  data: any;
  [key: string]: any;
};

const ProductPage: NextPage<Props> = ({ data, deviceType }) => {
  const router = useRouter();
  const { slug } = router.query;

  const {
    data: productDetail,
    loading: productDetailLoading,
    error: productDetailError,
  } = useQuery(GET_PRODUCT_DETAILS, {
    variables: {
      productId: slug,
    },
  });

  if (productDetailLoading) return <Loader />;
  if (productDetailError)
    return (
      <ErrorMessage>
        <FormattedMessage id="error" defaultMessage={GENERAL_ERROR_MSG} />
      </ErrorMessage>
    );

  const content = (
    <ProductDetails
      product={productDetail.getProductForUser}
      deviceType={deviceType}
    />
  );

  return (
    <>
      <SEO
        title={`${productDetail.getProductForUser.productName.en}`}
        description={`${productDetail.getProductForUser.productName.en} Details`}
      />

      <Modal>
        <ProductSingleWrapper>
          <ProductSingleContainer>
            {content}
            <CartPopUp deviceType={deviceType} />
          </ProductSingleContainer>
        </ProductSingleWrapper>
      </Modal>
    </>
  );
};

// export async function getServerSideProps({ params }) {
//   const apolloClient = initializeApollo();
//   const { data, error } = await apolloClient.query({
//     query: GET_PRODUCT_DETAILS,
//     variables: {
//       productId: params.slug,
//     },
//   });
//   return {
//     props: {
//       data,
//     },
//   };
// }

export default ProductPage;
