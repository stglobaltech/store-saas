import { useQuery } from "@apollo/client";
import styled from "styled-components";
import ErrorMessage from "components/error-message/error-message";
import Loader from "components/loader/loader";
import { Paginate } from "components/pagination/pagination";
import ReactTable from "components/table/table";
import { Q_GET_USER_TRANSACTIONS } from "graphql/query/get-user-transactions.query";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { USER_TRANSACTIONS_ERROR } from "utils/constant";
import { getUserId } from "utils/localStorage";

const TableWrapper = styled.div`
  max-width: 70%;
  margin: auto;
  margin-top: 5.8%;
  margin-bottom: 2%;
  @media only screen and (max-width: 800px) {
    margin-top: 22%;
    max-width: 100%;
    margin: none;
  }
`;

const columns = [
  { title: "Transaction Id", dataIndex: "_id", key: "_id" },
  { title: "Order Id", dataIndex: "orderId", key: "orderId" },
  { title: "Operation", dataIndex: "operation", key: "operation" },
  { title: "Purpose", dataIndex: "purpose", key: "purpose" },
  { title: "Amount", dataIndex: "amount", key: "amount" },
  { title: "User Type", dataIndex: "userType", key: "userType" },
  { title: "Order Date", dataIndex: "orderDate", key: "orderDate" },
  {
    title: "Previous Balance",
    dataIndex: "previousBalance",
    key: "previousBalance",
  },
];

function transactions() {
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery(Q_GET_USER_TRANSACTIONS, {
    variables: {
      input: {
        paginate: {
          page,
          perPage: 30,
        },
        userId: getUserId(),
      },
    },
  });

  if (loading) return <Loader />;
  if (error)
    return (
      <ErrorMessage>
        <FormattedMessage
          id="erroruserTransactions"
          defaultMessage={USER_TRANSACTIONS_ERROR}
        />
      </ErrorMessage>
    );

  const fetchMore = (nextPage) => setPage(nextPage);

  let currentPage, hasNextPage, hasPrevPage;
  if (
    data &&
    data.getTransactionsForUser &&
    data.getTransactionsForUser.pagination
  ) {
    currentPage = data.getTransactionsForUser.pagination.page;
    hasNextPage = data.getTransactionsForUser.pagination.hasNextPage;
    hasPrevPage = data.getTransactionsForUser.pagination.hasPrevPage;
  }

  return (
    <TableWrapper>
      <ReactTable
        columns={columns}
        data={data?.getTransactionsForUser?.transactions}
      />
      <Paginate
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        fetchPage={fetchMore}
      />
    </TableWrapper>
  );
}

export default transactions;
