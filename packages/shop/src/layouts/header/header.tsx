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

type Props = {
  className?: string;
};

const Header: React.FC<Props> = ({ className }) => {
  const {
    authState: { isAuthenticated },
    authDispatch,
  } = React.useContext<any>(AuthContext);
  const { clearCart } = useCart();
  const { pathname, query } = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      removeToken();
      authDispatch({ type: "SIGN_OUT" });
      clearCart();
      Router.push("/");
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
  // const showSearch =
  //   isCategoryPage(query.type) ||
  //   pathname === '/furniture-two' ||
  //   pathname === '/grocery-two' ||
  //   pathname === '/bakery';
  return (
    <HeaderWrapper className={className} id="layout-header">
      <LeftMenu logo={LogoImage} />
      <SearchWrapper>
        {" "}
        <Search
          minimal={false}
          className="banner-search"
          shadow="2px 2px 4px rgba(0,0,0,0.05)"
        />
      </SearchWrapper>
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
