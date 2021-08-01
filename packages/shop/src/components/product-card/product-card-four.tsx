import React from 'react';
import Link from 'next/link';
import { AddItemToCart } from 'components/add-item-to-cart';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box } from 'components/box';
import { Text } from 'components/text';

const Card = styled.div({
  backgroundColor: '#fff',
  overflow: 'hidden',
  borderRadius: 6,
  border: '1px solid #f3f3f3',
  display: 'flex',
  flexDirection: 'column',
  transition: '0.3s ease-in-out',
  cursor: 'pointer',

  ':hover': {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-5px)',
  },
});
const ImageWrapper = styled.div({
  height: 290,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1,
  overflow: 'hidden',

  '@media screen and (max-width: 1280px)': {
    height: 250,
  },

  '@media screen and (max-width: 560px)': {
    height: 180,
  },
});

const Image = styled.img({
  maxWidth: '100%',
  maxHeight: '100%',
  height: 'auto',
});
const Discount = styled.div(
  css({
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    backgroundColor: 'primary.regular',
    color: '#fff',
    overflow: 'hidden',
    padding: '0.25rem 0.5rem',
    fontSize: 12,
    borderRadius: 6,
    pointerEvents: 'none',
  })
);
const Title = styled.h2({
  marginBottom: 10,
  color: '#999',
  fontSize: 14,
  fontWeight: 'normal',
});

const PriceWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const Price = styled.span(
  css({
    color: 'text.bold',
    fontSize: 18,
    fontWeight: 'semiBold',
    lineHeight: 1,
  })
);

const SalePrice = styled.span(
  css({
    color: 'text.regular',
    fontSize: 15,
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

interface Props {
  data: any;
}

export const ProductCard = ({ data }: Props) => {
  const { title, image, price, salePrice, slug, discountInPercent } = data;
  return (
    <Link href='/products/[slug]' as={`/products/${slug}`}>
      <Card>
        <ImageWrapper>
          <Image src={image} alt={title} />
          {discountInPercent ? <Discount>{discountInPercent}%</Discount> : null}
        </ImageWrapper>
        <Box padding={30}>
          <Title>{title}</Title>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <PriceWrapper>
              <Price>${salePrice ? salePrice : price}</Price>
              {discountInPercent ? <SalePrice>${price}</SalePrice> : null}
            </PriceWrapper>

            <AddItemToCart data={data} />
          </Box>
        </Box>
      </Card>
    </Link>
  );
};
