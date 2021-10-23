import { GetStaticProps } from "next";
import styled from "styled-components";
import css from "@styled-system/css";
import { Modal } from "@redq/reuse-modal";
import { MobileBanner } from "components/banner/mobile-banner";
import { Banner } from "components/banner/banner";
import { sitePages } from "site-settings/site-pages";
import { initializeApollo } from "utils/apollo";
import { useAppDispatch } from "contexts/app/app.provider";
import { GET_CATEGORIES } from "graphql/query/category.query";
import { Box } from "components/box";
import { HorizontalCategoryCardMenu } from "layouts/horizontal-category-menu/horizontal-category-card-menu";
import { ProductGrid } from "components/product-grid/product-grid-two";
import CartPopUp from "features/carts/cart-popup";

const PAGE_TYPE = "categories";

export const Main = styled.div<any>(
  css({
    backgroundColor: "gray.200",
    position: "relative",
  })
);

export default function Categories({ storeId,deviceType }) {
  const page = sitePages[PAGE_TYPE];
  return (
    <Modal>
      <MobileBanner intlTitleId={page.banner_title_id} type={PAGE_TYPE} />
      <Banner
        intlTitleId={page?.banner_title_id}
        intlDescriptionId={page?.banner_description_id}
        imageUrl={page?.banner_image_url}
        style={{ maxHeight: 560 }}
      />
      <Main>
        <HorizontalCategoryCardMenu type={storeId} />
        <Box padding={["0 15px 100px ", "0 15px 30px ", "0 30px 30px"]}>
          <ProductGrid type={storeId} />
        </Box>
        <CartPopUp deviceType={deviceType}/>
      </Main>
    </Modal>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const storeId = process.env.NEXT_PUBLIC_STG_CLIENT_ID;
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: GET_CATEGORIES,
    variables: {
      storeId: storeId,
    },
  });
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      storeId: storeId,
    },
    revalidate: 1,
  };
};
