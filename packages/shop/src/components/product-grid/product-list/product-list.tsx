import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  ProductsRow,
  ProductsCol,
  ButtonWrapper,
  LoaderWrapper,
  LoaderItem,
  ProductCardWrapper,
} from "./product-list.style";
import { CURRENCY } from "utils/constant";
import { useQuery, NetworkStatus } from "@apollo/client";
import Placeholder from "components/placeholder/placeholder";
import Fade from "react-reveal/Fade";
import NoResultFound from "components/no-result/no-result";
import { FormattedMessage } from "react-intl";
import { Button } from "components/button/loadmore-button";
import { GET_PRODUCTS } from "graphql/query/products.query";

const ErrorMessage = dynamic(
  () => import("components/error-message/error-message")
);

const GeneralCard = dynamic(
  import("components/product-card/product-card-one/product-card-one")
);

type ProductsProps = {
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
  fetchLimit?: number;
  loadMore?: boolean;
  type?: string;
};
export const Products: React.FC<ProductsProps> = ({
  deviceType,
  fetchLimit = 20,
  loadMore = true,
  type,
}) => {
  const router = useRouter();
  const { data, error, loading, fetchMore, networkStatus } = useQuery(
    GET_PRODUCTS,
    {
      // context: { linkName: 'auth' },
      variables: {
        userStoreProductsFindInputDto: {
          storeId: process.env.NEXT_PUBLIC_STG_CLIENT_ID,
          paginate: {
            page: 1,
            perPage: 10,
          },
        },
      },
      notifyOnNetworkStatusChange: true,
    }
  );
  const loadingMore = networkStatus === NetworkStatus.fetchMore;

  if (error)
    return (
      <ErrorMessage>
        <FormattedMessage id="error" defaultMessage={error.message} />
      </ErrorMessage>
    );
  if (loading && !loadingMore) {
    return (
      <LoaderWrapper>
        <LoaderItem>
          <Placeholder uniqueKey="1" />
        </LoaderItem>
        <LoaderItem>
          <Placeholder uniqueKey="2" />
        </LoaderItem>
        <LoaderItem>
          <Placeholder uniqueKey="3" />
        </LoaderItem>
      </LoaderWrapper>
    );
  }

  if (!data?.getStoreProductsForUser?.products?.length) {
    return <NoResultFound />;
  }

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        offset: Number(data.products.items.length),
        limit: fetchLimit,
      },
    });
  };

  const renderCard = (props) => {
    return (
      <GeneralCard
        title={props.productName.en}
        description={props.description.en}
        image={props.picture}
        weight="props.unit"
        currency={CURRENCY}
        price={props.price.price}
        salePrice={props.price.price}
        discountInPercent={props.price.price}
        data={props}
        deviceType={deviceType}
      />
    );
  };

  return (
    <>
      <ProductsRow>
        {data.getStoreProductsForUser.products.map(
          (product: any, index: number) => (
            <ProductsCol
              key={index}
              style={type === "book" ? { paddingLeft: 0, paddingRight: 1 } : {}}
            >
              <ProductCardWrapper>
                <Fade
                  duration={800}
                  delay={index * 10}
                  style={{ height: "100%" }}
                >
                  {renderCard(product)}
                </Fade>
              </ProductCardWrapper>
            </ProductsCol>
          )
        )}
      </ProductsRow>
      {loadMore && data.getStoreProductsForUser.pagination.hasNextPage && (
        <ButtonWrapper>
          <Button
            onClick={handleLoadMore}
            loading={loadingMore}
            variant="secondary"
            style={{
              fontSize: 14,
            }}
            border="1px solid #f1f1f1"
          >
            <FormattedMessage id="loadMoreButton" defaultMessage="Load More" />
          </Button>
        </ButtonWrapper>
      )}
    </>
  );
};
export default Products;
