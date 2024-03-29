import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import Link from "next/link";
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
import { FormattedMessage } from "react-intl";
import { useLocale } from "contexts/language/language.provider";
import { AuthContext } from "contexts/auth/auth.context";
import { Scrollbar } from "components/scrollbar/scrollbar";
import { useCart } from "contexts/cart/use-cart";
import { CartItem } from "components/cart-item/cart-item";
import Coupon from "features/coupon/coupon";
import { refactorProductbeforeAddingToCart } from "utils/refactor-product-before-adding-to-cart";
import { useAppState } from "contexts/app/app.provider";

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
  const router = useRouter();
  const {
    authState: { isAuthenticated },
    authDispatch,
  } = React.useContext<any>(AuthContext);
  const workFlowPolicy = useAppState("workFlowPolicy") as any;
  const storeId = useAppState("activeStoreId");
  const entityId = storeId;

  const [hasCoupon, setCoupon] = useState(false);
  const { isRtl } = useLocale();

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
                onIncrement={() =>
                  addItem(refactorProductbeforeAddingToCart(item))
                }
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
        {/* <PromoCode>
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
          ) : (Cart
            <CouponCode>
              <FormattedMessage
                id="couponApplied"
                defaultMessage="Coupon Applied"
              />
              <span>{coupon.code}</span>
            </CouponCode>
          )}
        </PromoCode> */}

        {cartItemsCount !== 0 ? (
          <Link href="/checkout">
            <CheckoutButton onClick={onCloseBtnClick}>
              <>
                <Title>
                  <FormattedMessage
                    id="nav.checkout"
                    defaultMessage="Checkout"
                  />
                </Title>
                <PriceBox>
                  {workFlowPolicy.currency}{" "}
                  {calculatePrice()}
                </PriceBox>
              </>
            </CheckoutButton>
          </Link>
        ) : (
          <CheckoutButton>
            <>
              <Title>
                <FormattedMessage id="nav.checkout" defaultMessage="Checkout" />
              </Title>
              <PriceBox>
                {workFlowPolicy.currency}{" "}
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
