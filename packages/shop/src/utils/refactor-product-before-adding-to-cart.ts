import {
  CHEF_ACCEPTED_ORDER,
  CHEF_CANCELLED_THE_ORDER,
  CHEF_DECLINED_THE_ORDER,
  DRIVER_ACCEPTED_ORDER,
  DRIVER_COLLECTED_ORDER,
  DRIVER_REACHED_STORE,
  DRIVER_STARTED_JOURNEY,
  ORDER_DELIVERED,
  ORDER_READY_BY_CHEF,
  USER_PLACED_ORDER,
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

export function constructEventOrder(event: any) {
  let statusProgressData = [];

  function isInArray(event) {
    return statusProgressData.some((s) => s.description === event.description);
  }

  for (let i = 0; i < event.length; i++) {
    if (event[i].description === USER_PLACED_ORDER.description) {
      !isInArray(event[i]) ? statusProgressData.push(USER_PLACED_ORDER) : {};
    } else if (event[i].description === CHEF_ACCEPTED_ORDER.description) {
      !isInArray(event[i]) ? statusProgressData.push(CHEF_ACCEPTED_ORDER) : {};
    } else if (event[i].description === CHEF_DECLINED_THE_ORDER.description) {
      !isInArray(event[i])
        ? statusProgressData.push(CHEF_DECLINED_THE_ORDER)
        : {};
    } else if (event[i].description === DRIVER_ACCEPTED_ORDER.description) {
      !isInArray(event[i])
        ? statusProgressData.push(DRIVER_ACCEPTED_ORDER)
        : {};
    } else if (event[i].description === ORDER_READY_BY_CHEF.description) {
      !isInArray(event[i]) ? statusProgressData.push(ORDER_READY_BY_CHEF) : {};
    } else if (event[i].description === CHEF_CANCELLED_THE_ORDER.description) {
      !isInArray(event[i])
        ? statusProgressData.push(CHEF_CANCELLED_THE_ORDER)
        : {};
    } else if (event[i].description === DRIVER_REACHED_STORE.description) {
      !isInArray(event[i]) ? statusProgressData.push(DRIVER_REACHED_STORE) : {};
    } else if (event[i].description === DRIVER_COLLECTED_ORDER.description) {
      !isInArray(event[i])
        ? statusProgressData.push(DRIVER_COLLECTED_ORDER)
        : {};
    } else if (event[i].description === DRIVER_STARTED_JOURNEY.description) {
      !isInArray(event[i])
        ? statusProgressData.push(DRIVER_STARTED_JOURNEY)
        : {};
    } else if (event[i].description === ORDER_DELIVERED.description) {
      !isInArray(event[i]) ? statusProgressData.push(ORDER_DELIVERED) : {};
    }
  }

  return [
    statusProgressData,
    statusProgressData[statusProgressData.length - 1],
  ];
}
