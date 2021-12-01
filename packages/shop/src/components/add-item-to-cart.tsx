import React from "react";
import styled from "styled-components";
import css from "@styled-system/css";
import { openModal } from "@redq/reuse-modal";
import { useNotifier } from "react-headless-notifier";
import { M_ADD_PRODUCT_TO_CART } from "graphql/mutation/add-product-to-cart.mutation";
import AuthenticationForm from "features/authentication-form";
import { useCart } from "contexts/cart/use-cart";
import { AuthContext } from "contexts/auth/auth.context";
import { Counter } from "./counter/counter";
import { variant as _variant } from "styled-system";
import { Box } from "./box";
import { useMutation } from "@apollo/client";
import { M_UPDATE_PRODUCT_QUANTITY } from "graphql/mutation/update-product-quantity.mutation";
import SuccessNotification from "../components/Notification/SuccessNotification";
import DangerNotification from "../components/Notification/DangerNotification";
import Loader from "./loader/loader";
import {ERROR_CART_DELETED} from '../utils/constant';

const Icon = styled.span<any>(
  _variant({
    variants: {
      full: {
        px: 3,
        height: 36,
        backgroundColor: "#e6e6e6",
        display: "flex",
        transition: "0.35s ease-in-out",
        alignItems: "center",
      },
    },
  })
);
const Button = styled.button<any>(
  css({
    width: 36,
    height: 36,
    borderRadius: 6,
    transition: "0.35s ease-in-out",
    backgroundColor: "#fff",
    border: "1px solid",
    borderColor: "#e6e6e6",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "primary.regular",
      borderColor: "primary.regular",
      color: "#fff",
    },
  }),
  _variant({
    variants: {
      full: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f3f3f3",
        padding: 0,
        border: "none",
        overflow: "hidden",
        ":hover": {
          backgroundColor: "primary.hover",
          borderColor: "primary.hover",
          color: "#fff",
          [Icon]: {
            backgroundColor: "primary.regular",
            color: "#fff",
          },
        },
      },
    },
  })
);

interface Props {
  data: any;
  variant?: string;
  buttonText?: string;
}

export const AddItemToCart = ({ data, variant, buttonText }: Props) => {
  const {
    addItem,
    removeItem,
    getItem,
    isInCart,
    cartItemsCount,
    getParticularItemCount,
  } = useCart();

  const { notify } = useNotifier();

  const storeId = process.env.NEXT_PUBLIC_STG_CLIENT_ID;
  const entityId = storeId;

  const [addProductToCart, { loading: addProductLoading }] = useMutation(
    M_ADD_PRODUCT_TO_CART,
    {
      onCompleted: (resData) => {
        if (
          resData &&
          resData.addProductToCart &&
          resData.addProductToCart.productId
        ) {
          addItem({
            ...data,
            inCartProductId: resData.addProductToCart.productId,
          });
        } else {
          //todo: handle failure case (might be session expiry or server error)
          notify(
            <DangerNotification
              message="Something went wrong!Product could not be added to cart!"
              dismiss
            />
          );
        }
      },
    }
  );

  const [
    updateProductQuantity,
    { loading: updateProductQuantityLoading },
  ] = useMutation(M_UPDATE_PRODUCT_QUANTITY);

  const {
    authState: { isAuthenticated },
    authDispatch,
  } = React.useContext<any>(AuthContext);

  function handleJoin() {
    authDispatch({
      type: "SIGNIN",
    });

    openModal({
      show: true,
      overlayClassName: "quick-view-overlay",
      closeOnClickOutside: true,
      component: AuthenticationForm,
      closeComponent: "",
      config: {
        enableResizing: false,
        disableDragging: true,
        className: "quick-view-modal",
        width: 458,
        height: "auto",
      },
    });
  }

  async function addItemHandler() {
    const {
      _id,
      productName: { en, ar },
      price,
      quantity,
      maxQuantity,
    } = data;
    const addProductInput = {
      entityId,
      storeCode: storeId,
      product: {
        productId: _id,
        name: { en, ar },
        quantity: 1,
        maxQuantity: maxQuantity,
        price: price.price,
        quotedPrice: price.price,
      },
    };
    const itemCountInCart = getParticularItemCount(data._id);
    if (itemCountInCart === 0) {
      addProductToCart({ variables: { addProductInput } });
    } else {
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
          addItem(data);
        } else {
          throw new Error(`could not add ${data.productName.en} to the cart!`);
        }
      } catch (error) {
        notify(<DangerNotification message={`${error.message}`} dismiss />);
      }
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
        removeItem(data);
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

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      handleJoin();
    } else {
      addItemHandler();
    }
    // if (!isInCart(data.id)) {
    //   cartAnimation(e);
    // }
  };
  const handleRemoveClick = (e) => {
    e.stopPropagation();
    removeItemHandler();
  };

  return !isInCart(data._id) ? (
    <Button
      aria-label="add item to cart"
      onClick={handleAddClick}
      variant={variant}
    >
      {!!buttonText && <Box flexGrow={1}>{buttonText}</Box>}
      <Icon variant={variant}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
        >
          <path
            data-name="Path 9"
            d="M143.407,137.783h-1.25v4.375h-4.375v1.25h4.375v4.375h1.25v-4.375h4.375v-1.25h-4.375Z"
            transform="translate(-137.782 -137.783)"
            fill="currentColor"
          />
        </svg>
      </Icon>
    </Button>
  ) : (
    <>
      {addProductLoading || updateProductQuantityLoading ? (
        <Button aria-label="add item to cart" variant={variant}>
          <Loader />
        </Button>
      ) : (
        <Counter
          value={getItem(data._id).quantity}
          onDecrement={handleRemoveClick}
          onIncrement={handleAddClick}
          className="card-counter"
          variant={variant || "altHorizontal"}
        />
      )}
    </>
  );
};
