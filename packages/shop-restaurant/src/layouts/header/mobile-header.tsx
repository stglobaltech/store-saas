import React from 'react';
import { useRouter } from 'next/router';
// import { openModal, closeModal } from '@redq/reuse-modal';
import MobileDrawer from './mobile-drawer';
import {
  MobileHeaderWrapper,
  MobileHeaderInnerWrapper,
  DrawerWrapper,
  LogoWrapper,
  SearchWrapper,
  SearchModalWrapper,
  SearchModalClose,
} from './header.style';
import Search from 'features/search/search';
import LogoImage from 'assets/images/logo.svg';

import { SearchIcon } from 'assets/icons/search-icon';
import { LongArrowLeft } from 'assets/icons/long-arrow-left';
import Logo from 'layouts/logo/logo';
import LanguageSwitcher from './menu/language-switcher/language-switcher';
// import { isCategoryPage } from '../is-home-page';
import useDimensions from 'utils/use-component-size';

type MobileHeaderProps = {
  className?: string;
  closeSearch?: any;
};

const SearchModal: React.FC<{}> = () => {
  const onSubmit = () => {
    // closeModal();
  };
  return (
    <SearchModalWrapper>
      <SearchModalClose type="submit" onClick={onSubmit}>
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
  const { pathname } = useRouter();

  const [mobileHeaderRef, dimensions] = useDimensions();

  const handleSearchModal = () => {
    // openModal({
    //   show: true,
    //   config: {
    //     enableResizing: false,
    //     disableDragging: true,
    //     className: 'search-modal-mobile',
    //     width: '100%',
    //     height: '100%',
    //   },
    //   closeOnClickOutside: false,
    //   component: SearchModal,
    //   closeComponent: () => <div />,
    // });
  };
  const isHomePage = pathname === '/';

  // const isHomePage = isCategoryPage(type);

  return (
    <MobileHeaderWrapper>
      <MobileHeaderInnerWrapper className={className} ref={mobileHeaderRef}>
        <DrawerWrapper>
          <MobileDrawer />
        </DrawerWrapper>

        <LogoWrapper>
          <Logo imageUrl={LogoImage} alt="shop logo" />
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
