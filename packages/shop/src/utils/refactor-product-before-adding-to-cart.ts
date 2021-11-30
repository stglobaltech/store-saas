import {
  OH_CANCELLED,
  OH_CONF,
  OH_EXP,
  OH_FINISHED,
  OH_PENDING,
  OH_REJECTED,
  PENDING,
  STORE_ACCEPTED,
  STORE_CANCELLED_ORDER,
  STORE_ORDER_READY,
  STORE_REJECTED_ORDER,
} from "./constant";

export function refactorProductbeforeAddingToCart(product) {
  return {
    inCartProductId: product.productId,
    _id: product._id,
    productName: {
      en:
        product && product.productName
          ? product.productName.en
          : product.name.en,
      ar:
        product && product.productName
          ? product.productName.ar
          : product.name.ar,
    },
    quantity: product.quantity,
    maxQuantity: product.maxQuantity,
    price: product.price,
    picture: product.picture,
  };
}

//incartProductId is the _id of the product in the products array of getCart response
export function refactorGetCartDataBeforeAddingToCart(product) {
  return {
    inCartProductId: product._id,
    _id: product.productId,
    productName: {
      en:
        product && product.productName
          ? product.productName.en
          : product.name.en,
      ar:
        product && product.productName
          ? product.productName.ar
          : product.name.ar,
    },
    quantity: product.quantity,
    maxQuantity: product.maxQuantity,
    price: { price: Math.floor(product.price / product.quantity) },
  };
}

export function refactorStoreStatus(storeStatus) {
  switch (storeStatus) {
    case "PEN":
      return PENDING;
    case "ACC":
      return STORE_ACCEPTED;
    case "DEC":
      return STORE_REJECTED_ORDER;
    case "READY":
      return STORE_ORDER_READY;
    case "CAN":
      return STORE_CANCELLED_ORDER;
    default:
      return PENDING;
  }
}

//for order history
export function refactorOrderHistoryStatus(status) {
  switch (status) {
    case "PEN":
      return OH_PENDING;
    case "CONF":
      return OH_CONF;
    case "EXP":
      return OH_EXP;
    case "FIN":
      return OH_FINISHED;
    case "CAN":
      return OH_CANCELLED;
    case "REJ":
      return OH_REJECTED;
  }
}
