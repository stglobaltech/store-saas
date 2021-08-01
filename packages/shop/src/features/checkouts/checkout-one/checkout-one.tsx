import React, { useContext, useState, useEffect } from 'react';
import Router from 'next/router';
import { Button } from 'components/button/button';
import CheckoutWrapper, {
  CheckoutContainer,
  OrderSummary,
  OrderSummaryItem,
  OrderLabel,
  OrderAmount,
  DeliverySchedule,
  DeliveryAddress,
  StyledContact,
  PaymentOption,
  CheckoutSubmit,
  CouponBoxWrapper,
} from './checkout-one.style';

import { CouponDisplay } from 'components/coupon-box/coupon-box';
import { ProfileContext } from 'contexts/profile/profile.context';
import { FormattedMessage } from 'react-intl';
import { useCart } from 'contexts/cart/use-cart';
import Schedules from 'features/schedule/schedule';
import Address from 'features/address/address';
import Coupon from 'features/coupon/coupon';
import Contact from 'features/contact/contact';
import Payment from 'features/payment/payment';

// The type of props Checkout Form receives
interface MyFormProps {
  token: string;
  deviceType: any;
}

const Checkout: React.FC<MyFormProps> = ({ token, deviceType }) => {
  const {
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

  const { state } = useContext(ProfileContext);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { address, contact, card, schedules } = state;

  const handleSubmit = async () => {
    setLoading(true);
    if (isValid) {
      clearCart();
      Router.push('/order-received');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (
      calculatePrice() > 0 &&
      cartItemsCount > 0 &&
      address.length &&
      contact.length &&
      card.length &&
      schedules.length
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
          <OrderSummary>
            <OrderSummaryItem style={{ marginBottom: 15 }}>
              <OrderLabel>
                <FormattedMessage id='subTotal' defaultMessage='Subtotal' /> (
                {cartItemsCount}{' '}
                <FormattedMessage id='itemsText' defaultMessage='items' />)
              </OrderLabel>
              <OrderAmount>${calculateSubTotalPrice()}</OrderAmount>
            </OrderSummaryItem>

            <OrderSummaryItem style={{ marginBottom: 30 }}>
              <OrderLabel>
                <FormattedMessage
                  id='shippingFeeText'
                  defaultMessage='Shipping Fee'
                />
              </OrderLabel>
              <OrderAmount>$0.00</OrderAmount>
            </OrderSummaryItem>

            <OrderSummaryItem
              style={{ marginBottom: 30 }}
              className='voucherWrapper'
            >
              <OrderLabel>
                <FormattedMessage id='voucherText' defaultMessage='Voucher' />
              </OrderLabel>
              {coupon ? (
                <CouponDisplay
                  code={coupon.code}
                  sign='-'
                  currency='$'
                  price={calculateDiscount()}
                  onClick={(e) => {
                    e.preventDefault();
                    removeCoupon();
                  }}
                />
              ) : (
                <CouponBoxWrapper>
                  <Coupon
                    errorMsgFixed={true}
                    style={{ maxWidth: 350, height: 50 }}
                  />
                </CouponBoxWrapper>
              )}
            </OrderSummaryItem>

            <OrderSummaryItem>
              <OrderLabel>
                <FormattedMessage id='totalText' defaultMessage='Total' />
              </OrderLabel>
              <OrderAmount>${calculatePrice()}</OrderAmount>
            </OrderSummaryItem>
          </OrderSummary>
          {/* DeliverySchedule */}
          <DeliverySchedule>
            <Schedules />
          </DeliverySchedule>
          {/* DeliveryAddress */}
          <DeliveryAddress>
            <Address />
          </DeliveryAddress>
          {/* Contact number */}
          <StyledContact>
            <Contact />
          </StyledContact>
          {/* PaymentOption */}
          <PaymentOption>
            <Payment deviceType={deviceType} />
          </PaymentOption>
          {/* CheckoutSubmit */}
          <CheckoutSubmit>
            <Button
              type='button'
              onClick={handleSubmit}
              disabled={!isValid}
              size='big'
              loading={loading}
              width='100%'
            >
              <FormattedMessage
                id='processCheckout'
                defaultMessage='Proceed to Checkout'
              />
            </Button>
          </CheckoutSubmit>
        </CheckoutContainer>
      </CheckoutWrapper>
    </form>
  );
};

export default Checkout;
