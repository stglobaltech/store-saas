import React from "react";
import { NextPage } from "next";
import { useQuery } from "@apollo/client";
import { Modal } from "@redq/reuse-modal";
import { SEO } from "components/seo";
import Checkout from "features/checkouts/checkout-two/checkout-two";
import { Q_GET_ALL_ADDRESSES } from "graphql/query/customer.query";
import { useCart } from "contexts/cart/use-cart";
import { AuthContext } from "contexts/auth/auth.context";
import { isTokenValidOrUndefined } from "utils/tokenValidation";
import { ProfileProvider } from "contexts/profile/profile.provider";
import { removeToken } from "utils/localStorage";
import { useRouter } from "next/router";
import { Q_GET_CART } from "graphql/query/get-cart.query";
import Loader from "components/loader/loader";
import ErrorMessage from "../components/error-message/error-message";
import paymentoptions from "features/checkouts/data";

type Props = {
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};
const CheckoutPage: NextPage<Props> = ({ deviceType }) => {
  const storeId = process.env.NEXT_PUBLIC_STG_CLIENT_ID;
  const entityId = storeId;

  const { cartItemsCount, clearCart } = useCart();
  const router = useRouter();

  const { data, loading } = useQuery(Q_GET_ALL_ADDRESSES);

  const { authDispatch } = React.useContext<any>(AuthContext);

  const { data: cartData, loading: cartLoading, error: cartError } = useQuery(
    Q_GET_CART,
    {
      variables: {
        entityId,
      },
      fetchPolicy: "network-only",
    }
  );

  if (!isTokenValidOrUndefined()) {
    removeToken();
    clearCart();
    authDispatch({ type: "SIGN_OUT" });
    router.replace("/");
  }

  if (cartLoading) return <Loader />;
  if (cartError)
    return (
      <ErrorMessage message="Could not fetch your cart! Please try again..." />
    );

  if (loading) {
    return <div>loading...</div>;
  }

  function formatAddress() {
    const addresses = data.getAllAddress.map((address) => ({
      address: address.address,
      id: address.id,
      name: address.name,
      buildingNo: address.buildingNo,
    }));
    return addresses;
  }

  let userAddresses = [];
  if (data) {
    userAddresses = formatAddress();
  }

  return (
    <>
      <SEO title="Checkout - Orderznow" description="Checkout Details" />
      <ProfileProvider
        initData={{ address: userAddresses, paymentoptions: paymentoptions }}
      >
        <Modal>
          <Checkout
            deviceType={deviceType}
            cartId={cartData?.getCart?._id}
            storeId={storeId}
            deliveryCost={cartData?.getCart?.deliveryCost}
          />
        </Modal>
      </ProfileProvider>
    </>
  );
};

export default CheckoutPage;
