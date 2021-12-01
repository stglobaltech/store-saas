import { Button } from 'baseui/button';
import React, { useState } from 'react';

export default function Pagination(props) {
  const { fetchMore, hasNextPage, hasPrevPage } = props;
  const [pageNo, setPageNo] = useState(props.currentPage || 1);

  const handlePageChange = (e, page) => {
    e.preventDefault();

    fetchMore(page);
    setPageNo(page);
  };

  return (
    <div>
      <Button
        overrides={{
          BaseButton: {
            style: ({ $theme }) => ({
              marginTop: '0px',
              height: '25px',
              marginRight: '5px',
              borderTopLeftRadius: '3px',
              borderTopRightRadius: '3px',
              borderBottomLeftRadius: '3px',
              borderBottomRightRadius: '3px',
            }),
          },
        }}
        disabled={!hasPrevPage}
        onClick={(e) => handlePageChange(e, pageNo - 1)}
      >
        Prev
      </Button>
      <Button
        overrides={{
          BaseButton: {
            style: ({ $theme }) => ({
              height: '25px',
              marginRight: '5px',
              borderTopLeftRadius: '3px',
              borderTopRightRadius: '3px',
              borderBottomLeftRadius: '3px',
              borderBottomRightRadius: '3px',
            }),
          },
        }}
      >
        {pageNo || 1}
      </Button>
      <Button
        overrides={{
          BaseButton: {
            style: ({ $theme }) => ({
              height: '25px',
              borderTopLeftRadius: '3px',
              borderTopRightRadius: '3px',
              borderBottomLeftRadius: '3px',
              borderBottomRightRadius: '3px',
            }),
          },
        }}
        disabled={!hasNextPage}
        onClick={(e) => handlePageChange(e, pageNo + 1)}
      >
        Next
      </Button>
    </div>
  );
}
