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

//material ui
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { StyledEngineProvider } from "@mui/material/styles";

const TableWrapper = styled.div`
  max-width: 80%;
  margin: auto;
  margin-top: 5.8%;
  margin-bottom: 2%;
  @media only screen and (max-width: 800px) {
    margin-top: 22%;
    max-width: 100%;
    margin: none;
  }
`;

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
          id="errorUserTransactions"
          defaultMessage={error.message || USER_TRANSACTIONS_ERROR}
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <b><FormattedMessage id='orderId' defaultMessage='Order Id' /></b>
              </TableCell>
              <TableCell>
                <b><FormattedMessage id='transactionId' defaultMessage='Transaction Id' /></b>
              </TableCell>
              <TableCell>
                <b><FormattedMessage id='operation' defaultMessage='Operation' /></b>
              </TableCell>
              <TableCell>
                <b><FormattedMessage id='orderDate' defaultMessage='Order Date' /></b>
              </TableCell>
              <TableCell>
                <b><FormattedMessage id='amount' defaultMessage='Amount' /></b>
              </TableCell>
              <TableCell>
                <b><FormattedMessage id='purpose' defaultMessage='Purpose' /></b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.getTransactionsForUser?.transactions?.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.orderId}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row._id}
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {row.operation}
                </TableCell>
                <TableCell component={"th"} scope="row">
                  {new Date(row.orderDate).toLocaleString()}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.amount}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.purpose}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
