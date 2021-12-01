import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDrawerDispatch, useDrawerState } from 'context/DrawerContext';
import Uploader from 'components/Uploader/Uploader';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import Input from 'components/Input/Input';
import { Textarea } from 'components/Textarea/Textarea';
import Select from 'components/Select/Select';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';
import { uploadProductImge } from 'services/REST/product.service';
import { useQuery, useMutation } from '@apollo/client';
import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import {
  Q_GET_STORE_ID,
  Q_GET_USER_ID,
  Q_GET_PARENTRESTAURANTID,
  Q_GET_CATEGORIES,
  Q_STORE_PLAN_FOR_USER_WEB_ADMIN,
  M_CREATE_PRODUCT
} from 'services/GQL';
import { useNotifier } from 'react-headless-notifier';
import SuccessNotification from '../../components/Notification/SuccessNotification';
import DangerNotification from '../../components/Notification/DangerNotification';
import { InLineLoader } from 'components/InlineLoader/InlineLoader';

interface imgUploadRes {[
  urlText: string
]: any}

type Props = any;

const AddProduct: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);

  const { notify } = useNotifier();

  const refetch = useDrawerState('data');

  const { data: { storeId } } = useQuery(Q_GET_STORE_ID);
  const { data: { userId } } = useQuery(Q_GET_USER_ID);
  const { data: { parentRestaurantId } } = useQuery(Q_GET_PARENTRESTAURANTID);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [categories, setCategories] = useState([]);
  const [productPicture, setProductPicture] = useState({
    url: undefined,
    uploading: false
  });
  const [description, setDescription] = useState('');
  const [priceSplit, setPriceSplit] = useState({
    price: "0",
    priceWithoutVat: "0",
    vatPrice: "0"
  });
  const [category, setCategory] = useState([]);

  const { loading, error } = useQuery(Q_GET_CATEGORIES, {
    variables: { storeId },
    onCompleted: ({ getCategories }) => {
      const { productCategories } = getCategories;
      if(productCategories.length) {
        const categoryOptions = productCategories.map((option) => {
          return { label: option.name.en, value: option._id };
        });

        setCategories(categoryOptions);
      }
    }
  });

  const { data: storePlan, loading: storePlanLoading, error: storePlanError } = useQuery(Q_STORE_PLAN_FOR_USER_WEB_ADMIN, {
    variables: { storeId }
  });

  const [doCreate, { loading: saving }] = useMutation(M_CREATE_PRODUCT, {
    onCompleted: (data) => {
      closeDrawer();
      if (data.createProduct) {
        notify(
          <SuccessNotification
            message="Product Created Successfully"
            dismiss
          />
        );

        refetch && refetch();
      }
      else
        notify(
          <DangerNotification
            message="Product Is Not Created"
            dismiss
          />
        );
    }
  });

  useEffect(() => {
    register({ name: 'description' });
    register('category', { required: true });
  }, [register]);

  const uploadImage = (files) => {
    setProductPicture({ ...productPicture, uploading: true });
    const formData = new FormData();
    formData.append("file", files[0], files[0].name);
    uploadProductImge(formData)
      .then((result: imgUploadRes) => {
        setProductPicture({
          ...productPicture,
          url: result.urlText,
          uploading: false,
        });
      })
      .catch((err) => {
        console.error(err, 'on image upload for store logo');
        setProductPicture({ ...productPicture, uploading: false });
      });
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setValue('description', value);
    setDescription(value);
  };

  const vatPercentage = (storePlanData) => {
    if(
      storePlanData &&
      storePlanData.plan &&
      storePlanData.plan.length &&
      storePlanData.plan[0].vat
    )
      return storePlanData.plan[0].vat;
    else if(
      storePlanData &&
      storePlanData.globalVat
    )
      return storePlanData.globalVat;
  };

  const handlePriceChange = (e) => {
    const vat = vatPercentage(storePlan.getStorePlanForUserWebAdmin.data);
    let price, priceWithoutVat, vatPrice;
    switch(e.target.name) {
      case "price":
        price = Number(e.target.value);
        if (price > 0) {
          priceWithoutVat = (price - price * (vat / 100)).toFixed(2);
          vatPrice = (price - priceWithoutVat).toFixed(2);
          setPriceSplit({ price, priceWithoutVat, vatPrice });
        } else {
          setPriceSplit({ price: "0", priceWithoutVat: "0", vatPrice: "0" });
        }
        break;
      case "priceWithoutVat":
        priceWithoutVat = Number(e.target.value);
        if (priceWithoutVat > 0) {
          price = (priceWithoutVat / (1 - vat / 100)).toFixed(2);
          vatPrice = (price - priceWithoutVat).toFixed(2);
          setPriceSplit({ price, priceWithoutVat, vatPrice });
        } else {
          setPriceSplit({ price: "0", priceWithoutVat: "0", vatPrice: "0" });
        }
        break;
    }
  };

  const handleCategoryChange = ({ value }) => {
    setValue('category', value);
    setCategory(value);
  };

  const onSubmit = (values) => {
    const productCreateInput = {
      productName: {
        en: values.productName,
        ar: ""
      },
      price: {
        price: parseFloat(priceSplit.price),
        basePrice: parseFloat(priceSplit.priceWithoutVat),
        vatPrice: parseFloat(priceSplit.vatPrice),
        vatPercentage: vatPercentage(storePlan.getStorePlanForUserWebAdmin.data)
      },
      maxQuantity: parseFloat(values.quantity),
      description: {
        en: description,
        ar: ""
      },
      picture: productPicture.url ? productPicture.url : "https://restaurant-shafeer.s3.ap-south-1.amazonaws.com/store/product-pic/product-pic-1593153655693.png",
      categoryId: category[0].value,
      payType: "any",
      ownerId: userId,
      parentStoreCode: parentRestaurantId,
      originStoreCode: storeId,
      isAvailable: true
    }
  
    doCreate({ variables: { productCreateInput } });
  };

  if(loading || storePlanLoading)
    return <InLineLoader />;

  if(error || storePlanError)
    return <div>Error Fetching Data</div>;

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Add Product</DrawerTitle>
      </DrawerTitleWrapper>

      <Form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
        <Scrollbars
          autoHide
          renderView={(props) => (
            <div {...props} style={{ ...props.style, overflowX: 'hidden' }} />
          )}
          renderTrackHorizontal={(props) => (
            <div
              {...props}
              style={{ display: 'none' }}
              className="track-horizontal"
            />
          )}
        >
          <Row>
            <Col lg={4}>
              <FieldDetails>Upload your Product image here</FieldDetails>
            </Col>
            <Col lg={8}>
              <DrawerBox
                overrides={{
                  Block: {
                    style: {
                      width: '100%',
                      height: 'auto',
                      padding: '30px',
                      borderRadius: '3px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  },
                }}
              >
                <Uploader onChange={uploadImage} />
              </DrawerBox>
            </Col>
          </Row>

          <Row>
            <Col lg={4}>
              <FieldDetails>
                Add your Product description and necessary information from here
              </FieldDetails>
            </Col>

            <Col lg={8}>
              <DrawerBox>
                <FormFields>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    name="productName"
                    inputRef={register({ required: true, minLength: 3, maxLength: 20 })}
                  />
                  {errors.productName && (
                    <div
                      style={{
                        margin: "5px 0 0 auto",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "rgb(252, 92, 99)",
                      }}
                    >
                      {errors.productName.type === "required"
                        ? "Required"
                        : (errors.productName.type === "minLength" ||
                            errors.productName.type === "maxLength") &&
                          "Product Name must be 3-20 characters"}
                    </div>
                  )}
                </FormFields>

                <FormFields>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Price</FormLabel>
                  <Input
                    type="number"
                    name="price"
                    value={priceSplit.price.toString()}
                    min="0"
                    inputRef={register}
                    onChange={handlePriceChange}
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Price Without VAT</FormLabel>
                  <Input
                    type="number"
                    name="priceWithoutVat"
                    value={priceSplit.priceWithoutVat.toString()}
                    min="0"
                    inputRef={register}
                    onChange={handlePriceChange}
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Max Quantity</FormLabel>
                  <Input
                    type="number"
                    name="quantity"
                    inputRef={register({
                      required: true,
                      validate: (value) =>
                        value > 0 ? true : "invalid maxQuantity"
                    })}
                  />
                  {errors.quantity && (
                    <div
                      style={{
                        margin: "5px 0 0 auto",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "rgb(252, 92, 99)",
                      }}
                    >
                      {errors.quantity.type === "required"
                        ? "Required"
                        : (errors.quantity.message === "invalid maxQuantity" &&
                          "Max quantity must be greater than zero")
                      }
                    </div>
                  )}
                </FormFields>

                <FormFields>
                  <FormLabel>Category</FormLabel>
                  <Select
                    options={categories}
                    labelKey="label"
                    valueKey="value"
                    placeholder="Category"
                    value={category}
                    searchable={false}
                    clearable={false}
                    onChange={handleCategoryChange}
                    overrides={{
                      Placeholder: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      DropdownListItem: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      OptionContent: {
                        style: ({ $theme, $selected }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $selected
                              ? $theme.colors.textDark
                              : $theme.colors.textNormal,
                          };
                        },
                      },
                      SingleValue: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      Popover: {
                        props: {
                          overrides: {
                            Body: {
                              style: { zIndex: 5 },
                            },
                          },
                        },
                      },
                    }}
                  />
                  {errors.category && (
                    <div
                      style={{
                        margin: "5px 0 0 auto",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "rgb(252, 92, 99)",
                      }}
                    >
                      {errors.category.type === "required" && "Required" }
                    </div>
                  )}
                </FormFields>
              </DrawerBox>
            </Col>
          </Row>
        </Scrollbars>

        <ButtonGroup>
          <Button
            type="button"
            kind={KIND.minimal}
            onClick={closeDrawer}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: '50%',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  borderBottomRightRadius: '3px',
                  borderBottomLeftRadius: '3px',
                  marginRight: '15px',
                  color: $theme.colors.red400,
                }),
              },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={saving || productPicture.uploading}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: '50%',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  borderBottomRightRadius: '3px',
                  borderBottomLeftRadius: '3px',
                }),
              },
            }}
          >
            {saving ? "Saving" : "Create Product"}
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddProduct;
