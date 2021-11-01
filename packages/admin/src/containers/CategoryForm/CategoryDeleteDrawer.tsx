import React, { useCallback } from 'react';
import { useDrawerDispatch, useDrawerState } from 'context/DrawerContext';
import Button, { KIND } from 'components/Button/Button';
import { useNotifier } from 'react-headless-notifier';
import { useMutation, useQuery } from "@apollo/client";
import {
  DrawerTitleWrapper,
  DrawerTitle,
  ButtonGroup,
} from "../DrawerItems/DrawerItems.style";
import {
  GET_PRODUCT_CATEGORIES,
  M_DELETE_PRODUCT_CATEGORY,
  Q_GET_STORE_ID,
} from 'services/GQL';
import SuccessNotification from 'components/Notification/SuccessNotification';
import DangerNotification from 'components/Notification/DangerNotification';

type Props = any;

const DeleteCategory: React.FC<Props> = (props) => {
  
  const category = useDrawerState('data');
  
  const {
    data: { storeId },
  } = useQuery(Q_GET_STORE_ID);

  const dispatch = useDrawerDispatch();

  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);

  const { notify } = useNotifier();

  const [deleteProductCategory, { loading: deleting }] = useMutation(M_DELETE_PRODUCT_CATEGORY, {
    onCompleted: (data) => {
      closeDrawer();
      if (data && data.deleteCategory)
        notify(
          <SuccessNotification
            message={data.deleteCategory.message.en}
            dismiss
          />
        );
      else
        notify(
          <DangerNotification
            message={data.deleteCategory.message.en}
            dismiss
          />
        );
    },
  });

  function handleDelete() {
    deleteProductCategory({
      variables: {
        categoryDeleteInput: {
          storeId,
          categoryId: category._id,
        },
      },
      refetchQueries: [
        {
          query: GET_PRODUCT_CATEGORIES,
          variables: {
            storeId: storeId,
          },
        },
      ],
    });
  }

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Delete Category</DrawerTitle>
      </DrawerTitleWrapper>
      <p>
        Do you want to delete{' '}
        <strong>
          {category.name.en}/{category.name.ar}
        </strong>
      </p>
      <ButtonGroup>
        <Button
          type='button'
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
          type='button'
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

export default DeleteCategory;
