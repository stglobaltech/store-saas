import { gql } from "@apollo/client";

export const Q_GET_DISCOUNTS = gql`
  query getDiscounts($getDiscountsInputDto: GetAllDiscountsInputDto!) {
    getDiscounts(getDiscountsInputDto: $getDiscountsInputDto) {
      discounts {
        _id
        name
        arName
        startsOn
        endsOn
        category
        discountIn
        discountFor
        discountType
        discountToEntities {
          store {
            bannerURL
          }
        }
        discountValue
        discountUnit
        maximumValue
      }
      pagination {
        hasPrevPage
        hasNextPage
        perPage
        page
      }
    }
  }
`;
