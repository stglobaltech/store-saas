import React, { useCallback } from 'react';
import { styled } from 'baseui';
import Drawer from 'components/Drawer/Drawer';
import { CloseIcon } from 'assets/icons/CloseIcon';
import { useDrawerState, useDrawerDispatch } from 'context/DrawerContext';

/** Drawer Components */
import ProductForm from '../ProductForm/ProductForm';
import ProductUpdateForm from '../ProductForm/ProductUpdateForm';
import CampaingForm from '../CampaingForm/CampaingForm';
import CategoryForm from '../CategoryForm/CategoryForm';
import StaffMemberForm from '../StaffMemberForm/StaffMemberForm';
import QrCodeForm from '../QrCodeForm/QrCodeForm';
import Sidebar from '../Layout/Sidebar/Sidebar';
import OrderDetail from '../Orders/OrderDetailsDrawer';
import DeleteCategoryForm from '../CategoryForm/CategoryDeleteDrawer';
import CategoryEditForm from '../CategoryForm/CategoryEditForm';
import CouponForm from '../CouponForm/CouponForm';
import EditCouponForm from '../CouponForm/EditCouponForm';
import DeleteCouponForm from '../CouponForm/DeleteCouponForm';

/** Components Name Constants */
const DRAWER_COMPONENTS = {
  PRODUCT_FORM: ProductForm,
  PRODUCT_UPDATE_FORM: ProductUpdateForm,
  CAMPAING_FORM: CampaingForm,
  CATEGORY_FORM: CategoryForm,
  STAFF_MEMBER_FORM: StaffMemberForm,
  QR_CODE_FORM: QrCodeForm,
  ORDER_DETAIL_CARD: OrderDetail,
  DELETE_CATEGORY_FORM: DeleteCategoryForm,
  EDIT_CATEGORY_FORM: CategoryEditForm,
  COUPON_FORM: CouponForm,
  EDIT_COUPON_FORM: EditCouponForm,
  DELETE_COUPON_FORM: DeleteCouponForm,

  SIDEBAR: Sidebar,
};

const CloseButton = styled('button', ({ $theme }) => ({
  ...$theme.typography.fontBold14,
  color: $theme.colors.textNormal,
  lineHeight: 1.2,
  outline: '0',
  border: 'none',
  padding: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: '10px',
  left: '-30px',
  right: 'auto',
  cursor: 'pointer',
  backgroundColor: '#ffffff',
  width: '20px',
  height: '20px',
  borderRadius: '50%',

  '@media only screen and (max-width: 767px)': {
    left: 'auto',
    right: '30px',
    top: '29px',
  },
}));

export default function DrawerItems() {
  const isOpen = useDrawerState('isOpen');
  const drawerComponent = useDrawerState('drawerComponent');
  const data = useDrawerState('data');
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  if (!drawerComponent) {
    return null;
  }
  const SpecificContent = DRAWER_COMPONENTS[drawerComponent];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeDrawer}
      overrides={{
        Root: {
          style: {
            zIndex:
              DRAWER_COMPONENTS[drawerComponent] ===
              DRAWER_COMPONENTS.STAFF_MEMBER_FORM
                ? 0
                : 2,
          },
        },
        DrawerBody: {
          style: {
            marginTop: '80px',
            marginLeft: '60px',
            marginRight: '60px',
            marginBottom: '30px',
            '@media only screen and (max-width: 767px)': {
              marginTop: '80px',
              marginLeft: '30px',
              marginRight: '30px',
              marginBottom: '30px',
            },
          },
        },
        DrawerContainer: {
          style: {
            width: '70vw',
            backgroundColor: '#f7f7f7',
            '@media only screen and (max-width: 767px)': {
              width: '100%',
            },
          },
        },
        Close: {
          component: () => (
            <CloseButton onClick={closeDrawer}>
              <CloseIcon width='6px' height='6px' />
            </CloseButton>
          ),
        },
      }}
    >
      <SpecificContent onClose={closeDrawer} data={data} />
    </Drawer>
  );
}
