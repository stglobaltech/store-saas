import React, { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useDrawerDispatch, useDrawerState } from 'context/DrawerContext';
import Button, { KIND } from 'components/Button/Button';
import {
  DrawerTitleWrapper,
  DrawerTitle,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { M_DELETE_DISCOUNT } from 'services/GQL';
import { useNotifier } from 'react-headless-notifier';
import SuccessNotification from 'components/Notification/SuccessNotification';
import DangerNotification from 'components/Notification/DangerNotification';

type Props = any;

const DeleteCoupon: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);

  const { notify } = useNotifier();
  const { discountID, refetch } = useDrawerState('data');

  const [deleteOffer, { loading: deleting }] = useMutation(M_DELETE_DISCOUNT, {
    onCompleted: (data) => {
      closeDrawer();
      if (data && data.deleteDiscount && data.deleteDiscount.success) {
        notify(
          <SuccessNotification
            message={data.deleteDiscount.message.en}
            dismiss
          />
        );
        refetch();
      }
      else
        notify(
          <DangerNotification
            message={data.deleteDiscount.message.en}
            dismiss
          />
        );
    },
  });

  const handleDelete = () => {
    deleteOffer({ variables: { discountID } });
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Delete Offer</DrawerTitle>
      </DrawerTitleWrapper>

      <p><strong>Are you sure you want to delete this offer?</strong></p>

      <ButtonGroup>
        <Button
          type="button"
          kind={KIND.minimal}
          onClick={closeDrawer}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                width: '50%',
                borderTopLeftRadius: '3px',
                borderTopRightRadius: '3px',
                borderBottomRightRadius: '3px',
                borderBottomLeftRadius: '3px',
                marginRight: '15px',
                color: $theme.colors.red400,
              }),
            },
          }}
        >
          Cancel
        </Button>

        <Button
          type="button"
          disabled={deleting}
          onClick={handleDelete}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                width: '50%',
                borderTopLeftRadius: '3px',
                borderTopRightRadius: '3px',
                borderBottomRightRadius: '3px',
                borderBottomLeftRadius: '3px',
              }),
            },
          }}
        >
          {deleting ? "..." : "Delete"}
        </Button>
      </ButtonGroup>
    </>
  );
};

export default DeleteCoupon;
