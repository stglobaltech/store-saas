import React from "react";
import { useNotifier } from "react-headless-notifier";
import { useMutation } from "@apollo/client";
import { useCart } from "contexts/cart/use-cart";
import { Counter } from "components/counter/counter";
import { CloseIcon } from "assets/icons/CloseIcon";
import { CURRENCY } from "utils/constant";
import { M_UPDATE_PRODUCT_QUANTITY } from "graphql/mutation/update-product-quantity.mutation";
import SuccessNotification from "../../components/Notification/SuccessNotification";
import DangerNotification from "../../components/Notification/DangerNotification";
import {
  ItemBox,
  Image,
  Information,
  Name,
  Price,
  Weight,
  Total,
  RemoveButton,
} from "./cart-item.style";
import { ERROR_CART_DELETED } from "../../utils/constant";
import Loader from "components/loader/loader";
interface Props {
  data: any;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
}

export const CartItem: React.FC<Props> = ({
  data,
  onDecrement,
  onIncrement,
  onRemove,
}) => {
  const storeId = process.env.NEXT_PUBLIC_STG_CLIENT_ID;
  const entityId = storeId;
  const { productName, picture, price, salePrice, unit, quantity } = data;
  const displayPrice = salePrice ? salePrice : price.price;
  const {
    addItem,
    removeItem,
    getItem,
    isInCart,
    cartItemsCount,
    getParticularItemCount,
  } = useCart();
  const { notify } = useNotifier();

  const [
    updateProductQuantity,
    { loading: updateProductQuantityLoading },
  ] = useMutation(M_UPDATE_PRODUCT_QUANTITY);

  async function addItemHandler() {
    const itemCountInCart = getParticularItemCount(data._id);
    const currentItem = getItem(data._id);
    try {
      if (currentItem.maxQuantity < itemCountInCart + 1)
        throw new Error(
          `maximum of ${data.maxQuantity} ${data.productName.en} can be added to the cart!`
        );
      const res = (await updateProductQuantity({
        variables: {
          quantityUpdateInput: {
            productId: currentItem.inCartProductId,
            quantity: itemCountInCart + 1,
            entityId: storeId,
          },
        },
      })) as any;
      if (
        res &&
        res.data.updateCartProductQuantity &&
        res.data.updateCartProductQuantity.totalPrice
      ) {
        onIncrement();
      } else {
        throw new Error(`could not add ${data.productName.en} to the cart!`);
      }
    } catch (error) {
      notify(<DangerNotification message={`${error.message}`} dismiss />);
    }
  }

  async function removeItemHandler() {
    const { _id, maxQuantity } = data;
    const itemCountInCart = getParticularItemCount(_id);
    const currentItem = getItem(data._id);
    try {
      const res = await updateProductQuantity({
        variables: {
          quantityUpdateInput: {
            productId: currentItem.inCartProductId,
            quantity: itemCountInCart - 1,
            entityId: storeId,
          },
        },
      });
      if (
        res &&
        res.data.updateCartProductQuantity &&
        res.data.updateCartProductQuantity.totalPrice
      ) {
        onDecrement();
      }
    } catch (error) {
      if (error.message === ERROR_CART_DELETED) {
        removeItem(data);
        notify(
          <SuccessNotification message={`Your cart is empty now!`} dismiss />
        );
      }
    }
  }

  return (
    <ItemBox>
      {!updateProductQuantityLoading ? (
        <Counter
          value={quantity}
          onDecrement={removeItemHandler}
          onIncrement={addItemHandler}
          variant="lightVertical"
        />
      ) : (
        <Loader />
      )}
      <Image src={picture} />
      <Information>
        <Name>{productName.en}</Name>
        <Price>
          {CURRENCY}
          {displayPrice}
        </Price>
        <Weight>
          {quantity} X {unit}
        </Weight>
      </Information>
      <Total>
        {CURRENCY}
        {(quantity * displayPrice).toFixed(2)}
      </Total>
      <RemoveButton onClick={onRemove}>
        <CloseIcon />
      </RemoveButton>
    </ItemBox>
  );
};
