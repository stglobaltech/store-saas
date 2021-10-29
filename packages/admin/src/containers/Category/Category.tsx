import React, { useCallback, useState } from 'react';
import { withStyle } from 'baseui';
import { Grid, Row as Rows, Col as Cols } from 'components/FlexBox/FlexBox';
import { useDrawerDispatch, useDrawerState } from 'context/DrawerContext';
import Button from 'components/Button/Button';
import { useQuery } from '@apollo/client';
import { Wrapper, Header, Heading } from 'components/Wrapper.style';
import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledCell,
} from './Category.style';
import { Plus } from 'assets/icons/Plus';
import NoResult from 'components/NoResult/NoResult';
import {
  GET_PRODUCT_CATEGORIES,
  Q_GET_STORE_ID,
} from 'services/GQL';
import { PencilIcon } from 'assets/icons/PencilIcon';
import { CloseIcon } from 'assets/icons/CloseIcon';

const Col = withStyle(Cols, () => ({
  '@media only screen and (max-width: 767px)': {
    marginBottom: '20px',

    ":last-child": {
      marginBottom: 0,
    },
  },
}));

const Row = withStyle(Rows, () => ({
  "@media only screen and (min-width: 768px)": {
    alignItems: "center",
  },
}));

export default function Category() {
  const {
    data: { storeId },
  } = useQuery(Q_GET_STORE_ID);

  const [category, setCategory] = useState({ id: '', nameEn: '', nameAr: '' });
  const dispatch = useDrawerDispatch();
  
  const openDrawer = useCallback(
    () => dispatch({ type: "OPEN_DRAWER", drawerComponent: "CATEGORY_FORM" }),
    [dispatch]
  );

  const OpenEditDrawer = useCallback(
    (cat) =>
      dispatch({
        type: 'OPEN_DRAWER',
        drawerComponent: 'EDIT_CATEGORY_FORM',
        data: cat,
      }),
    [dispatch]
  );

  const OpenDeleteConfirmDrawer = useCallback(
    (cat) =>
      dispatch({
        type: 'OPEN_DRAWER',
        drawerComponent: 'DELETE_CATEGORY_FORM',
        data: cat,
      }),
    [dispatch, category]
  );

  const handleSetCategory = (selectedCat) => {
    setCategory((prevCategory) => ({ ...prevCategory, ...selectedCat }));
  };
  function deleteCategory(item) {
    const selectedCat = {
      id: item._id,
      nameEn: item.name.en,
      nameAr: item.name.ar,
    };
    OpenDeleteConfirmDrawer(selectedCat);
    handleSetCategory(selectedCat);
  }

  function editCategory(item) {
    const selectedCategoryEdit = {
      id: item._id,
      nameEn: item.name.en,
      nameAr: item.name.ar,
    };

    handleSetCategory(selectedCategoryEdit);

    OpenEditDrawer(selectedCategoryEdit);
  }

  const { data: categoryData, error } = useQuery(GET_PRODUCT_CATEGORIES, {
    variables: {
      storeId: storeId,
    },
  });
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Header
            style={{
              marginBottom: 30,
              boxShadow: "0 0 5px rgba(0, 0 ,0, 0.05)",
            }}
          >
            <Col md={2}>
              <Heading>Category</Heading>
            </Col>

            <Col md={10}>
              <Row>
                <Col md={8} lg={9}></Col>
                <Col md={4} lg={3}>
                  <Button
                    onClick={openDrawer}
                    startEnhancer={() => <Plus />}
                    overrides={{
                      BaseButton: {
                        style: () => ({
                          width: "100%",
                          borderTopLeftRadius: "3px",
                          borderTopRightRadius: "3px",
                          borderBottomLeftRadius: "3px",
                          borderBottomRightRadius: "3px",
                        }),
                      },
                    }}
                  >
                    Add Category
                  </Button>
                </Col>
              </Row>
            </Col>
          </Header>

          <Wrapper style={{ boxShadow: "0 0 5px rgba(0, 0 , 0, 0.05)" }}>
            <TableWrapper>
              <StyledTable $gridTemplateColumns='minmax(40px, 400px) minmax(70px, auto) minmax(40px, auto) '>
                <StyledHeadCell>Id</StyledHeadCell>
                <StyledHeadCell>Name</StyledHeadCell>
                <StyledHeadCell>Actions</StyledHeadCell>

                {categoryData ? (
                  categoryData.getCategories &&
                  categoryData.getCategories.productCategories.length ? (
                    categoryData.getCategories.productCategories.map(
                      (item, index) => (
                        <React.Fragment key={index}>
                          <StyledCell>{item._id}</StyledCell>
                          <StyledCell>
                            {item.name.en}/{item.name.ar}
                          </StyledCell>
                          <StyledCell>
                            <PencilIcon
                              className='icon-lg pointer'
                              onClick={() => editCategory(item)}
                            />
                            <CloseIcon
                              className='icon-lg icon-danger pointer'
                              onClick={() => deleteCategory(item)}
                            />
                          </StyledCell>
                        </React.Fragment>
                      )
                    )
                  ) : (
                    <NoResult
                      hideButton={false}
                      style={{
                        gridColumnStart: "1",
                        gridColumnEnd: "one",
                      }}
                    />
                  )
                ) : null}
              </StyledTable>
            </TableWrapper>
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  );
}
