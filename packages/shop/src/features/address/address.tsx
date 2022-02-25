import React, { useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNotifier } from "react-headless-notifier";
import RadioGroup from "components/radio-group/radio-group";
import RadioCard from "components/radio-card/radio-card";
import { Button } from "components/button/button";
import UpdateAddress from "components/address-card/address-card";
import { handleModal } from "features/checkouts/checkout-modal";
import { ProfileContext } from "contexts/profile/profile.context";
import { useMutation } from "@apollo/client";
import { CardHeader } from "components/card-header/card-header";
import { ButtonGroup } from "components/button-group/button-group";
import { Box } from "components/box";
import { Plus } from "assets/icons/PlusMinus";
import { M_UPDATE_CART_ADDRESS } from "graphql/mutation/update-cart-address.mutation";
import SuccessNotification from "../../components/Notification/SuccessNotification";
import DangerNotification from "../../components/Notification/DangerNotification";
import { M_DELETE_USER_ADDRESS } from "graphql/mutation/delete-user-address.mutations";
import {
  ADDRESS_DELETED,
  ADDRESS_DELETED_MSG,
  ERROR_DELETE_ADDRESS,
  DELIVERY_ADDRESS_SET,
  DELIVERY_ADDRESS_NOT_SET,
  ERROR_CANNOT_DELETE_ADDRESS
} from "utils/constant";

interface Props {
  increment?: boolean;
  icon?: boolean;
  buttonProps?: any;
  flexStart?: boolean;
  cartId?: string;
  storeId?: string;
}

const Address = ({
  increment = false,
  flexStart = false,
  buttonProps = {
    size: "big",
    variant: "outlined",
    type: "button",
    className: "add-button",
  },
  icon = false,
  cartId,
  storeId,
}: Props) => {
  const intl = useIntl();
  const { notify } = useNotifier();

  const {
    state: { address },
    dispatch,
  } = useContext(ProfileContext);

  const [deleteAddressMutation] = useMutation(M_DELETE_USER_ADDRESS, {
    onCompleted: (data) => {
      if (
        data &&
        data.deleteAddress &&
        data.deleteAddress.status === ADDRESS_DELETED
      ) {
        notify(
          <SuccessNotification
            message={intl.formatMessage({
              id: 'addressDeletedMsg',
              defaultMessage: ADDRESS_DELETED_MSG,
            })}
            dismiss
          />
        );
      } else {
        notify(
          <DangerNotification
            message={intl.formatMessage({
              id: 'errorCannotDeleteAddress',
              defaultMessage: ERROR_CANNOT_DELETE_ADDRESS,
            })}
            dismiss
          />
        );
      }
    },
  });

  const [updateCartAddress] = useMutation(M_UPDATE_CART_ADDRESS, {
    onCompleted: (data) => {
      if (data && data.updateCartAddress && data.updateCartAddress.addressId) {
        dispatch({
          type: "SET_PRIMARY_ADDRESS",
          payload: data.updateCartAddress.addressId.toString(),
        });
        notify(
          <SuccessNotification
            message={`${data.updateCartAddress.name} ${intl.formatMessage({
              id: 'deliveryAddressSet',
              defaultMessage: DELIVERY_ADDRESS_SET,
            })}`}
            dismiss
          />
        );
      } else {
        notify(
          <DangerNotification
            message={intl.formatMessage({
              id: 'deliveryAddressNotSet',
              defaultMessage: DELIVERY_ADDRESS_NOT_SET,
            })}
            dismiss
          />
        );
      }
    },
  });

  const handleOnDelete = async (item) => {
    try {
      const { data } = await deleteAddressMutation({
        variables: { addressDeleteInput: { addressId: item.id } },
      });
      if (
        data &&
        data.deleteAddress &&
        data.deleteAddress.status === ADDRESS_DELETED
      ) {
        dispatch({ type: "DELETE_ADDRESS", payload: item.id });
      }
    } catch (error) {
      notify(
        <DangerNotification
          message={intl.formatMessage({
            id: 'errorDeleteAddress',
            defaultMessage: ERROR_DELETE_ADDRESS,
          })}
          dismiss
        />
      );
    }
  };

  function handleUpdateCartAddress(item) {
    updateCartAddress({
      variables: {
        updateCartAddressInput: {
          cartId,
          addressId: item.id,
          storeCode: storeId,
        },
      },
    });
  }

  return (
    <>
      <CardHeader increment={increment}>
        <FormattedMessage
          id="checkoutDeliveryAddress"
          defaultMessage="Select Your Delivery Address"
        />
      </CardHeader>
      <ButtonGroup flexStart={flexStart}>
        <RadioGroup
          items={address}
          component={(item: any) => (
            <RadioCard
              id={item.id}
              key={item.id}
              title={item.name}
              content={item.address}
              buildingNo={item.buildingNo}
              name="address"
              checked={item.type === "primary"}
              onChange={() => handleUpdateCartAddress(item)}
              onEdit={() => handleModal(UpdateAddress, item)}
              onDelete={() => handleOnDelete(item)}
            />
          )}
          secondaryComponent={
            <Button
              {...buttonProps}
              onClick={() => handleModal(UpdateAddress, "add-address-modal")}
            >
              {icon && (
                <Box mr={2}>
                  <Plus width="10px" />
                </Box>
              )}
              <FormattedMessage
                id="addAddressBtn"
                defaultMessage="Add Address"
              />
            </Button>
          }
        />
      </ButtonGroup>
    </>
  );
};
export default Address;
