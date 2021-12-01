import React, { useContext, useState, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import { Button } from "components/button/button";
import { CURRENCY } from "utils/constant";
import { Scrollbar } from "components/scrollbar/scrollbar";
import CheckoutWrapper, {
  CheckoutContainer,
  CheckoutInformation,
  InformationBox,
  DeliverySchedule,
  CheckoutSubmit,
  HaveCoupon,
  CouponBoxWrapper,
  CouponInputBox,
  CouponCode,
  RemoveCoupon,
  TermConditionText,
  TermConditionLink,
  CartWrapper,
  CalculationWrapper,
  OrderInfo,
  Title,
  ItemsWrapper,
  Items,
  Quantity,
  Multiplier,
  ItemInfo,
  Price,
  TextWrapper,
  Text,
  Bold,
  Small,
  NoProductMsg,
  NoProductImg,
} from "./checkout-two.style";

import { NoCartBag } from "assets/icons/NoCartBag";

import Sticky from "react-stickynode";
import { ProfileContext } from "contexts/profile/profile.context";
import { FormattedMessage } from "react-intl";
import { useCart } from "contexts/cart/use-cart";
import { useLocale } from "contexts/language/language.provider";
import { useWindowSize } from "utils/useWindowSize";
import Coupon from "features/coupon/coupon";
import Address from "features/address/address";
import Schedules from "features/schedule/schedule";
import Contact from "features/contact/contact";
import Payment from "features/payment/payment";
import { useMutation } from "@apollo/client";
import { M_PLACE_ORDER } from "graphql/mutation/place-order.mutation";

// The type of props Checkout Form receives
interface MyFormProps {
  cartId: string;
  storeId: string;
  deviceType: any;
  deliveryCost: number;
}

type CartItemProps = {
  product: any;
};

const OrderItem: React.FC<CartItemProps> = ({ product }) => {
  const { _id, quantity, title, productName, unit, price, salePrice } = product;
  const displayPrice = salePrice ? salePrice : price;
  return (
    <Items key={_id}>
      <Quantity>{quantity}</Quantity>
      <Multiplier>x</Multiplier>
      <ItemInfo>
        {productName ? productName.en : title} {unit ? `| ${unit}` : ""}
      </ItemInfo>
      <Price>
        {CURRENCY}
        {(displayPrice.price * quantity).toFixed(2)}
      </Price>
    </Items>
  );
};

const CheckoutWithSidebar: React.FC<MyFormProps> = ({
  cartId,
  storeId,
  deliveryCost,
  deviceType,
}) => {
  const [hasCoupon, setHasCoupon] = useState(false);
  const { state, profileGetOperations } = useContext(ProfileContext);
  const { isRtl } = useLocale();
  const {
    items,
    removeCoupon,
    coupon,
    clearCart,
    cartItemsCount,
    calculatePrice,
    calculateDiscount,
    calculateSubTotalPrice,
    isRestaurant,
    toggleRestaurant,
  } = useCart();
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const [placeOrder] = useMutation(M_PLACE_ORDER, {
    onCompleted: (data) => {
      setLoading(true);
      if (isValid) {
        Router.push('/order-received');
      }
      setLoading(false);
    },
  });

  const size = useWindowSize();

  const handleSubmit = async () => {
    placeOrder({
      variables: {
        createOrderInput: {
          cartId,
        },
      },
    });
  };

  useEffect(() => {
    if (
      calculatePrice() > 0 &&
      cartItemsCount > 0
      // address.length &&
      // contact.length &&
      // card.length &&
      // schedules.length
    ) {
      setIsValid(true);
    }
  }, [state]);
  useEffect(() => {
    return () => {
      if (isRestaurant) {
        toggleRestaurant();
        clearCart();
      }
    };
  }, []);

  return (
    <form>
      <CheckoutWrapper>
        <CheckoutContainer>
          <CheckoutInformation>
            <InformationBox>
              <Address
                increment={true}
                flexStart={true}
                buttonProps={{
                  variant: "text",
                  type: "button",
                  className: "addButton",
                }}
                icon={true}
                cartId={cartId}
                storeId={storeId}
              />
            </InformationBox>

            {/* DeliverySchedule */}
            {/* <InformationBox>
              <DeliverySchedule>
                <Schedules increment={true} />
              </DeliverySchedule>
            </InformationBox> */}

            {/* Contact number */}
            {/* <InformationBox>
              <Contact
                increment={true}
                flexStart={true}
                buttonProps={{
                  variant: 'text',
                  type: 'button',
                  className: 'addButton',
                }}
                icon={true}
              />
            </InformationBox> */}

            {/* PaymentOption */}
            <InformationBox
              className="paymentBox"
              style={{ paddingBottom: 30 }}
            >
              <Payment increment={true} deviceType={deviceType} />

              {/* Coupon start */}
              {/* {coupon ? (
                <CouponBoxWrapper>
                  <CouponCode>
                    <FormattedMessage id='couponApplied' />
                    <span>{coupon.code}</span>

                    <RemoveCoupon
                      onClick={(e) => {
                        e.preventDefault();
                        removeCoupon();
                        setHasCoupon(false);
                      }}
                    >
                      <FormattedMessage id='removeCoupon' />
                    </RemoveCoupon>
                  </CouponCode>
                </CouponBoxWrapper>
              ) : (
                <CouponBoxWrapper>
                  {!hasCoupon ? (
                    <HaveCoupon onClick={() => setHasCoupon((prev) => !prev)}>
                      <FormattedMessage
                        id='specialCode'
                        defaultMessage='Have a special code?'
                      />
                    </HaveCoupon>
                  ) : (
                    <CouponInputBox>
                      <Coupon errorMsgFixed={true} className='normalCoupon' />
                    </CouponInputBox>
                  )}
                </CouponBoxWrapper>
              )} */}

              <TermConditionText>
                <FormattedMessage
                  id="termAndConditionHelper"
                  defaultMessage="By making this purchase you agree to our"
                />
                <Link href="#">
                  <TermConditionLink>
                    <FormattedMessage
                      id="termAndCondition"
                      defaultMessage="terms and conditions."
                    />
                  </TermConditionLink>
                </Link>
              </TermConditionText>

              {/* CheckoutSubmit */}
              <CheckoutSubmit>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    !profileGetOperations.getPrimaryAddress() ||
                    !profileGetOperations.getPrimaryPaymentOption()
                  }
                  size="big"
                  loading={loading}
                  style={{ width: "100%" }}
                >
                  <FormattedMessage
                    id="processCheckout"
                    defaultMessage="Proceed to Checkout"
                  />
                </Button>
              </CheckoutSubmit>
            </InformationBox>
          </CheckoutInformation>

          <CartWrapper>
            <Sticky
              enabled={size.width >= 768 ? true : false}
              top={120}
              innerZ={999}
            >
              <OrderInfo>
                <Title>
                  <FormattedMessage
                    id="cartTitle"
                    defaultMessage="Your Order"
                  />
                </Title>

                <Scrollbar className="checkout-scrollbar">
                  <ItemsWrapper>
                    {cartItemsCount > 0 ? (
                      items.map((item) => (
                        <OrderItem
                          key={`cartItem-${item._id}`}
                          product={item}
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
                  </ItemsWrapper>
                </Scrollbar>

                <CalculationWrapper>
                  <TextWrapper>
                    <Text>
                      <FormattedMessage
                        id="subTotal"
                        defaultMessage="Subtotal"
                      />
                    </Text>
                    <Text>
                      {CURRENCY}
                      {calculateSubTotalPrice()}
                    </Text>
                  </TextWrapper>

                  <TextWrapper>
                    <Text>
                      <FormattedMessage
                        id="intlOrderDetailsDelivery"
                        defaultMessage="Delivery Fee"
                      />
                    </Text>
                    <Text>
                      {CURRENCY} {deliveryCost}
                    </Text>
                  </TextWrapper>

                  <TextWrapper>
                    <Text>
                      <FormattedMessage
                        id="discountText"
                        defaultMessage="Discount"
                      />
                    </Text>
                    <Text>
                      {CURRENCY}
                      {calculateDiscount()}
                    </Text>
                  </TextWrapper>

                  <TextWrapper style={{ marginTop: 20 }}>
                    <Bold>
                      <FormattedMessage id="totalText" defaultMessage="Total" />{" "}
                      <Small>
                        (
                        <FormattedMessage
                          id="vatText"
                          defaultMessage="Incl. VAT"
                        />
                        )
                      </Small>
                    </Bold>
                    <Bold>
                      {CURRENCY}
                      {(
                        Number(calculatePrice()) + Number(deliveryCost)
                      ).toFixed(2)}
                    </Bold>
                  </TextWrapper>
                </CalculationWrapper>
              </OrderInfo>
            </Sticky>
          </CartWrapper>
        </CheckoutContainer>
      </CheckoutWrapper>
    </form>
  );
};

export default CheckoutWithSidebar;
