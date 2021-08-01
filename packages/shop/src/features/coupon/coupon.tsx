import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CouponBoxWrapper, Error } from './coupon.style';
import { Input } from 'components/forms/input';
import { Button } from 'components/button/button';
import { useCart } from 'contexts/cart/use-cart';
import { useMutation } from '@apollo/client';
import { APPLY_COUPON } from 'graphql/mutation/coupon';

type CouponProps = {
  disabled?: any;
  className?: string;
  style?: any;
  errorMsgFixed?: boolean;
};

const Coupon: React.FC<CouponProps> = ({
  disabled,
  className,
  style,
  errorMsgFixed = false,
  ...props
}) => {
  const intl = useIntl();
  const { applyCoupon } = useCart();
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [appliedCoupon] = useMutation(APPLY_COUPON);

  const handleApplyCoupon = async () => {
    const { data }: any = await appliedCoupon({
      variables: { code },
    });
    if (data.applyCoupon && data.applyCoupon.discountInPercent) {
      setError('');
      applyCoupon(data.applyCoupon);
      setCode('');
    } else {
      setError('Invalid Coupon');
    }
  };
  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setCode(e.currentTarget.value);
  };
  return (
    <>
      <CouponBoxWrapper
        className={className ? className : 'boxedCoupon'}
        style={style}
      >
        <Input
          onChange={handleOnChange}
          value={code}
          placeholder={intl.formatMessage({
            id: 'couponPlaceholder',
            defaultMessage: 'Enter Coupon Here',
          })}
          {...props}
        />
        <Button
          type='button'
          onClick={handleApplyCoupon}
          disabled={disabled}
          padding='0 30px'
        >
          <FormattedMessage id='voucherApply' defaultMessage='Apply' />
        </Button>
      </CouponBoxWrapper>
      {error && (
        <Error errorMsgFixed={errorMsgFixed}>
          <FormattedMessage id='couponError' defaultMessage={error} />
        </Error>
      )}
    </>
  );
};

export default Coupon;
