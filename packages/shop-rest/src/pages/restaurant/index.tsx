import React from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Modal } from '@redq/reuse-modal';
import StoreNav from 'components/store-nav/store-nav';
import Carousel from 'components/carousel/carousel';
import { Banner } from 'components/banner/banner';
import { MobileBanner } from 'components/banner/mobile-banner';

import {
  MainContentArea,
  SidebarSection,
  ContentSection,
  OfferSection,
  MobileCarouselDropdown,
} from 'assets/styles/pages.style';
// Static Data Import Here
import { siteOffers } from 'site-settings/site-offers';
import BannerImg from 'assets/images/banner/restaurant.png';
import { CATEGORY_MENU_ITEMS } from 'site-settings/site-navigation';
import { SEO } from 'components/seo';

const Sidebar = dynamic(() => import('layouts/sidebar/sidebar'));
const Products = dynamic(() =>
  import('components/product-grid/product-list-two/product-list-two')
);
const PAGE_TYPE = 'restaurant';

function RestaurantPage({ deviceType }) {
  const { query } = useRouter();
  const targetRef = React.useRef(null);
  React.useEffect(() => {
    if ((query.text || query.category) && targetRef.current) {
      window.scrollTo({
        top: targetRef.current.offsetTop - 110,
        behavior: 'smooth',
      });
    }
  }, [query]);

  return (
    <>
      <SEO title='Restaurant - PickBazar' description='Restaurant Details' />
      <Modal>
        <MobileBanner intlTitleId='foodsTitle' type={PAGE_TYPE} />

        <Banner
          intlTitleId='foodsTitle'
          intlDescriptionId='foodsSubTitle'
          imageUrl={BannerImg}
        />

        <OfferSection>
          <div style={{ margin: '0 -10px' }}>
            <Carousel deviceType={deviceType} data={siteOffers} />
          </div>
        </OfferSection>

        <MobileCarouselDropdown>
          <Sidebar type={PAGE_TYPE} deviceType={deviceType} />
        </MobileCarouselDropdown>

        <MainContentArea>
          <SidebarSection>
            <Sidebar type={PAGE_TYPE} deviceType={deviceType} />
          </SidebarSection>
          <ContentSection>
            <div ref={targetRef}>
              <Products
                type={PAGE_TYPE}
                deviceType={deviceType}
                fetchLimit={16}
              />
            </div>
          </ContentSection>
        </MainContentArea>
      </Modal>
    </>
  );
}

export default RestaurantPage;
