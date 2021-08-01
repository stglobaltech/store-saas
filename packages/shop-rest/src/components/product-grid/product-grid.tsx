import React, { useState } from 'react';
import { ProductCard } from 'components/product-card/product-card-seven';
import styled from 'styled-components';
import css from '@styled-system/css';
import ErrorMessage from 'components/error-message/error-message';
// import { useQuery, NetworkStatus } from '@apollo/client';
// import { GET_PRODUCTS } from 'graphql/query/products.query';
import { useRouter } from 'next/router';
import { Button } from 'components/button/loadmore-button';
import { FormattedMessage } from 'react-intl';
import { Box } from 'components/box';
import useProducts from 'data/use-products';

// import { Button } from './button';

const Grid = styled.div(
  css({
    display: 'grid',
    gridGap: '10px',
    gridTemplateColumns: 'repeat(1, minmax(180px, 1fr))',

    '@media screen and (min-width: 440px)': {
      gridTemplateColumns: 'repeat(2, minmax(180px, 1fr))',
    },

    '@media screen and (min-width: 768px)': {
      gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))',
      gridGap: '20px',
    },

    '@media screen and (min-width: 991px)': {
      gridTemplateColumns: 'repeat(2, minmax(180px, 1fr))',
      gridGap: '30px',
    },

    '@media screen and (min-width: 1100px)': {
      gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))',
    },

    '@media screen and (min-width: 1700px)': {
      gridTemplateColumns: 'repeat(4, minmax(240px, 1fr))',
    },

    '@media screen and (min-width: 2200px)': {
      gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))',
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
  const [loading, setLoading] = useState(false);
  const { data, error } = useProducts({
    type,
    text: router.query.text,
    category: router.query.category,
    offset: 0,
    limit: fetchLimit,
  });

  if (error) return <ErrorMessage message={error.message} />;
  if (!data) return null;
  const handleLoadMore = async () => {
    setLoading(true);
    // await fetchMore(Number(data.length), fetchLimit);
    setLoading(false);
  };
  // const { items, hasMore } = data.products;
  return (
    <section>
      <Grid style={style}>
        {data.map((product, idx) => (
          <ProductCard data={product} key={product.id} />
        ))}
      </Grid>

      {loadMore && data?.hasMore && (
        <Box style={{ textAlign: 'center' }} mt={'2rem'}>
          <Button
            onClick={handleLoadMore}
            loading={loading}
            variant='secondary'
            style={{
              fontSize: 14,
              display: 'inline-flex',
            }}
            border='1px solid #f1f1f1'
          >
            <FormattedMessage id='loadMoreButton' defaultMessage='Load More' />
          </Button>
        </Box>
      )}
    </section>
  );
};
