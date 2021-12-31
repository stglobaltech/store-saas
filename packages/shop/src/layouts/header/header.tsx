import React from "react";
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
import { isCategoryPage } from "../is-home-page";
import Search from "features/search/search";
import { removeToken } from "utils/localStorage";
import { useCart } from "contexts/cart/use-cart";
import { useQuery } from "@apollo/client";
import { Q_GET_STORE } from "graphql/query/getstore.query";

type Props = {
  className?: string;
};

const Header: React.FC<Props> = ({ className }) => {
  let logo=LogoImage;
  let isStoreLogo=false;
  const {
    authState: { isAuthenticated },
    authDispatch,
  } = React.useContext<any>(AuthContext);
  const { clearCart } = useCart();
  const { pathname, query } = useRouter();

  const {data:storeData}=useQuery(Q_GET_STORE,{
    variables:{
      input:{
        paginate:{
          page:1,
          perPage:10
        }
      }
    },
    fetchPolicy:"cache-and-network"
  })
  if(storeData && storeData.getStoresForUser && storeData.getStoresForUser.stores && storeData.getStoresForUser.stores[0]?.logo){
    logo=storeData.getStoresForUser.stores[0].logo
    isStoreLogo=true;
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      removeToken();
      authDispatch({ type: "SIGN_OUT" });
      clearCart();
      Router.push("/store/home");
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
  const showSearch = pathname.includes("/store/");
  return (
    <HeaderWrapper className={className} id="layout-header">
      <LeftMenu logo={logo} isStoreLogo={isStoreLogo}/>
      {showSearch ? (
        <SearchWrapper>
          {" "}
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
