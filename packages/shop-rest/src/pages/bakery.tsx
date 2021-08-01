import styled from 'styled-components';
import css from '@styled-system/css';
import { Banner } from 'components/banner/banner';
import { ProductGrid } from 'components/product-grid/product-grid-two';
import { Modal } from '@redq/reuse-modal';
import dynamic from 'next/dynamic';
import { sitePages } from 'site-settings/site-pages';
import { HorizontalCategoryCardMenu } from 'layouts/horizontal-category-menu/horizontal-category-card-menu';
import { MobileBanner } from 'components/banner/mobile-banner';
import { Box } from 'components/box';

const CartPopUp = dynamic(() => import('features/carts/cart-popup'), {
  ssr: false,
});

export const Main = styled.div<any>(
  css({
    backgroundColor: 'gray.200',
    position: 'relative',
  })
);

const PAGE_TYPE = 'bakery';

export default function BakeryPage({ deviceType }) {
  const page = sitePages[PAGE_TYPE];

  return (
    <Modal>
      <MobileBanner intlTitleId={page?.banner_title_id} type={PAGE_TYPE} />
      <Banner
        intlTitleId={page?.banner_title_id}
        intlDescriptionId={page?.banner_description_id}
        imageUrl={page?.banner_image_url}
        style={{ maxHeight: 560 }}
      />
      <Main>
        <HorizontalCategoryCardMenu type={PAGE_TYPE} />
        <Box padding={['0 15px 100px ', '0 15px 30px ', '0 30px 30px']}>
          <ProductGrid type={PAGE_TYPE} />
        </Box>
      </Main>
      <CartPopUp deviceType={deviceType} />
    </Modal>
  );
}
