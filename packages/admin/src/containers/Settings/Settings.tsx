import React, { useCallback } from 'react';
import SettingsCard from 'components/SettingsCard/SettingsCard';
import { useDrawerDispatch } from 'context/DrawerContext';
import { CONTACT_DETAILS, STORE_SETTINGS } from 'settings/constants';
import { withStyle } from 'baseui';

import { SiteSettings } from 'assets/icons/SiteSettings';
import { Members } from 'assets/icons/Members';
import { OrderIcon } from 'assets/icons/OrderIcon';
import { CouponIcon } from 'assets/icons/CouponIcon';
import { SidebarCategoryIcon } from 'assets/icons/SidebarCategoryIcon';
import { ProductIcon } from 'assets/icons/ProductIcon';
import { Grid, Row, Col as Column } from 'components/FlexBox/FlexBox';
import { useHistory } from 'react-router-dom';

const Col = withStyle(Column, () => ({
  '@media only screen and (max-width: 767px)': {
    marginBottom: '20px',

    ':last-child': {
      marginBottom: 0,
    },
  },
}));

export default function Settings() {
  let history = useHistory();

  const dispatch = useDrawerDispatch();

  const openStaffForm = useCallback(
    () =>
      dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'STAFF_MEMBER_FORM' }),
    [dispatch]
  );

  const openCategoryForm = useCallback(
    () => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'CATEGORY_FORM' }),
    [dispatch]
  );

  const openProductForm = useCallback(
    () => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'PRODUCT_FORM' }),
    [dispatch]
  );

  const openCouponForm = useCallback(
    () => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'COUPON_FORM' }),
    [dispatch]
  );

  const openQrForm = useCallback(
    () => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'QR_CODE_FORM' }),
    [dispatch]
  );

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={6}>
          <SettingsCard
            icon={<SiteSettings />}
            title="Store Settings"
            subtitle="View and update your store settings"
            onClick={() => history.push(STORE_SETTINGS)}
          />
        </Col>

        <Col md={6}>
          <SettingsCard
            icon={<Members />}
            title="Contact Address"
            subtitle="View and update your contact details"
            onClick={() => history.push(CONTACT_DETAILS)}
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <SettingsCard
            icon={<ProductIcon width="56px" height="56px" />}
            title="Add Products"
            subtitle="Add products from here"
            onClick={openProductForm}
          />
        </Col>

        <Col md={6}>
          <SettingsCard
            icon={<SidebarCategoryIcon width="56px" height="56px" />}
            title="Add Categories"
            subtitle="Add product categories from here"
            onClick={openCategoryForm}
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <SettingsCard
            icon={<OrderIcon width="56px" height="56px" />}
            title="Add Staff Members"
            subtitle="Add your staff members from here"
            onClick={openStaffForm}
          />
        </Col>
        <Col md={6}>
          <SettingsCard
            icon={<CouponIcon width="56px" height="56px" />}
            title="Add Coupons"
            subtitle="Add coupons from here"
            onClick={openCouponForm}
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <SettingsCard
            icon={<OrderIcon width="56px" height="56px" />}
            title="Generate QR Code"
            subtitle="Generate qr code from here"
            onClick={openQrForm}
          />
        </Col>
      </Row>
    </Grid>
  );
}
