import { useEffect } from 'react';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Carousel from 'components/carousel/carousel';
import { Banner } from 'components/banner/banner';
import { SEO } from 'components/seo';
import { Box } from 'components/box';
// Static Data Import Here
import { siteOffers } from 'site-settings/site-offers';
import bannerImage from 'assets/images/banner/restaurant.png';
import { initializeApollo } from 'utils/apollo';
import { useRefScroll } from 'utils/use-ref-scroll';
import { GET_CATEGORIES } from 'utils/graphql/query/category.query';
import { GET_VENDORS } from 'utils/graphql/query/vendors.query';
import { MobileBanner } from 'components/banner/mobile-banner';
import { Modal } from '@redq/reuse-modal';

const Sidebar = dynamic(() => import('layouts/sidebar/sidebar'));
const ProductGrid = dynamic(() =>
  import('features/product-grid/product-grid-one/product-grid-one')
);
const PAGE_TYPE = 'restaurant';

const HomePage = () => {
  const { query } = useRouter();
  const { elRef: targetRef, scroll } = useRefScroll({
    percentOfElement: 0,
    percentOfContainer: 0,
    offsetPX: -110,
  });
  useEffect(() => {
    if (query.text || query.category) {
      scroll();
    }
  }, [query.text, query.category]);
  return (
    <>
      <SEO title="Restaurant - PickBazar" description="Restaurant Details" />
      <Modal>
        <MobileBanner intlTitleId={'foodsTitle'} type={PAGE_TYPE} />
        <Banner
          intlTitleId="foodsTitle"
          intlDescriptionId="foodsSubTitle"
          imageUrl={bannerImage}
        />
        <Box
          position="relative"
          p={['1rem', '1.5rem 1rem', '4rem 2.4rem']}
          borderBottom={[null, null, '1px solid']}
          borderColor={[null, null, 'gray.500']}
          bg="white"
        >
          <Carousel data={siteOffers} />
        </Box>
        <Box display={['block', 'block', 'none']}>
          <Sidebar type={PAGE_TYPE} />
        </Box>
        <Box display="flex">
          <Box width={280} bg="white" display={['none', 'none', 'block']}>
            <Sidebar type={PAGE_TYPE} />
          </Box>
          <Box
            width={['100%', '100%', 'calc(100% - 280px)']}
            ref={targetRef}
            p={['0px 0px 50px', '0px 0px 50px', '30px 30px 50px']}
          >
            <ProductGrid type={PAGE_TYPE} fetchLimit={16} />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: GET_VENDORS,
    variables: {
      type: PAGE_TYPE,
      offset: 0,
      limit: 15,
    },
  });
  await apolloClient.query({
    query: GET_CATEGORIES,
    variables: {
      type: PAGE_TYPE,
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    revalidate: 1,
  };
};

export default HomePage;
