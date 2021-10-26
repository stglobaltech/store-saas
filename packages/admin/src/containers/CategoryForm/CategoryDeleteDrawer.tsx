import React, { useState, useCallback } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import { useDrawerDispatch, useDrawerState } from "context/DrawerContext";
import { Scrollbars } from "react-custom-scrollbars";
import Uploader from "components/Uploader/Uploader";
import Input from "components/Input/Input";
import Button, { KIND } from "components/Button/Button";
import DrawerBox from "components/DrawerBox/DrawerBox";
import { Row, Col } from "components/FlexBox/FlexBox";
import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from "../DrawerItems/DrawerItems.style";
import { FormFields, FormLabel } from "components/FormFields/FormFields";
import {
  GET_PRODUCT_CATEGORIES,
  M_DELETE_PRODUCT_CATEGORY,
  Q_GET_STORE_ID,
} from "services/GQL";
import { useForm } from "react-hook-form";
import { isTemplateExpression } from "typescript";

// const GET_CATEGORIES = gql`
//   query getCategories($type: String, $searchBy: String) {
//     categories(type: $type, searchBy: $searchBy) {
//       id
//       icon
//       name
//       slug
//       type
//     }
//   }
// `;
// const CREATE_CATEGORY = gql`
//   mutation createCategory($category: AddCategoryInput!) {
//     createCategory(category: $category) {
//       id
//       name
//       type
//       icon
//       # creation_date
//       slug
//       # number_of_product
//     }
//   }
// `;

// const options = [
//   { value: 'grocery', name: 'Grocery', id: '1' },
//   { value: 'women-cloths', name: 'Women Cloths', id: '2' },
//   { value: 'bags', name: 'Bags', id: '3' },
//   { value: 'makeup', name: 'Makeup', id: '4' },
// ];
type Props = any;

const DeleteCategory: React.FC<Props> = (props) => {
  const category = useDrawerState("data");
  const {
    data: { storeId },
  } = useQuery(Q_GET_STORE_ID);
  console.log(category);
  const dispatch = useDrawerDispatch();

  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), [
    dispatch,
  ]);

  // const [createCategory, { loading }] = useMutation(M_CREATE_CATEGORY, {
  //   refetchQueries: [
  //     {
  //       query: GET_PRODUCT_CATEGORIES,
  //       variables: { storeId: storeId },
  //     },
  //   ],
  //   onCompleted: (data) => {
  //     if (data.createCategory.success === true) {
  //       closeCloneMultipleProductModel();
  //       toast.success("Category Created Successfully");
  //     } else {
  //       toast.error("Category Is Not created");
  //     }

  //     toggleLarge();
  //   },
  // });

  const [deleteProductCategory] = useMutation(M_DELETE_PRODUCT_CATEGORY);

  function handleDelete(e, category) {
    e.preventDefault();
    deleteProductCategory({
      variables: {
        categoryDeleteInputDto: {
          storeId: storeId,
          categoryId: category,
        },
      },
      refetchQueries: [{ query: GET_PRODUCT_CATEGORIES }],
    });
    closeDrawer();
  }

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Delete Category</DrawerTitle>
      </DrawerTitleWrapper>
      <p>Do you want to delete {category.name}</p>
      <ButtonGroup>
        <Button
          kind={KIND.minimal}
          onClick={closeDrawer}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                width: "50%",
                borderTopLeftRadius: "3px",
                borderTopRightRadius: "3px",
                borderBottomRightRadius: "3px",
                borderBottomLeftRadius: "3px",
                marginRight: "15px",
                color: $theme.colors.red400,
              }),
            },
          }}
        >
          Cancel
        </Button>

        <Button
          type='button'
          onClick={(e) => handleDelete(e, category.id)}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                width: "50%",
                borderTopLeftRadius: "3px",
                borderTopRightRadius: "3px",
                borderBottomRightRadius: "3px",
                borderBottomLeftRadius: "3px",
              }),
            },
          }}
        >
          Delete
        </Button>
      </ButtonGroup>
    </>
  );
};

export default DeleteCategory;
