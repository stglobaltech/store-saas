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
    picture:product.picture
  };
}

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
    price: { price: product.price },
  };
}

// inCartProductId: "6197999de25ba8002b82f4cb"
// maxQuantity: 15
// picture: "https://restaurant-stg.s3.ap-south-1.amazonaws.com/product-pic/product-pic-1632486889167.jpg"
// price: {__typename: "PriceOutput", price: 100, basePrice: 95}
// productName: {en: "Chicken Briyani", ar: "برياني دجاج"}
// quantity: 1
// _id: "614dc5eb5daa5e4e6f0ea92d"
