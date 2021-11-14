export function refactorProductbeforeAddingToCart(product) {
  return {
    inCartProductId: product.productId,
    _id: product._id,
    productName: {
      en: product.productName.en,
      ar: product.productName.ar,
    },
    quantity: product.quantity,
    maxQuantity: product.maxQuantity,
    price: product.price,
    picture: product.picture,
  };
}
