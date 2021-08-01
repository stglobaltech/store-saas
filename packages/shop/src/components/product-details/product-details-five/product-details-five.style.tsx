import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';

export const ProductDetailsWrapper = styled.div`
  background-color: ${themeGet('colors.white', '#ffffff')};
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }
`;

export const ProductPreview = styled.div`
  width: 50%;
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    display: block;
    max-width: 100%;
    max-height: 450px;
    height: auto;
  }

  @media (max-width: 990px) {
    padding: 30px 40px 60px;
  }
  @media (max-width: 767px) {
    flex: 0 0 100%;
    max-width: 100%;
    padding: 30px 25px 60px;
    order: 0;
  }
`;

export const BackButton = styled.div`
  position: absolute;
  top: 60px;
  left: 60px;
  z-index: 999;

  @media (max-width: 990px) {
    top: 20px;
    left: 25px;
  }
  .reusecore__button {
    font-family: ${themeGet('fonts.body', 'sans-serif')};
    font-size: ${themeGet('fontSizes.sm', '13')}px;
    font-weight: ${themeGet('fontWeights.bold', '700')};
    color: ${themeGet('colors.text.regular', '#77798C')};
    height: 30px;
    .btn-icon {
      margin-right: 5px;
    }
    .btn-text {
      padding: 0;
    }
  }
`;

export const ProductInfo = styled.div`
  width: 50%;
  border-left: 1px solid ${themeGet('colors.gray.500', '#f1f1f1')};
  padding: 55px 60px;

  @media (max-width: 990px) {
    padding: 30px 40px;
  }
  @media (max-width: 767px) {
    flex: 0 0 100%;
    max-width: 100%;
    padding: 30px 25px;
    border: 0;
    order: 1;
  }
`;

export const SaleTag = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${themeGet('colors.white', '#ffffff')};
  background-color: ${themeGet('colors.yellow.alternate', '#f4c243')};
  padding: 0 10px;
  line-height: 24px;
  border-radius: ${themeGet('radii.medium', '12px')};
  display: inline-block;
  position: absolute;
  top: 20px;
  right: 20px;
`;

export const DiscountPercent = styled.span`
  font-size: ${themeGet('fontSizes.xs', '12')}px;
  font-weight: ${themeGet('fontWeights.bold', '700')};
  color: ${themeGet('colors.white', '#ffffff')};
  line-height: 24px;
  background-color: ${themeGet('colors.secondary.regular', '#ff5b60')};
  padding-left: 20px;
  padding-right: 15px;
  position: relative;
  display: inline-block;
  position: absolute;
  bottom: 180px;
  right: -60px;
  -webkit-transform: translate3d(0, 0, 1px);
  transform: translate3d(0, 0, 1px);

  &:before {
    content: '';
    position: absolute;
    left: -8px;
    top: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 8px 12px 0;
    border-color: transparent ${themeGet('colors.secondary.regular', '#ff5b60')}
      transparent transparent;
  }

  &:after {
    content: '';
    position: absolute;
    left: -8px;
    bottom: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 12px 8px;
    border-color: transparent transparent
      ${themeGet('colors.secondary.regular', '#ff5b60')} transparent;
  }
`;

export const ProductTitlePriceWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 10px;
`;

export const ProductTitle = styled.h1`
  font-family: ${themeGet('fonts.body', 'sans-serif')};
  font-size: ${themeGet('fontSizes.2xl', '30')}px;
  font-weight: ${themeGet('fontWeights.semiBold', '600')};
  color: ${themeGet('colors.text.bold', '#0D1136')};
  line-height: 1.5;
  display: flex;

  @media (max-width: 767px) {
    word-break: break-word;
  }
`;

export const ProductPriceWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const ProductPrice = styled.div`
  font-family: ${themeGet('fonts.body', 'sans-serif')};
  font-size: calc(${themeGet('fontSizes.lg', '21')}px - 1px);
  font-weight: ${themeGet('fontWeights.bold', '700')};
  color: ${themeGet('colors.text.bold', '#0D1136')};
`;

export const SalePrice = styled.span`
  font-family: ${themeGet('fonts.body', 'sans-serif')};
  font-size: calc(${themeGet('fontSizes.base', '15')}px + 1px);
  font-weight: ${themeGet('fontWeights.regular', '400')};
  color: ${themeGet('colors.text.regular', '#77798C')};
  padding: 0 5px;
  overflow: hidden;
  position: relative;
  margin-left: 10px;

  &:before {
    content: '';
    width: 100%;
    height: 1px;
    display: inline-block;
    background-color: ${themeGet('colors.text.regular', '#77798C')};
    position: absolute;
    top: 50%;
    left: 0;
  }
`;

