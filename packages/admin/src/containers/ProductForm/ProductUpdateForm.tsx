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
import { FormFields, FormLabel } from 'components/FormFields/FormFields';
import { uploadProductImge } from 'services/REST/product.service';
import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { useQuery, useMutation } from '@apollo/client';
import { Q_GET_STORE_ID, Q_STORE_PLAN_FOR_USER_WEB_ADMIN, M_EDIT_PRODUCT } from 'services/GQL';
import { useNotifier } from 'react-headless-notifier';
import SuccessNotification from '../../components/Notification/SuccessNotification';
import DangerNotification from '../../components/Notification/DangerNotification';
import { InLineLoader } from 'components/InlineLoader/InlineLoader';

interface imgUploadRes {[
  urlText: string
]: any}

type Props = any;

const AddProduct: React.FC<Props> = () => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);

  const { notify } = useNotifier();

  const data = useDrawerState('data');
  const { queryToRefetch } = data;

  const { data: { storeId } } = useQuery(Q_GET_STORE_ID);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      productNameEn: data.productName.en,
      productNameAr:data.productName.ar,
      maxQuantity: data.maxQuantity
    },
  });

  useEffect(() => {
    register({ name: 'description' });
    register({name:"descriptionRegional"})
  }, [register]);

  const [productPicture, setProductPicture] = useState({
    url: undefined,
    uploading: false
  });
  const [description, setDescription] = useState(data.description.en);
  const [descriptionRegional,setDescriptionRegional]=useState(data.description.ar);
  const [priceSplit, setPriceSplit] = useState({
    price: data.price.price,
    priceWithoutVat: data.price.basePrice,
    vatPrice: data.price.vatPrice
  });

  const { data: storePlan, loading: storePlanLoading, error: storePlanError } = useQuery(Q_STORE_PLAN_FOR_USER_WEB_ADMIN, {
    variables: { storeId }
  });

  const [doUpdate, { loading: updating }] = useMutation(M_EDIT_PRODUCT, {
    onCompleted: (data) => {
      closeDrawer();
      if (data.editProduct.success) {
        notify(
          <SuccessNotification
            message={data.editProduct.message.en}
            dismiss
          />
        );
        
        queryToRefetch();
      }
      else
        notify(
          <DangerNotification
            message={data.editProduct.message.en}
            dismiss
          />
        );
    }
  });

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

  const handleRegionalDescriptionChange=(e)=>{
    const value=e.target.value;
    setValue("descriptionRegional",value);
    setDescriptionRegional(value);
  }

  const vatPercentage = (storePlanData) => {
    const nullish = [null, undefined];
    if (
      storePlanData &&
      !nullish.includes(storePlanData.globalVat) &&
      storePlanData.plan &&
      storePlanData.plan.length &&
      !nullish.includes(storePlanData.plan[0].vat)
    ) {
      return storePlanData.plan[0].vat;
    } else if (
      storePlanData &&
      !nullish.includes(storePlanData.globalVat) &&
      (!storePlanData.plan ||
        (storePlanData.plan &&
          storePlanData.plan.length &&
          nullish.includes(storePlanData.plan[0].vat)))
    ) {
      return storePlanData.globalVat;
    } else if (
      storePlanData &&
      nullish.includes(storePlanData.globalVat) &&
      storePlanData.plan &&
      storePlanData.plan.length &&
      !nullish.includes(storePlanData.plan[0].vat)
    ) {
      return storePlanData.plan[0].vat;
    }
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

  const onSubmit = (values) => {
    const productEditInput = {
      _id: data._id,
      storeId,
      productName: {
        en: values.productNameEn,
        ar: values.productNameAr
      },
      price: {
        price: parseFloat(priceSplit.price),
        basePrice: parseFloat(priceSplit.priceWithoutVat),
        vatPrice: parseFloat(priceSplit.vatPrice),
        vatPercentage: vatPercentage(storePlan.getStorePlanForUserWebAdmin.data)
      },
      maxQuantity: parseFloat(values.maxQuantity),
      description: {
        en: description,
        ar: descriptionRegional
      },
      picture: productPicture.url
    }
    
    doUpdate({ variables: { productEditInput } });
  };

  if(storePlanLoading)
    return <InLineLoader />;

  if(storePlanError)
    return <div>Error Fetching Data</div>;

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Update Product</DrawerTitle>
      </DrawerTitleWrapper>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        style={{ height: '100%' }}
      >
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
              <DrawerBox>
                <Uploader onChange={uploadImage} imageURL={data.picture} />
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
                    name="productNameEn"
                    inputRef={register({ required: true, minLength: 3, maxLength: 20 })}
                  />
                  {errors.productNameEn && (
                    <div
                      style={{
                        margin: "5px 0 0 auto",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "rgb(252, 92, 99)",
                      }}
                    >
                      {errors.productNameEn.type === "required"
                        ? "Required"
                        : (errors.productNameEn.type === "minLength" ||
                            errors.productNameEn.type === "maxLength") &&
                          "Product Name must be 3-20 characters"}
                    </div>
                  )}
                </FormFields>

                <FormFields>
                  <FormLabel>Product Name (Regional Language)</FormLabel>
                  <Input
                    name="productNameAr"
                    inputRef={register({ required: true, minLength: 3, maxLength: 20 })}
                  />
                  {errors.productNameAr && (
                    <div
                      style={{
                        margin: "5px 0 0 auto",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "rgb(252, 92, 99)",
                      }}
                    >
                      {errors.productNameAr.type === "required"
                        ? "Required"
                        : (errors.productNameAr.type === "minLength" ||
                            errors.productNameAr.type === "maxLength") &&
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
                  <FormLabel>Description (Regional Language)</FormLabel>
                  <Textarea
                    value={descriptionRegional}
                    onChange={handleRegionalDescriptionChange}
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
                    name="maxQuantity"
                    inputRef={register({
                      required: true,
                      validate: (value) =>
                        value > 0 ? true : "invalid maxQuantity"
                    })}
                  />
                  {errors.maxQuantity && (
                    <div
                      style={{
                        margin: "5px 0 0 auto",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "rgb(252, 92, 99)",
                      }}
                    >
                      {errors.maxQuantity.type === "required"
                        ? "Required"
                        : (errors.maxQuantity.message === "invalid maxQuantity" &&
                          "Max quantity must be greater than zero")
                      }
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
            disabled={updating || productPicture.uploading}
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
            {updating ? "Updating" : "Update Product"}
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddProduct;
