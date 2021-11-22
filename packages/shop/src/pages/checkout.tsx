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
import {
  ERROR_FETCHING_CART,
  ERROR_FETCHING_USER_DETAILS,
  GENERAL_ERROR_MSG,
} from "utils/constant";
import { Q_GET_STORE_ID } from "graphql/query/loggedIn-queries.query";

type Props = {
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

const CheckoutPage: NextPage<Props> = ({ deviceType }) => {
  
  const {data:storeIdData}=useQuery(Q_GET_STORE_ID);
  const storeId=storeIdData.storeId;

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
        entityId:storeId,
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
  } = useQuery(Q_WORK_FLOW_POLICY, {
    variables: {
      storeId: storeId,
    },
  });

  if (cartLoading || workFlowPolicyLoading || userProfileLoading || loading)
    return <Loader />;
  if (workFlowPolicyError || error)
    return <ErrorMessage message={GENERAL_ERROR_MSG} />;
  if (cartError)
    return <ErrorMessage message={cartError.message || ERROR_FETCHING_CART} />;
  if (userProfileError)
    return <ErrorMessage message={ERROR_FETCHING_USER_DETAILS} />;

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
  if (
    workFlowPolicyData &&
    workFlowPolicyData.getWorkFlowpolicyPlanOfStoreForUserWeb &&
    workFlowPolicyData.getWorkFlowpolicyPlanOfStoreForUserWeb.data &&
    workFlowPolicyData.getWorkFlowpolicyPlanOfStoreForUserWeb.data.plan
  ) {
    if (
      workFlowPolicyData.getWorkFlowpolicyPlanOfStoreForUserWeb.data.plan.length
    ) {
      const plan =
        workFlowPolicyData.getWorkFlowpolicyPlanOfStoreForUserWeb.data.plan[0];
      policies["gateWayName"] = plan.gateWayName;
      policies["paymentType"] = plan.paymentType.map((type, index) => {
        return {
          type,
          id: index,
          description: paymentoptions.filter(
            (option) => option.title === type
          )[0].content,
        };
      });
    } else {
      policies["paymentType"] = [
        {
          type: "cash",
          id: 1,
          description: paymentoptions.filter(
            (option) => option.title === "cash"
          ),
        },
      ];
    }
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
            deliveryCost={cartData?.getCart?.deliveryCost}
            wallet={userProfileData?.getUserProfile?.wallet}
          />
        </Modal>
      </ProfileProvider>
    </>
  );
};

export default CheckoutPage;
