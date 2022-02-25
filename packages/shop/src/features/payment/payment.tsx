import React, { useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNotifier } from "react-headless-notifier";
import { handleModal } from "features/checkouts/checkout-modal";
import { ProfileContext } from "contexts/profile/profile.context";
import PaymentGroup from "components/payment-group/payment-group";
import StripePaymentForm from "./stripe-form";
import { useCart } from "contexts/cart/use-cart";
import { useMutation } from "@apollo/client";
import { DELETE_CARD } from "graphql/mutation/card";
import { CardHeader } from "components/card-header/card-header";
import PaymentRadioCard from "components/payment-options/payment-options";
import { M_UPDATE_CART_PAYMENT_TYPE } from "graphql/mutation/update-cart-payment-type.mutation";
import SuccessNotification from "../../components/Notification/SuccessNotification";
import DangerNotification from "../../components/Notification/DangerNotification";
import {
  PAYMENT_METHOD_SET_CASH,
  PAYMENT_METHOD_SET_CARD,
  PAYMENT_METHOD_SET_WALLET
} from '../../utils/constant';

interface Props {
  deviceType: any;
  increment?: boolean;
  storeId?: string;
  cartId?: string;
  walletBalance?: any;
}

const Payment = ({
  deviceType,
  increment = false,
  storeId,
  cartId,
  walletBalance,
}: Props) => {
  const intl = useIntl();
  const [deletePaymentCardMutation] = useMutation(DELETE_CARD);
  const [updateOrderPayType] = useMutation(M_UPDATE_CART_PAYMENT_TYPE);
  const { notify } = useNotifier();

  const { state, dispatch } = useContext(ProfileContext);

  const handleOnDelete = async (item) => {
    dispatch({ type: "DELETE_CARD", payload: item.id });
    return await deletePaymentCardMutation({
      variables: { cardId: JSON.stringify(item.id) },
    });
  };

  const paymentMethodSetMessage = (payType) => {
    switch (payType) {
      case 'cash':
        return {
          id: 'paymentMethodSetCash',
          defaultMessage: PAYMENT_METHOD_SET_CASH,
        };
      case 'card':
        return {
          id: 'paymentMethodSetCard',
          defaultMessage: PAYMENT_METHOD_SET_CARD,
        };
      case 'wallet':
        return {
          id: 'paymentMethodSetWallet',
          defaultMessage: PAYMENT_METHOD_SET_WALLET,
        };
      default:
        break;
    }
  };

  async function handlePaymentOptionChange(e) {
    const {
      target: { id, value },
    } = e;
    const input = {
      cartId,
      orderPayType: value,
    };
    if (value === "card" || value === "wallet") {
      input["paymentGateWay"] = state.storePolicies.gateWayName;
    }
    try {
      const { data, error } = (await updateOrderPayType({
        variables: {
          input,
        },
      })) as any;
      if (
        data &&
        data.updateOrderPaymentType &&
        data.updateOrderPaymentType.success
      ) {
        const paymentMethodSetIntl = paymentMethodSetMessage(value);
        notify(
          <SuccessNotification
            message={intl.formatMessage(paymentMethodSetIntl)}
            dismiss
          />
        );
        dispatch({ type: "SET_PRIMARY_PAYMENT_OPTION", payload: parseInt(id) });
      } else if (error) {
        throw error;
      }
    } catch (error) {
      notify(<DangerNotification message={`${error}`} dismiss />);
    }
  }

  console.log('storePolicies',state.storePolicies);

  return (
    <>
      <CardHeader increment={increment}>
        <FormattedMessage
          id="selectPaymentText"
          defaultMessage="Select Payment Option"
        />
      </CardHeader>
      {/* <PaymentGroup
        name="payment"
        deviceType={deviceType}
        items={card?card:[]}
        onDelete={(item) => handleOnDelete(item)}
        onChange={(item: any) =>
          dispatch({
            type: 'SET_PRIMARY_CARD',
            payload: item.id.toString(),
          })
        }
        handleAddNewCard={() => {
          handleModal(
            StripePaymentForm,
            { totalPrice: calculatePrice() },
            'add-address-modal stripe-modal'
          );
        }}
      /> */}
      {state.storePolicies.paymentType.map((option, index) =>
        option.type !== "wallet" ? (
          <PaymentRadioCard
            key={index}
            id={option.id}
            title={option.type}
            onChange={handlePaymentOptionChange}
            content={option.description}
            checked={state?.selectedPaymentOption?.id === option.id}
          />
        ) : (
          <PaymentRadioCard
            key={index}
            id={option.id}
            title={option.type}
            onChange={handlePaymentOptionChange}
            content={option.description}
            checked={state?.selectedPaymentOption?.id === option.id}
            walletBalance={walletBalance}
          />
        )
      )}
    </>
  );
};

export default Payment;
