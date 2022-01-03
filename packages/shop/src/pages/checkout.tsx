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
import { getStoreId, removeToken } from "utils/localStorage";
import { useRouter } from "next/router";
import { Q_GET_CART } from "graphql/query/get-cart.query";
import Loader from "components/loader/loader";
import ErrorMessage from "../components/error-message/error-message";
import { Q_WORK_FLOW_POLICY } from "graphql/query/work-flow-policy-query";
import paymentoptions from "features/checkouts/data";
import { Q_GET_USER_PROFILE } from "graphql/query/get-user-profile.query";
import {
  ERROR_FETCHING_CART,
  ERROR_FETCHING_USER_DETAILS,
  GENERAL_ERROR_MSG,
} from "utils/constant";
import { FormattedMessage } from "react-intl";
import { useAppState } from "contexts/app/app.provider";

type Props = {
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

const CheckoutPage: NextPage<Props> = ({ deviceType }) => {
  const storeId = getStoreId();

  const { clearCart } = useCart();
  const router = useRouter();

  const { data, loading, error } = useQuery(Q_GET_ALL_ADDRESSES);

  const { authDispatch } = React.useContext<any>(AuthContext);
  const workFlowPolicyOfStore = useAppState("workFlowPolicy");

  if (!isTokenValidOrUndefined()) {
    removeToken();
    clearCart();
    authDispatch({ type: "SIGN_OUT" });
    router.replace("/");
  }

  const { data: cartData, loading: cartLoading, error: cartError } = useQuery(
    Q_GET_CART,
    {
      variables: {
        entityId: storeId,
      },
      fetchPolicy: "network-only",
    }
  );

  const {
    data: userProfileData,
    loading: userProfileLoading,
    error: userProfileError,
  } = useQuery(Q_GET_USER_PROFILE);

  if (cartLoading || userProfileLoading || loading) return <Loader />;
  if (cartError)
    return (
      <ErrorMessage>
        <FormattedMessage
          id="error"
          defaultMessage={cartError.message || ERROR_FETCHING_CART}
        />
      </ErrorMessage>
    );
  if (userProfileError || error)
    return (
      <ErrorMessage>
        <FormattedMessage
          id="error"
          defaultMessage={ERROR_FETCHING_USER_DETAILS}
        />
      </ErrorMessage>
    );

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

  let policies = {};
  policies["paymentType"] = [
    {
      type: "cash",
      id: 1,
      description: paymentoptions.filter((option) => option.title === "cash"),
    },
  ];

  return (
    <>
      <SEO title="Checkout - Orderznow" description="Checkout Details" />
      <ProfileProvider
        initData={{
          address: userAddresses,
          storePolicies: policies,
        }}
      >
        <Modal>
          <Checkout
            deviceType={deviceType}
            cartId={cartData?.getCart?._id}
            deliveryCost={cartData?.getCart?.deliveryCost}
            wallet={userProfileData?.getUserProfile?.wallet}
          />
        </Modal>
      </ProfileProvider>
    </>
  );
};

export default CheckoutPage;
