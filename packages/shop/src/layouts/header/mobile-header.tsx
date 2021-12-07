import React from "react";
import { useRouter } from "next/router";
import { openModal, closeModal } from "@redq/reuse-modal";
import MobileDrawer from "./mobile-drawer";
import {
  MobileHeaderWrapper,
  MobileHeaderInnerWrapper,
  DrawerWrapper,
  LogoWrapper,
  SearchWrapper,
  SearchModalWrapper,
  SearchModalClose,
} from "./header.style";
import Search from "features/search/search";
import LogoImage from "assets/images/orderznow_web-logo.png";
import { SearchIcon } from "assets/icons/SearchIcon";
import { LongArrowLeft } from "assets/icons/LongArrowLeft";
import Logo from "layouts/logo/logo";
import LanguageSwitcher from "./menu/language-switcher/language-switcher";
import { isCategoryPage } from "../is-home-page";
import useDimensions from "utils/useComponentSize";
import { useQuery } from "@apollo/client";
import { Q_GET_STORE } from "graphql/query/getstore.query";

type MobileHeaderProps = {
  className?: string;
  closeSearch?: any;
};

const SearchModal: React.FC<{}> = () => {
  const onSubmit = () => {
    closeModal();
  };
  return (
    <SearchModalWrapper>
      <SearchModalClose type="submit" onClick={() => closeModal()}>
        <LongArrowLeft />
      </SearchModalClose>
      <Search
        className="header-modal-search"
        showButtonText={false}
        onSubmit={onSubmit}
      />
    </SearchModalWrapper>
  );
};

const MobileHeader: React.FC<MobileHeaderProps> = ({ className }) => {
  let logo = LogoImage;
  let isStoreLogo = false;
  const { pathname, query } = useRouter();

  const [mobileHeaderRef, dimensions] = useDimensions();

  const { data: storeData } = useQuery(Q_GET_STORE, {
    variables: {
      input: {
        _id: process.env.NEXT_PUBLIC_STG_CLIENT_ID,
        paginate: {
          page: 1,
          perPage: 10,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  if (
    storeData &&
    storeData.getStoresForUser &&
    storeData.getStoresForUser.stores &&
    storeData.getStoresForUser.stores[0]?.logo
  ) {
    logo = storeData.getStoresForUser.stores[0]?.logo;
    isStoreLogo = true;
  }

  const handleSearchModal = () => {
    openModal({
      show: true,
      config: {
        enableResizing: false,
        disableDragging: true,
        className: "search-modal-mobile",
        width: "100%",
        height: "100%",
      },
      closeOnClickOutside: false,
      component: SearchModal,
      closeComponent: () => <div />,
    });
  };
  const type = pathname === "/restaurant" ? "restaurant" : query.type;

  const isHomePage = isCategoryPage(type);

  return (
    <MobileHeaderWrapper>
      <MobileHeaderInnerWrapper className={className} ref={mobileHeaderRef}>
        <DrawerWrapper>
          <MobileDrawer />
        </DrawerWrapper>

        <LogoWrapper>
          <Logo
            imageUrl={logo}
            alt={isStoreLogo ? "Shop Logo" : "Orderznow Logo"}
          />
        </LogoWrapper>

        <LanguageSwitcher />

        {isHomePage ? (
          <SearchWrapper
            onClick={handleSearchModal}
            className="searchIconWrapper"
          >
            <SearchIcon />
          </SearchWrapper>
        ) : null}
      </MobileHeaderInnerWrapper>
    </MobileHeaderWrapper>
  );
};

export default MobileHeader;
