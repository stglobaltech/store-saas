import React, { useCallback, useEffect, useState } from "react";
import { withStyle } from "baseui";
import { Grid, Row as Rows, Col as Cols } from "components/FlexBox/FlexBox";
import { useDrawerDispatch, useDrawerState } from "context/DrawerContext";
import Select from "components/Select/Select";
import Input from "components/Input/Input";
import Button from "components/Button/Button";
import Checkbox from "components/CheckBox/CheckBox";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Wrapper, Header, Heading } from "components/Wrapper.style";
import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledCell,
  ImageWrapper,
} from "./Category.style";
import { Plus } from "assets/icons/Plus";
import * as icons from "assets/icons/category-icons";
import NoResult from "components/NoResult/NoResult";
import {
  GET_PRODUCT_CATEGORIES,
  M_DELETE_PRODUCT_CATEGORY,
  Q_GET_STORE_ID,
} from "services/GQL";
import { IconBox } from "components/Widgets/StickerCard/StickerCard.style";
import { PencilIcon } from "assets/icons/PencilIcon";
import { CloseIcon } from "assets/icons/CloseIcon";
import { CoinIcon } from "assets/icons/CoinIcon";
import { CloseSquareO } from "assets/icons/CloseSquare";
import DeleteCategory from "containers/CategoryForm/CategoryDeleteDrawer";

const Col = withStyle(Cols, () => ({
  "@media only screen and (max-width: 767px)": {
    marginBottom: "20px",

    ":last-child": {
      marginBottom: 0,
    },
  },
}));
let OpenDeleteConfirmDrawer;

const Row = withStyle(Rows, () => ({
  "@media only screen and (min-width: 768px)": {
    alignItems: "center",
  },
}));

// const categorySelectOptions = [
//   { value: "grocery", label: "Grocery" },
//   { value: "women-cloths", label: "Women Cloth" },
//   { value: "bags", label: "Bags" },
//   { value: "makeup", label: "Makeup" },
// ];

export default function Category() {
  const {
    data: { storeId },
  } = useQuery(Q_GET_STORE_ID);

  const [category, setCategory] = useState({ id: "", name: "" });
  const [search, setSearch] = useState("");
  const dispatch = useDrawerDispatch();
  const [checkedId, setCheckedId] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (category) {
      console.log("bis");
    }
  }, [category]);

  const openDrawer = useCallback(
    () => dispatch({ type: "OPEN_DRAWER", drawerComponent: "CATEGORY_FORM" }),
    [dispatch]
  );
  const OpenDeleteConfirmDrawer = useCallback(
    () =>
      dispatch({
        type: "OPEN_DRAWER",
        drawerComponent: "EDIT_CATEGORY_FORM",
        data: category,
      }),
    [dispatch, category]
  );

  const [deleteProductCategory] = useMutation(M_DELETE_PRODUCT_CATEGORY);

  function handleDelete(e, item) {
    console.log(item);
    e.preventDefault();
    deleteProductCategory({
      variables: {
        categoryDeleteInput: {
          storeId: storeId,
          categoryId: `${item._id}`,
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
  }

  function editCat(item) {
    const selectedCat = { id: item._id, name: item.name.en };
    setCategory(selectedCat);
    console.log(category);

    OpenDeleteConfirmDrawer();
  }
  const { data: categoryData, error } = useQuery(GET_PRODUCT_CATEGORIES, {
    variables: {
      storeId: storeId,
    },
  });
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  // function handleSearch(event) {
  //   const value = event.currentTarget.value;
  //   setSearch(value);
  //   refetch({
  //     type: category.length ? category[0].value : null,
  //     searchBy: value,
  //   });
  // }
  // function handleCategory({ value }) {
  //   setCategory(value);
  //   if (value.length) {
  //     refetch({
  //       type: value[0].value,
  //     });
  //   } else {
  //     refetch({
  //       type: null,
  //     });
  //   }
  // }

  // function onAllCheck(event) {
  //   if (event.target.checked) {
  //     const idx = data && data.categories.map((current) => current.id);
  //     setCheckedId(idx);
  //   } else {
  //     setCheckedId([]);
  //   }
  //   setChecked(event.target.checked);
  // }

  // function handleCheckbox(event) {
  //   const { name } = event.currentTarget;
  //   if (!checkedId.includes(name)) {
  //     setCheckedId((prevState) => [...prevState, name]);
  //   } else {
  //     setCheckedId((prevState) => prevState.filter((id) => id !== name));
  //   }
  // }
  const Icon = ({ name }) => {
    const TagName = icons[name];
    return !!TagName ? <TagName /> : <p>Invalid icon {name}</p>;
  };
  if (category) {
    <DeleteCategory id={category} />;
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
                {/* <Col md={3} lg={3}>
                  <Select
                    options={categorySelectOptions}
                    labelKey='label'
                    valueKey='value'
                    placeholder='Category Type'
                    value={category}
                    searchable={false}
                    onChange={handleCategory}
                  />
                </Col>

                <Col md={5} lg={6}>
                  <Input
                    value={search}
                    placeholder='Ex: Search By Name'
                    onChange={handleSearch}
                    clearable
                  />
                </Col> */}
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
                              onClick={() => {
                                editCat(item);
                              }}
                            />
                            <CloseIcon
                              className='icon-lg icon-danger pointer'
                              onClick={(e) => handleDelete(e, item)}
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
