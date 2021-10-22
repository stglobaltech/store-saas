import { gql } from "@apollo/client";

export const Q_GET_RESTAURANT = gql`
  query ($ownerId: String!) {
    getStore(ownerId: $ownerId) {
      _id
      name {
        en
        ar
      }
      description {
        en
        ar
      }
      branchCode
      ownerId
      isRestaurantAdmin
      parentId
      logo
      picture
      address
      displayName {
        en
        ar
      }
      categoryIds
      branchCode
      picture
      logo
      ownerId
      status
      countryCode
      contactNumber
      storeLoc {
        coordinates
        type
      }
      deliveryCharges {
        baseCharge
        baseChargeDistance
        chargesPerKm
      }
      minimumOrderCost
      domain
      url
    }
  }
`;

export const Q_GET_RESTAURANT_ID = gql`
  query ($ownerId: String!) {
    getStore(ownerId: $ownerId) {
      _id
      ownerId
      parentId
      name {
        en
        ar
      }
    }
  }
`;
