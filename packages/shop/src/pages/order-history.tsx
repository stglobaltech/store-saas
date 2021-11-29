import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { NextPage } from "next";
import { SEO } from "components/seo";
import Order from "features/user-profile/order-history/order";
import {
  PageWrapper,
  SidebarSection,
} from "features/user-profile/user-profile.style";
import { Modal } from "@redq/reuse-modal";
import { Q_USER_ORDER_HISTORY } from "graphql/query/user-order-history.query";
import ErrorMessage from "components/error-message/error-message";
import { FormattedMessage } from "react-intl";

import { ERROR_FETCHING_ORDER_HISTORY, NO_ORDERS_MADE } from "utils/constant";

const OrderHistory = () => {
  const [page, setPage] = useState(1);

  const { data, error, loading } = useQuery(Q_USER_ORDER_HISTORY, {
    variables: {
      orderFindInputDto: {
        paginate: {
          page,
          perPage: 10,
        },
        status: "FIN",
      },
    },
  });

  if (loading) {
    return <div>loading...</div>;
  }

  if (error)
    return (
      <ErrorMessage>
        <FormattedMessage
          id="error"
          defaultMessage={ERROR_FETCHING_ORDER_HISTORY}
        />
      </ErrorMessage>
    );

  if (
    data &&
    data.getUserOrders &&
    data.getUserOrders.orders &&
    !data.getUserOrders.orders.length
  ) {
    return (
      <ErrorMessage>
        <FormattedMessage id="noOrdersFound" defaultMessage={NO_ORDERS_MADE} />
      </ErrorMessage>
    );
  }

  const handleNextPage = (nextPage) => {
    setPage(nextPage);
  };

  return (
    <>
      <SEO title="Your Orders- Orderznow" description="Order Details" />
      <Modal>
        <PageWrapper>
          {/* <SidebarSection>
            <Sidebar />
          </SidebarSection> */}

          <Order data={data} handleNextPage={handleNextPage} />
        </PageWrapper>
      </Modal>
    </>
  );
};

export default OrderHistory;
