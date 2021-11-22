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
