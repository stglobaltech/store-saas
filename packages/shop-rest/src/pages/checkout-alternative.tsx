import React from 'react';
import { NextPage } from 'next';
import { Modal } from '@redq/reuse-modal';
import { SEO } from 'components/seo';
import Checkout from 'features/checkouts/checkout-one/checkout-one';
import { ProfileProvider } from 'contexts/profile/profile.provider';
import ErrorMessage from 'components/error-message/error-message';
import useUser from 'data/use-user';

type Props = {
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};
const CheckoutPage: NextPage<Props> = ({ deviceType }) => {
  const { user, error } = useUser();
  if (!user) return <div>loading...</div>;

  if (error) return <ErrorMessage message={error.message} />;
  const token = 'true';

  return (
    <>
      <SEO
        title="Checkout Alternative - PickBazar"
        description="Checkout Details"
      />
      <ProfileProvider initData={user}>
        <Modal>
          <Checkout token={token} deviceType={deviceType} />
        </Modal>
      </ProfileProvider>
    </>
  );
};

export default CheckoutPage;