export const ProductWeight = styled.div`
  font-family: ${themeGet('fonts.body', 'sans-serif')};
  font-size: ${themeGet('fontSizes.sm', '13')}px;
  font-weight: ${themeGet('fontWeights.regular', '400')};
  color: ${themeGet('colors.text.regular', '#77798C')};
`;

export const ProductDescription = styled.p`
  font-family: ${themeGet('fonts.body', 'sans-serif')};
  font-size: calc(${themeGet('fontSizes.base', '15')}px + 1px);
  font-weight: ${themeGet('fontWeights.regular', '400')};
  color: ${themeGet('colors.text.medium', '#424561')};
  line-height: 2;
  margin-top: 30px;
`;

export const ProductCartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 60px;
  @media (max-width: 767px) {
    margin-top: 40px;
  }
`;

export const ProductCartBtn = styled.div`
  .card-counter {
    height: 48px;
    width: 130px;

    .control-button {
      padding: 10px 15px;
    }
  }

  .cart-button {
    padding-left: 30px;
    padding-right: 30px;

    .btn-icon {
      margin-right: 5px;

      svg {
        width: 14px;
        height: auto;
        @media (max-width: 990px) {
          width: 14px;
          margin-right: 8px;
        }
      }
    }
  }
  .quantity {
    width: 115px;
    height: 38px;
  }
`;

export const ButtonText = styled.span`
  /* @media (max-width: 767px) {
    display: none;
  } */
`;

export const ProductMeta = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: flex-start;

  @media (max-width: 767px) {
    margin-top: 40px;
  }
`;

export const MetaTitle = styled.span`
  font-family: ${themeGet('fonts.body', 'sans-serif')};
  font-size: calc(${themeGet('fontSizes.base', '15')}px + 1px);
  font-weight: ${themeGet('fontWeights.regular', '400')};
  color: ${themeGet('colors.text.regular', '#77798C')};
  flex-shrink: 0;
`;

export const MetaItem = styled.span`
  font-family: ${themeGet('fonts.body', 'sans-serif')};
  font-size: calc(${themeGet('fontSizes.base', '15')}px + 1px);
  font-weight: ${themeGet('fontWeights.semiBold', '600')};
  color: ${themeGet('colors.text.bold', '#0D1136')};
  margin-right: 3px;
  letter-spacing: 0.3px;

  &:after {
    content: ', ';
  }

  &:hover {
    text-decoration: underline;
  }
`;

export const MetaSingle = styled.p`
  margin-left: 10px;
  display: flex;
  flex-wrap: wrap;

  a {
    &::last-child {
      ${MetaItem} {
        &:after {
          content: '';
        }
      }
    }
  }
`;

export const RelatedItems = styled.div`
  margin-top: 70px;
  margin-left: 30px;
  margin-right: 30px;

  @media (max-width: 990px) {
    margin-top: 50px;
    margin-left: 15px;
    margin-right: 15px;
  }
  > h2 {
    font-family: ${themeGet('fonts.body', 'sans-serif')};
    font-size: ${themeGet('fontSizes.xl', '24')}px;
    font-weight: ${themeGet('fontWeights.semiBold', '600')};
    color: ${themeGet('colors.text.bold', '#0D1136')};
    line-height: 1.2;
    margin-bottom: 30px;
    @media (max-width: 767px) {
      margin-left: 0;
      margin-bottom: 25px;
    }
  }

  > div > div {
    flex: 0 0 20%;
    max-width: 20%;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 30px;

    @media (max-width: 1500px) {
      flex: 0 0 20%;
      max-width: 20%;
    }
    @media (max-width: 1400px) {
      flex: 0 0 25%;
      max-width: 25%;
    }
    @media (max-width: 1060px) {
      flex: 0 0 33.3333333%;
      max-width: 33.3333333%;
    }
    @media (max-width: 1199px) and (min-width: 991px) {
      padding-left: 10px;
      padding-right: 10px;
    }
    @media (max-width: 768px) {
      padding-left: 7.5px;
      padding-right: 7.5px;
      margin-bottom: 15px;
    }
    @media (max-width: 767px) {
      flex: 0 0 50%;
      max-width: 50%;
    }
  }
`;
