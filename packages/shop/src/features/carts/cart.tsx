import React, { useState } from "react";
import {useRouter} from 'next/router';
import { openModal } from "@redq/reuse-modal";
import {
  CartPopupBody,
  PopupHeader,
  PopupItemCount,
  CloseButton,
  PromoCode,
  CheckoutButtonWrapper,
  CheckoutButton,
  Title,
  PriceBox,
  NoProductMsg,
  NoProductImg,
  ItemWrapper,
  CouponBoxWrapper,
  CouponCode,
} from "./cart.style";
import { CloseIcon } from "assets/icons/CloseIcon";
import { ShoppingBagLarge } from "assets/icons/ShoppingBagLarge";
import { NoCartBag } from "assets/icons/NoCartBag";
import { CURRENCY } from "utils/constant";
import { FormattedMessage } from "react-intl";
import { useLocale } from "contexts/language/language.provider";
import { AuthContext } from "contexts/auth/auth.context";
import AuthenticationForm from "features/authentication-form";
import { Scrollbar } from "components/scrollbar/scrollbar";
import { useCart } from "contexts/cart/use-cart";
import { CartItem } from "components/cart-item/cart-item";
import Coupon from "features/coupon/coupon";

type CartPropsType = {
  style?: any;
  className?: string;
  scrollbarHeight?: string;
  onCloseBtnClick?: (e: any) => void;
};

const Cart: React.FC<CartPropsType> = ({
  style,
  className,
  onCloseBtnClick,
  scrollbarHeight,
}) => {
  const {
    items,
    coupon,
    addItem,
    removeItem,
    removeItemFromCart,
    cartItemsCount,
    calculatePrice,
  } = useCart();
  const router=useRouter();
  const {
    authState: { isAuthenticated },
    authDispatch,
  } = React.useContext<any>(AuthContext);

  const [hasCoupon, setCoupon] = useState(false);
  const { isRtl } = useLocale();

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

  function validateLoggedInBeforeCheckout(e) {
    if (cartItemsCount && !isAuthenticated) {
      handleJoin();
    }else if(cartItemsCount && isAuthenticated){
      router.push('/checkout');
    }
  }

  return (
    <CartPopupBody className={className} style={style}>
      <PopupHeader>
        <PopupItemCount>
          <ShoppingBagLarge width="19px" height="24px" />
          <span>
            {cartItemsCount}
            &nbsp;
            {cartItemsCount > 1 ? (
              <FormattedMessage id="cartItems" defaultMessage="items" />
            ) : (
              <FormattedMessage id="cartItem" defaultMessage="item" />
            )}
          </span>
        </PopupItemCount>

        <CloseButton onClick={onCloseBtnClick}>
          <CloseIcon />
        </CloseButton>
      </PopupHeader>

      <Scrollbar className="cart-scrollbar">
        <ItemWrapper className="items-wrapper">
          {!!cartItemsCount ? (
            items.map((item) => (
              <CartItem
                key={`cartItem-${item._id}`}
                onIncrement={() => addItem(item)}
                onDecrement={() => removeItem(item)}
                onRemove={() => removeItemFromCart(item)}
                data={item}
              />
            ))
          ) : (
            <>
              <NoProductImg>
                <NoCartBag />
              </NoProductImg>
              <NoProductMsg>
                <FormattedMessage
                  id="noProductFound"
                  defaultMessage="No products found"
                />
              </NoProductMsg>
            </>
          )}
        </ItemWrapper>
      </Scrollbar>

      <CheckoutButtonWrapper>
        <PromoCode>
          {!coupon?.discountInPercent ? (
            <>
              {!hasCoupon ? (
                <button onClick={() => setCoupon((prev) => !prev)}>
                  <FormattedMessage
                    id="specialCode"
                    defaultMessage="Have a special code?"
                  />
                </button>
              ) : (
                <CouponBoxWrapper>
                  <Coupon
                    disabled={!items.length}
                    style={{
                      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.06)",
                    }}
                  />
                </CouponBoxWrapper>
              )}
            </>
          ) : (
            <CouponCode>
              <FormattedMessage
                id="couponApplied"
                defaultMessage="Coupon Applied"
              />
              <span>{coupon.code}</span>
            </CouponCode>
          )}
        </PromoCode>

        {cartItemsCount !== 0 ? (
          // <Link href="/checkout">
          <CheckoutButton onClick={validateLoggedInBeforeCheckout}>
            <>
              <Title>
                <FormattedMessage id="nav.checkout" defaultMessage="Checkout" />
              </Title>
              <PriceBox>
                {CURRENCY}
                {calculatePrice()}
              </PriceBox>
            </>
          </CheckoutButton>
        ) : (
          // </Link>
          <CheckoutButton>
            <>
              <Title>
                <FormattedMessage id="nav.checkout" defaultMessage="Checkout" />
              </Title>
              <PriceBox>
                {CURRENCY}
                {calculatePrice()}
              </PriceBox>
            </>
          </CheckoutButton>
        )}
      </CheckoutButtonWrapper>
    </CartPopupBody>
  );
};

export default Cart;
