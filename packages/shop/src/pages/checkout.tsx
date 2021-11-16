import React from "react";
import { NextPage } from "next";
import { useQuery, useSubscription } from "@apollo/client";
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
import { Q_WORK_FLOW_POLICY } from "graphql/query/work-flow-policy-query";
import paymentoptions from "features/checkouts/data";
import { Q_GET_USER_PROFILE } from "graphql/query/get-user-profile.query";

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

  const { data, loading, error } = useQuery(Q_GET_ALL_ADDRESSES);

  const { authDispatch } = React.useContext<any>(AuthContext);

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
        entityId,
      },
      fetchPolicy: "network-only",
    }
  );

  const {
    data: userProfileData,
    loading: userProfileLoading,
    error: userProfileError,
  } = useQuery(Q_GET_USER_PROFILE);

  const {
    data: workFlowPolicyData,
    loading: workFlowPolicyLoading,
    error: workFlowPolicyError,
  } = useQuery(Q_WORK_FLOW_POLICY);

  if (cartLoading || workFlowPolicyLoading || userProfileLoading || loading)
    return <Loader />;
  if (workFlowPolicyError || userProfileError || error)
    return <ErrorMessage message="Something went wrong.Please try again :(" />;
  if (cartError)
    return (
      <ErrorMessage
        message={cartError.message || "Error fetching cart your cart :("}
      />
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
  if (workFlowPolicyData) {
    const filteredStore = workFlowPolicyData.workFlowPolicyApi.plan.filter(
      (plan) => plan.storeId === storeId
    );
    if (!filteredStore.length)
      return <ErrorMessage message="Error fetching the store's policies!" />;
    policies["gateWayName"] = filteredStore[0].gateWayName;
    policies["paymentType"] = filteredStore[0].paymentType.map(
      (type, index) => {
        return {
          type,
          id: index,
          description: paymentoptions.filter(
            (option) => option.title === type
          )[0].content,
        };
      }
    );
  }

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
            storeId={storeId}
            deliveryCost={cartData?.getCart?.deliveryCost}
            wallet={userProfileData?.getUserProfile?.wallet}
          />
        </Modal>
      </ProfileProvider>
    </>
  );
};

export default CheckoutPage;
