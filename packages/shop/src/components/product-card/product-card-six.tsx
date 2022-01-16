import React from "react";
import Link from "next/link";
import { AddItemToCart } from "components/add-item-to-cart";
import styled from "styled-components";
import css from "@styled-system/css";
import { Box } from "components/box";
import noImage from "assets/images/no_image.jpg";
import { useLocale } from "contexts/language/language.provider";

const Card = styled.div({
  backgroundColor: "#fff",
  position: "relative",
  overflow: "hidden",
  borderRadius: 6,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  border: "0",
  cursor: "pointer",
  transition: "0.25s ease-in-out",
  "&:hover": {
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
    transform: "translateY(-5px)",
  },
});


const ImageWrapper = styled.div(
  css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // height: ["190px", "210px"],
    height: '200px',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    img: {
      // display: "block",
      // maxHeight: "100%",
      // maxWidth: "100%",
      // width: "auto",
      // height: "auto",
      flexShrink: 0,
      minWidth: '100%',
      minHeight: '200px',
    },
  })
);
const Discount = styled.div<any>(
  css({
    position: "absolute",
    zIndex: 1,
    top: "10px",
    left: "10px",
    backgroundColor: "primary.regular",
    color: "#fff",
    overflow: "hidden",
    padding: "0.25rem 0.5rem",
    fontSize: 12,
    borderRadius: 6,
    pointerEvents: "none",
  })
);

const CounterWrapper = styled.div<any>(
  css({
    position: "absolute",
    zIndex: 1,
    top: "10px",
    right: "10px",
  })
);

const PriceWrapper = styled.div({
  display: "flex",
  alignItems: "center",
  marginBottom: 10,
});

const Price = styled.span(
  css({
    display: "block",
    color: "text.bold",
    fontSize: 16,
    fontWeight: "semiBold",
  })
);

const SalePrice = styled.span(
  css({
    color: "text.regular",
    fontSize: 13,
    lineHeight: 1,
    fontWeight: "regular",
    padding: "0 5px",
    overflow: "hidden",
    position: "relative",
    marginLeft: 10,
    display: "flex",
    alignItems: "center",

    ":before": {
      content: '""',
      width: "100%",
      height: 1,
      display: "inline-block",
      backgroundColor: "text.regular",
      position: "absolute",
      top: "50%",
      left: 0,
    },
  })
);

const Title = styled.h2(
  css({
    color: "text.regular",
    fontSize: "sm",
    fontWeight: "regular",
  })
);

interface Props {
  data: any;
  currency: string;
}

export const ProductCard = ({ data, currency }: Props) => {
  const {
    picture,
    price: { price, basePrice },
    productName,
    description,
    _id,
  } = data;

  const { isRtl } = useLocale();

  return (
    <Link href="/product/[slug]" as={`/product/${_id}`}>
      <Card>
        <Box position="relative">
          <CounterWrapper>
            <AddItemToCart data={data} />
          </CounterWrapper>
          <ImageWrapper>
            <img
              src={picture?.length ? picture : noImage}
              alt={productName.en}
            />
          </ImageWrapper>
          {/* {discountInPercent ? <Discount>{discountInPercent}%</Discount> : null} */}
        </Box>
        <Box padding={20}>
          <PriceWrapper>
            <Price>{currency + " " + price}</Price>
            {/* <SalePrice>{basePrice}</SalePrice> */}
          </PriceWrapper>
          <Title>{!isRtl ? productName.en : productName?.ar}</Title>
        </Box>
      </Card>
    </Link>
  );
};
