import React from 'react';
import { ProductCard } from 'components/product-card/product-card-seven';
import styled from 'styled-components';
import css from '@styled-system/css';
import ErrorMessage from 'components/error-message/error-message';
import { useQuery, NetworkStatus } from '@apollo/client';
import { GET_PRODUCTS } from 'graphql/query/products.query';
import { useRouter } from 'next/router';
import { Button } from 'components/button/loadmore-button';
import { FormattedMessage } from 'react-intl';
import { Box } from 'components/box';
import NoResultFound from 'components/no-result/no-result';
import { LoaderItem, LoaderWrapper } from './product-list/product-list.style';
import Placeholder from 'components/placeholder/placeholder';

const Grid = styled.div(
  css({
    display: 'grid',
    gridGap: '10px',
    gridTemplateColumns: 'repeat(2, minmax(180px, 1fr))',

    '@media screen and (min-width: 630px)': {
      gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))',
    },

    '@media screen and (min-width: 768px)': {
      gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))',
    },

    '@media screen and (min-width: 991px)': {
      gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))',
    },

    '@media screen and (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))',
    },

    '@media screen and (min-width: 1700px)': {
      gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))',
    },

    '@media screen and (min-width: 1900px)': {
      gridTemplateColumns: 'repeat(6, minmax(240px, 1fr))',
    },
  })
);

interface Props {
  type: string;
  loadMore?: boolean;
  fetchLimit?: number;
  style?: any;
}

export const ProductGrid = ({
  style,
  type,
  loadMore = true,
  fetchLimit = 16,
}: Props) => {
  const router = useRouter();
  const { data, error, loading, fetchMore, networkStatus } = useQuery(
    GET_PRODUCTS,
    {
      variables: {
        type,
        text: router.query.text,
        category: router.query.category,
        offset: 0,
        limit: fetchLimit,
      },
      notifyOnNetworkStatusChange: true,
    }
  );
  const loadingMore = networkStatus === NetworkStatus.fetchMore;
  if (error) return <ErrorMessage message={error.message} />;
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
  if (!data || !data.products || data.products.items.length === 0) {
    return <NoResultFound />;
  }
  const handleLoadMore = () => {
    fetchMore({
      variables: {
        offset: Number(data.products.items.length),
        limit: 10,
      },
    });
  };
  const { items, hasMore } = data.products;
  return (
    <section>
      <Grid style={style}>
        {items.map((product, idx) => (
          <ProductCard data={product} key={product.id} />
        ))}
      </Grid>

      {loadMore && hasMore && (
        <Box style={{ textAlign: 'center' }} mt={'2rem'}>
          <Button
            onClick={handleLoadMore}
            loading={loadingMore}
            variant="secondary"
            style={{
              fontSize: 14,
              display: 'inline-flex',
            }}
            border="1px solid #f1f1f1"
          >
            <FormattedMessage id="loadMoreButton" defaultMessage="Load More" />
          </Button>
        </Box>
      )}
    </section>
  );
};
