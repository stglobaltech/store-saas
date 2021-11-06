import React, { useContext } from "react";
import { FormattedMessage } from "react-intl";
import { handleModal } from "features/checkouts/checkout-modal";
import { ProfileContext } from "contexts/profile/profile.context";
import PaymentGroup from "components/payment-group/payment-group";
import StripePaymentForm from "./stripe-form";
import { useCart } from "contexts/cart/use-cart";
import { useMutation } from "@apollo/client";
import { DELETE_CARD } from "graphql/mutation/card";
import { CardHeader } from "components/card-header/card-header";
import PaymentRadioCard from "components/payment-options/payment-options";
import PaymentOptions from "features/checkouts/data";

interface Props {
  deviceType: any;
  increment?: boolean;
}

const Payment = ({ deviceType, increment = false }: Props) => {
  const [deletePaymentCardMutation] = useMutation(DELETE_CARD);
  const { calculatePrice } = useCart();

  const { state, dispatch } = useContext(ProfileContext);

  const handleOnDelete = async (item) => {
    dispatch({ type: "DELETE_CARD", payload: item.id });
    return await deletePaymentCardMutation({
      variables: { cardId: JSON.stringify(item.id) },
    });
  };

  function handlePaymentOptionChange(e) {
    const {
      target: { id },
    } = e;
    dispatch({ type: "SET_PRIMARY_PAYMENT_OPTION", payload: id });
  }

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
      {PaymentOptions.map((option, index) => (
        <PaymentRadioCard
          key={index}
          id={option.id}
          title={option.title}
          onChange={handlePaymentOptionChange}
          content={option.content}
          checked={state?.selectedPaymentOption?.id === option.id}
        />
      ))}
    </>
  );
};

export default Payment;
