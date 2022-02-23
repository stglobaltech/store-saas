import React from "react";
import { FormattedMessage } from 'react-intl';
import styled from "styled-components";

const StyledPaginateWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 35px;
`;

const StyledPaginate = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 200px;
  height: 100px;
`;

const StyledPaginateComponentButton = styled.button`
  border: 1px solid #009e7f;
  border-radius:5px;
  background: #009e7f;
  color: #fff;
  font-weight:bold;
  padding: 10px 15px;
  text-align: center;
  visibility:${(props) => {
    return (props.disabled ? "hidden" : "visible")
  }};
  border-radius: 5px 5px;
  &:hover {
    cursor: pointer;
  }
`;

type Props = {
  currentPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  fetchPage: (page: number) => void;
};
export const Paginate = ({
  currentPage,
  fetchPage,
  hasPrevPage,
  hasNextPage,
}: Props) => {
  const [page, setPage] = React.useState(currentPage);
  function handlePageChange(
    e: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) {
    fetchPage(newPage);
    setPage(newPage);
  }
  return (
    <StyledPaginateWrapper>
      <StyledPaginate>
        <StyledPaginateComponentButton
          disabled={!hasPrevPage}
          onClick={(e) => handlePageChange(e, page - 1)}
        >
          <FormattedMessage id='prev' defaultMessage='Prev' />
        </StyledPaginateComponentButton>
        <StyledPaginateComponentButton>
          {currentPage}
        </StyledPaginateComponentButton>
        <StyledPaginateComponentButton
          disabled={!hasNextPage}
          onClick={(e) => handlePageChange(e, page + 1)}
        >
          <FormattedMessage id='next' defaultMessage='Next' />
        </StyledPaginateComponentButton>
      </StyledPaginate>
    </StyledPaginateWrapper>
  );
};
