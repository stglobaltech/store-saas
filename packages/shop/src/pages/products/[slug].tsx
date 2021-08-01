import React from 'react';
import dynamic from 'next/dynamic';
import { initializeApollo } from 'utils/apollo';
import { GET_PRODUCT_DETAILS } from 'graphql/query/product.query';
import { Modal } from '@redq/reuse-modal';
import ProductSingleWrapper, {
  ProductSingleContainer,
} from 'assets/styles/product-single.style';

const ProductDetails = dynamic(
  () =>
    import(
      'components/product-details/product-details-four/product-details-four'
    )
);
const ProductDetailsBakery = dynamic(
  () =>
    import(
      'components/product-details/product-details-five/product-details-five'
    )
);
const ProductDetailsGrocery = dynamic(
  () =>
    import('components/product-details/product-details-six/product-details-six')
);

const CartPopUp = dynamic(() => import('features/carts/cart-popup'), {
  ssr: false,
});
interface Props {
  data: any;
  deviceType: any;
}

export async function getServerSideProps({ params }) {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: GET_PRODUCT_DETAILS,
    variables: {
      slug: params.slug,
    },
  });
  return {
    props: {
      data,
    },
  };
}
const ProductDetailsPage = ({ data, deviceType }: Props) => {
  let content = (
    <ProductDetails product={data.product} deviceType={deviceType} />
  );
  if (data.product.type === 'BAKERY') {
    content = (
      <ProductDetailsBakery product={data.product} deviceType={deviceType} />
    );
  }
  if (data.product.type === 'GROCERY') {
    content = (
      <ProductDetailsGrocery product={data.product} deviceType={deviceType} />
    );
  }
  return (
    <Modal>
      <ProductSingleWrapper>
        <ProductSingleContainer>
          {content}
          <CartPopUp deviceType={deviceType} />
        </ProductSingleContainer>
      </ProductSingleWrapper>
    </Modal>
  );
};
export default ProductDetailsPage;
