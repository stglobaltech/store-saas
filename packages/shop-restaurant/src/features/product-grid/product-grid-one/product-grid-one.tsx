import React from 'react';
import { useRouter } from 'next/router';
import FoodCard from 'components/product-card/product-card-one/product-card-one';
import {
  ProductsRow,
  ProductsCol,
  ButtonWrapper,
  LoaderWrapper,
  LoaderItem,
  ProductCardWrapper,
} from './product-list.style';
import { useQuery, NetworkStatus } from '@apollo/client';
import { Button } from 'components/button/button';
import Placeholder from 'components/placeholder/placeholder';
import NoResultFound from 'components/no-result/no-result';
import { customerDistance } from 'utils/customer-distance';
import { formatTime } from 'utils/format-time';
import { FormattedMessage } from 'react-intl';
import { GET_VENDORS } from 'utils/graphql/query/vendors.query';

type ProductGridProps = {
  type: string;
  fetchLimit?: number;
  loadMore?: boolean;
};
export const ProductGrid: React.FC<ProductGridProps> = ({
  type,
  fetchLimit = 8,
  loadMore = true,
}) => {
  const router = useRouter();
  const { data, error, loading, fetchMore, networkStatus } = useQuery(
    GET_VENDORS,
    {
      variables: {
        type: type,
        text: router.query.text,
        category: router.query.category,
        offset: 0,
        limit: fetchLimit,
      },
      notifyOnNetworkStatusChange: true,
    }
  );
  const loadingMore = networkStatus === NetworkStatus.fetchMore;

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

  if (error) return <div>{error.message}</div>;
  if (!data || !data.vendors || data.vendors.items.length === 0) {
    return <NoResultFound />;
  }
  const handleLoadMore = () => {
    fetchMore({
      variables: {
        offset: Number(data.vendors.items.length),
        limit: fetchLimit,
      },
    });
  };

  return (
    <>
      <ProductsRow>
        {data?.vendors?.items.map((item: any, index: number) => (
          <ProductsCol key={index} className="food-col">
            <ProductCardWrapper>
              <FoodCard
                name={item.name}
                image={item.thumbnailUrl}
                restaurantType={item?.categories.join(', ')}
                duration={formatTime(customerDistance())}
                delivery={item.deliveryDetails.charge}
                isFree={item.deliveryDetails.isFree}
                discountInPercent={item.promotion}
                data={item}
                onClick={() => router.push('/[slug]', `/${item.slug}`)}
              />
            </ProductCardWrapper>
          </ProductsCol>
        ))}
      </ProductsRow>
      {loadMore && data.vendors.hasMore && (
        <ButtonWrapper>
          <Button
            onClick={handleLoadMore}
            loading={loadingMore}
            variant="secondary"
            border="1px solid #f1f1f1"
          >
            <FormattedMessage id="loadMoreButton" defaultMessage="Load More" />
          </Button>
        </ButtonWrapper>
      )}
    </>
  );
};
export default ProductGrid;
