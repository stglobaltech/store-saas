import React, { useEffect } from "react";
import Router, { useRouter } from "next/router";
import { openModal } from "@redq/reuse-modal";
import { AuthContext } from "contexts/auth/auth.context";
import AuthenticationForm from "features/authentication-form";
import { RightMenu } from "./menu/right-menu/right-menu";
import { LeftMenu } from "./menu/left-menu/left-menu";
import HeaderWrapper from "./header.style";
import { SearchWrapper } from "components/banner/banner.style";
import LogoImage from "assets/images/orderznow_web-logo.png";
import UserImage from "assets/images/user.jpg";
import Search from "features/search/search";
import { removeToken, setStoreId } from "utils/localStorage";
import { useCart } from "contexts/cart/use-cart";
import { useQuery } from "@apollo/client";
import { Q_GET_STORE } from "graphql/query/getstore.query";
import { useAppDispatch } from "contexts/app/app.provider";
import { Q_WORK_FLOW_POLICY_BASED_ON_DOMAIN } from "graphql/query/work-flow-policy-query";
import { Q_GET_STORE_BRANCHES } from "graphql/query/get-store-branches.query";
import { refactorBranches } from "utils/refactor-branches";
import {
  GENERAL_ERROR_MSG,
  WORK_FLOW_POLICY_NOT_CONFIGURED,
} from "utils/constant";
import Loader from "components/loader/loader";
import { FormattedMessage } from "react-intl";
import ErrorMessage from "components/error-message/error-message";

type Props = {
  className?: string;
};

const Header: React.FC<Props> = ({ className }) => {
  let logo = LogoImage;
  let isStoreLogo = false;
  const {
    authState: { isAuthenticated },
    authDispatch,
  } = React.useContext<any>(AuthContext);
  const { clearCart } = useCart();
  const { pathname, query } = useRouter();
  const appDispatch = useAppDispatch();

  const { data: storeData } = useQuery(Q_GET_STORE, {
    variables: {
      input: {
        paginate: {
          page: 1,
          perPage: 10,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const { data, loading, error } = useQuery(
    Q_WORK_FLOW_POLICY_BASED_ON_DOMAIN,
    { fetchPolicy: "cache-and-network" }
  );

  const {
    data: storeBranchesData,
    loading: storeBranchesLoading,
    error: storeBranchesError,
  } = useQuery(Q_GET_STORE_BRANCHES, {
    fetchPolicy: "cache-and-network",
  });

  if (
    storeData &&
    storeData.getStoresForUser &&
    storeData.getStoresForUser.stores &&
    storeData.getStoresForUser.stores[0]?.logo
  ) {
    logo = storeData.getStoresForUser.stores[0].logo;
    isStoreLogo = true;
  }

  useEffect(() => {
    if (
      data &&
      data.getWorkFlowPolicyOfStoreBasedOnDomain &&
      data.getWorkFlowPolicyOfStoreBasedOnDomain.data &&
      data.getWorkFlowPolicyOfStoreBasedOnDomain.data.plan &&
      data.getWorkFlowPolicyOfStoreBasedOnDomain.data.plan.length &&
      storeBranchesData &&
      storeBranchesData.getStoreBranchesBasedOnDomain
    ) {
      appDispatch({
        type: "POLICY_AND_BRANCHES",
        payload: {
          workFlowPolicy:
            data.getWorkFlowPolicyOfStoreBasedOnDomain.data.plan[0],
          storeBranches: refactorBranches(
            storeBranchesData.getStoreBranchesBasedOnDomain
          ),
        },
      });
      setStoreId(
        data.getWorkFlowPolicyOfStoreBasedOnDomain.data.plan[0].storeId
      );
    }
  }, [data, storeBranchesData]);

  if (
    data &&
    data.getWorkFlowPolicyOfStoreBasedOnDomain &&
    data.getWorkFlowPolicyOfStoreBasedOnDomain.data &&
    !data.getWorkFlowPolicyOfStoreBasedOnDomain.data.plan &&
    !error &&
    !loading
  ) {
    return (
      <ErrorMessage>
        <FormattedMessage
          id="error"
          defaultMessage={WORK_FLOW_POLICY_NOT_CONFIGURED}
        />
      </ErrorMessage>
    );
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      removeToken();
      authDispatch({ type: "SIGN_OUT" });
      clearCart();
      Router.push("/store");
    }
  };

  const handleJoin = () => {
    authDispatch({
      type: "SIGNIN",
    });

    openModal({
      show: true,
      overlayClassName: "quick-view-overlay",
      closeOnClickOutside: true,
      component: AuthenticationForm,
      closeComponent: "",
      config: {
        enableResizing: false,
        disableDragging: true,
        className: "quick-view-modal",
        width: 458,
        height: "auto",
      },
    });
  };
  const showSearch = pathname.includes("/store");

  if (error || storeBranchesError)
    return (
      <ErrorMessage>
        <FormattedMessage id="error" defaultMessage={GENERAL_ERROR_MSG} />
      </ErrorMessage>
    );

  if (loading || storeBranchesLoading) return <Loader />;

  return (
    <HeaderWrapper className={className} id="layout-header">
      <LeftMenu logo={logo} isStoreLogo={isStoreLogo} />
      {showSearch ? (
        <SearchWrapper>
          <Search
            minimal={false}
            className="banner-search"
            shadow="2px 2px 4px rgba(0,0,0,0.05)"
          />
        </SearchWrapper>
      ) : null}
      <RightMenu
        isAuthenticated={isAuthenticated}
        onJoin={handleJoin}
        onLogout={handleLogout}
        avatar={UserImage}
      />
    </HeaderWrapper>
  );
};

export default Header;
