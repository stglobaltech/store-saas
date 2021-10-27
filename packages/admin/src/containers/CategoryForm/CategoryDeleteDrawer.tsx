import React, { useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useDrawerDispatch, useDrawerState } from 'context/DrawerContext';
import Button, { KIND } from 'components/Button/Button';
import {
  DrawerTitleWrapper,
  DrawerTitle,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { useNotifier } from 'react-headless-notifier';
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
  console.log(category);
  const dispatch = useDrawerDispatch();

  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);

  const { notify } = useNotifier();

  const [deleteProductCategory] = useMutation(M_DELETE_PRODUCT_CATEGORY, {
    onCompleted: (data) => {
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

  function handleDelete(e, category) {
    e.preventDefault();
    deleteProductCategory({
      variables: {
        categoryDeleteInput: {
          storeId: storeId,
          categoryId: `${category.id}`,
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
    closeDrawer();
  }

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Delete Category</DrawerTitle>
      </DrawerTitleWrapper>
      <p>
        Do you want to delete{' '}
        <strong>
          {category.nameEn}/{category.nameAr}
        </strong>
      </p>
      <ButtonGroup>
        <Button
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
          onClick={(e) => handleDelete(e, category)}
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
          Delete
        </Button>
      </ButtonGroup>
    </>
  );
};

export default DeleteCategory;
