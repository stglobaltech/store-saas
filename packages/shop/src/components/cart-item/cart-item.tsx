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
import { ERROR_CART_DELETED, ERROR_CART_EMPTY } from "../../utils/constant";
import Loader from "components/loader/loader";
import { M_REMOVE_PRODUCT_FROM_CART } from "graphql/mutation/remove-product-from-cart.mutation";
import { useAppState } from "contexts/app/app.provider";
import { getCartId } from "utils/localStorage";
import { handlePrevOrderPending } from "components/prev-order-pending/handleprevorderpending";
import { useIntl } from 'react-intl';
import { useLocale } from 'contexts/language/language.provider';

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
  const intl = useIntl();
  const locale = useLocale();
  const workFlowPolicy=useAppState("workFlowPolicy") as any;
  const storeId =useAppState("activeStoreId");
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

  const [
    removeProductFromCart,
    { loading: removeProductFromCartLoading },
  ] = useMutation(M_REMOVE_PRODUCT_FROM_CART);

  async function addItemHandler() {
    const itemCountInCart = getParticularItemCount(data._id);
    const currentItem = getItem(data._id);
    // if(getCartId()){
    //   return handlePrevOrderPending();
    // }
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

  async function removeItemHandler(removeAllFromCart: boolean) {
    const { _id, maxQuantity } = data;
    const itemCountInCart = getParticularItemCount(_id);
    const currentItem = getItem(data._id);
    try {
      const res = await updateProductQuantity({
        variables: {
          quantityUpdateInput: {
            productId: currentItem.inCartProductId,
            quantity: !removeAllFromCart ? itemCountInCart - 1 : 0,
            entityId: storeId,
          },
        },
      });
      if (
        res &&
        res.data.updateCartProductQuantity &&
        res.data.updateCartProductQuantity.totalPrice
      ) {
        removeAllFromCart?onRemove():onDecrement();
      }
    } catch (error) {
      if (error.message === ERROR_CART_DELETED) {
        onRemove();
        notify(
          <SuccessNotification
            message={intl.formatMessage({
              id: 'errorCartEmpty',
              defaultMessage: ERROR_CART_EMPTY,
            })}
            dismiss
          />
        );
      }
    }
  }

  return (
    <ItemBox>
      {!updateProductQuantityLoading ? (
        <Counter
          value={quantity}
          onDecrement={() => removeItemHandler(false)}
          onIncrement={addItemHandler}
          variant="lightVertical"
        />
      ) : (
        <Loader />
      )}
      <Image src={picture} />
      <Information>
        <Name>{locale === 'en' ? productName.en : productName.ar}</Name>
        <Price>
          {workFlowPolicy.currency}{" "}
          {displayPrice}
        </Price>
        <Weight>
          {quantity} X {unit}
        </Weight>
      </Information>
      <Total>
        {workFlowPolicy.currency}{" "}
        {(quantity * displayPrice).toFixed(2)}
      </Total>
      {!removeProductFromCartLoading ? (
        <RemoveButton onClick={() => removeItemHandler(true)}>
          <CloseIcon />
        </RemoveButton>
      ) : (
        <Loader />
      )}
    </ItemBox>
  );
};
