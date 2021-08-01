import React from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { SEO } from 'components/seo';
import { Modal } from '@redq/reuse-modal';
import ProductSingleWrapper, {
  ProductSingleContainer,
} from 'assets/styles/product-single.style';
import { getAllProducts, getProductBySlug } from 'utils/api/product';

const ProductDetails = dynamic(() =>
  import('components/product-details/product-details-one/product-details-one')
);
const ProductDetailsBook = dynamic(() =>
  import('components/product-details/product-details-two/product-details-two')
);
const CartPopUp = dynamic(() => import('features/carts/cart-popup'), {
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

  if (router.isFallback) return <p>Loading...</p>;
  let content = <ProductDetails product={data} deviceType={deviceType} />;
  if (data.type === 'book') {
    content = <ProductDetailsBook product={data} deviceType={deviceType} />;
  }
  return (
    <>
      <SEO
        title={`${data.title} - PickBazar`}
        description={`${data.title} Details`}
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
export async function getStaticProps({ params }) {
  const data = await getProductBySlug(params.slug);
  return {
    props: {
      data,
    },
  };
}
export async function getStaticPaths() {
  const products = await getAllProducts();
  return {
    paths: products.slice(0, 10).map(({ slug }) => ({ params: { slug } })),
    fallback: true,
  };
}
export default ProductPage;
