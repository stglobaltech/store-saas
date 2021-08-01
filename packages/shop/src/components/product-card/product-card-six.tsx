import React from 'react';
import Link from 'next/link';
import { AddItemToCart } from 'components/add-item-to-cart';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box } from 'components/box';

const Card = styled.div({
  backgroundColor: '#fff',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 6,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  border: '0',
  cursor: 'pointer',
  transition: '0.25s ease-in-out',
  '&:hover': {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-5px)',
  },
});
const ImageWrapper = styled.div(
  css({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    height: ['190px', '210px'],

    img: {
      display: 'block',
      maxHeight: '100%',
      maxWidth: '100%',
      width: 'auto',
      height: 'auto',
    },
  })
);
const Discount = styled.div<any>(
  css({
    position: 'absolute',
    zIndex: 1,
    top: '10px',
    left: '10px',
    backgroundColor: 'primary.regular',
    color: '#fff',
    overflow: 'hidden',
    padding: '0.25rem 0.5rem',
    fontSize: 12,
    borderRadius: 6,
    pointerEvents: 'none',
  })
);

const CounterWrapper = styled.div<any>(
  css({
    position: 'absolute',
    zIndex: 1,
    top: '10px',
    right: '10px',
  })
);

const PriceWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 10,
});

const Price = styled.span(
  css({
    display: 'block',
    color: 'text.bold',
    fontSize: 16,
    fontWeight: 'semiBold',
  })
);

const SalePrice = styled.span(
  css({
    color: 'text.regular',
    fontSize: 13,
    lineHeight: 1,
    fontWeight: 'regular',
    padding: '0 5px',
    overflow: 'hidden',
    position: 'relative',
    marginLeft: 10,
    display: 'flex',
    alignItems: 'center',

    ':before': {
      content: '""',
      width: '100%',
      height: 1,
      display: 'inline-block',
      backgroundColor: 'text.regular',
      position: 'absolute',
      top: '50%',
      left: 0,
    },
  })
);

const Title = styled.h2(
  css({
    color: 'text.regular',
    fontSize: 'sm',
    fontWeight: 'regular',
  })
);

interface Props {
  data: any;
}

export const ProductCard = ({ data }: Props) => {
  const { title, image, price, salePrice, slug, discountInPercent } = data;
  return (
    <Link href='/products/[slug]' as={`/products/${slug}`}>
      <Card>
        <Box position='relative'>
          <CounterWrapper>
            <AddItemToCart data={data} />
          </CounterWrapper>
          <ImageWrapper>
            <img src={image} alt={title} />
          </ImageWrapper>
          {discountInPercent ? <Discount>{discountInPercent}%</Discount> : null}
        </Box>
        <Box padding={20}>
          <PriceWrapper>
            <Price>${salePrice ? salePrice : price}</Price>
            {discountInPercent ? <SalePrice>${price}</SalePrice> : null}
          </PriceWrapper>
          <Title>{title}</Title>
        </Box>
      </Card>
    </Link>
  );
};
