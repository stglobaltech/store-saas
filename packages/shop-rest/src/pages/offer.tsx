import React from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { SEO } from 'components/seo';
import CartPopUp from 'features/carts/cart-popup';
import { Modal } from '@redq/reuse-modal';
import GiftCard from 'components/gift-card/gift-card';
import Footer from 'layouts/footer';
import useCoupon from 'data/use-coupon';
import {
  OfferPageWrapper,
  ProductsRow,
  MainContentArea,
  ProductsCol,
} from 'assets/styles/pages.style';
const ErrorMessage = dynamic(() =>
  import('components/error-message/error-message')
);

type GiftCardProps = {
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

const GiftCardPage: NextPage<GiftCardProps> = ({ deviceType }) => {
  const { data, error } = useCoupon();
  if (error) return <ErrorMessage message={error.message} />;
  if (!data) return <p>Loading...</p>;

  return (
    <Modal>
      <SEO title="Offer - PickBazar" description="Offer Details" />
      <OfferPageWrapper>
        <MainContentArea>
          <div style={{ width: '100%' }}>
            <ProductsRow>
              {data.map((coupon) => (
                <ProductsCol key={coupon.id}>
                  <GiftCard image={coupon.image} code={coupon.code} />
                </ProductsCol>
              ))}
            </ProductsRow>
          </div>
        </MainContentArea>
        <Footer />
      </OfferPageWrapper>
      <CartPopUp deviceType={deviceType} />
    </Modal>
  );
};

export default GiftCardPage;
