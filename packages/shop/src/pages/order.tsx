import React from "react";
import { useQuery } from "@apollo/client";
import { NextPage } from "next";
import { SEO } from "components/seo";
import { FormattedMessage } from "react-intl";

import Order from "features/user-profile/order/order";
import {
  PageWrapper,
  SidebarSection,
} from "features/user-profile/user-profile.style";
import Sidebar from "features/user-profile/sidebar/sidebar";
import { Modal } from "@redq/reuse-modal";
import { Q_GET_USER_ACTIVE_ORDERS } from "graphql/query/get-user-active-order.query";
import ErrorMessage from "components/error-message/error-message";
import { NO_ACTIVE_ORDERS_FOUND } from "utils/constant";

const OrderPage = () => {
  const { data, error, loading, refetch } = useQuery(Q_GET_USER_ACTIVE_ORDERS);

  if (data && data.userActiveOrders && !data.userActiveOrders.length) {
    return (
      <ErrorMessage>
        <FormattedMessage
          id="noActiveOrders"
          defaultMessage={NO_ACTIVE_ORDERS_FOUND}
        />
      </ErrorMessage>
    );
  }

  return (
    <>
      <SEO title="Your Orders- Orderznow" description="Order Details" />
      <Modal>
        <PageWrapper>
          {/* <SidebarSection>
            <Sidebar />
          </SidebarSection> */}

          <Order
            data={data}
            error={error}
            loading={loading}
            refetch={refetch}
          />
        </PageWrapper>
      </Modal>
    </>
  );
};

export default OrderPage;
