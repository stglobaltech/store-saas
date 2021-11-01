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
import { uploadFile } from 'services/REST/restaurant.service';
import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { useQuery, useMutation } from '@apollo/client';
import { Q_GET_STORE_ID, M_EDIT_PRODUCT } from 'services/GQL';
import { useNotifier } from 'react-headless-notifier';
import SuccessNotification from '../../components/Notification/SuccessNotification';
import DangerNotification from '../../components/Notification/DangerNotification';

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
    defaultValues: data,
  });

  useEffect(() => {
    register({ name: 'description' });
  }, [register]);

  const [productPicture, setProductPicture] = useState({
    url: undefined,
    uploading: false
  });
  const [description, setDescription] = useState(data.description.en);
  const [priceSplit, setPriceSplit] = useState({
    price: data.price.price,
    priceWithoutVat: data.price.basePrice,
    vatPrice: data.price.vatPrice
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
    uploadFile(formData)
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

  const handlePriceChange = (e) => {
    let price, priceWithoutVat, vatPrice;
    price = Number(e.target.value);
    if (price > 0) {
      priceWithoutVat = (price - price * 0.05).toFixed(2);
      vatPrice = (price - priceWithoutVat).toFixed(2);
      setPriceSplit({ price, priceWithoutVat, vatPrice });
    } else {
      setPriceSplit({ price: "0", priceWithoutVat: "0", vatPrice: "0" });
    }
  }

  const onSubmit = (values) => {
    const productEditInput = {
      _id: data._id,
      storeId,
      productName: {
        en: values.productName.en,
        ar: ""
      },
      price: {
        price: parseFloat(priceSplit.price),
        basePrice: parseFloat(priceSplit.priceWithoutVat),
        vatPrice: parseFloat(priceSplit.vatPrice)
      },
      maxQuantity: parseFloat(values.maxQuantity),
      description: {
        en: description,
        ar: ""
      },
      picture: productPicture.url
    }
    
    doUpdate({ variables: { productEditInput } });
  };

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
                    name="productName.en"
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
                      {errors.productName.en.type === "required"
                        ? "Required"
                        : (errors.productName.en.type === "minLength" ||
                            errors.productName.en.type === "maxLength") &&
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
                    name="price.price"
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
