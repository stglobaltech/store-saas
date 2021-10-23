import React, { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Uploader from 'components/Uploader/Uploader';
import Input from 'components/Input/Input';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Grid, Row, Col } from 'components/FlexBox/FlexBox';
import { Form, FieldDetails } from '../DrawerItems/DrawerItems.style';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';
import { useQuery, useMutation } from '@apollo/client';
import { Q_GET_USER_ID, Q_GET_RESTAURANT, M_UPDATE_RESTAURANT } from '../../services/GQL';
import { InLineLoader } from '../../components/InlineLoader/InlineLoader';
import { useDrawerDispatch } from 'context/DrawerContext';
import { uploadFile } from '../../services/REST/restaurant.service';
import { useNotifier } from 'react-headless-notifier';
import SuccessNotification from '../../components/Notification/SuccessNotification';
import DangerNotification from '../../components/Notification/DangerNotification';

interface imgUploadRes {[
  urlText: string
]: any}

type Props = {};

const StoreSettingsForm: React.FC<Props> = () => {
  const dispatch = useDrawerDispatch();
  const openQrForm = useCallback(
    () => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'QR_CODE_FORM' }),
    [dispatch]
  );

  const { notify } = useNotifier();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [storeId, setStoreId] = useState("");
  const [state, setState] = useState({
    storeLogo: undefined,
    storeLogoLoader: false
  });
  const { data: { userId } } = useQuery(Q_GET_USER_ID);

  const { loading, error, data } = useQuery(Q_GET_RESTAURANT, {
    context: { clientName: "CONTENT_SERVER" },
    variables: { ownerId: userId }
  });

  const [docreate, { loading: updating }] = useMutation(M_UPDATE_RESTAURANT, {
    onCompleted: (data) => {
      if (data && data.editStore)
        notify(
          <SuccessNotification
            message="Store Updated Successfully"
            dismiss
          />
        );
      else
        notify(
          <DangerNotification
            message="Store Could Not Be Updated"
            dismiss
          />
        );
    }
  });

  useEffect(() => {
    if(data && data.getStore) {
      const { getStore } = data;
      setStoreId(getStore._id);
      setValue('storeName', getStore.name ? getStore.name.en : "");
      setValue('description', getStore.description ? getStore.description.en : "");
      setValue('displayName', getStore.displayName ? getStore.displayName.en : "");
      setValue('address', getStore.address);
      setValue('contactNumber', getStore.contactNumber);
    }
  }, [data, setValue])

  const uploadImage = (files) => {
    setState({ ...state, storeLogoLoader: true });
    const formData = new FormData();
    formData.append("file", files[0], files[0].name);
    uploadFile(formData)
      .then((result: imgUploadRes) => {
        setState({
          ...state,
          storeLogo: result.urlText,
          storeLogoLoader: false,
        });
      })
      .catch((err) => {
        console.error(err, 'on image upload for store logo');
        setState({ ...state, storeLogoLoader: false });
      });
  };

  const onSubmit = (data) => {
    docreate({ variables: {
      storeEditInput: {
        _id: storeId,
        name: {
          en: data.storeName,
          ar: ""
        },
        description: {
          en: data.description,
          ar: ""
        },
        logo: state.storeLogo
      }
    } });
  }

  if(loading)
    return <InLineLoader />;
  
  if(error)
    return <div>Error! {error.message}</div>;

  return (
    <Grid fluid={true}>
      <Form onSubmit={handleSubmit(onSubmit)} style={{ paddingBottom: 0 }}>
        <Row>
          <Col md={4}>
            <FieldDetails>Upload your store logo here</FieldDetails>
          </Col>

          <Col md={8}>
            <DrawerBox>
              <Uploader onChange={uploadImage} imageURL={data.getStore.logo} />
            </DrawerBox>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <FieldDetails>
              Add your store description and necessary information from here
            </FieldDetails>
          </Col>

          <Col md={8}>
            <DrawerBox>
              <FormFields>
                <FormLabel>Store Name</FormLabel>
                <Input
                  name="storeName"
                  inputRef={register({ required: true, minLength: 3, maxLength: 20 })}
                />
                {errors.storeName &&
                  <div style={{
                    margin: "5px 0 0 auto",
                    fontFamily: "Lato, sans-serif",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "rgb(252, 92, 99)"
                  }}>
                    {errors.storeName.type === "required" ? "Required" : (
                      (errors.storeName.type === "minLength" || errors.storeName.type === "maxLength") &&
                      "Store Name must be 3-20 characters"
                    )}
                  </div>
                }
              </FormFields>

              <FormFields>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  inputRef={register}
                />
              </FormFields>

              <FormFields>
                <FormLabel>Display Name</FormLabel>
                <Input
                  name="displayName"
                  inputRef={register({ required: true, minLength: 3, maxLength: 20 })}
                />
                {errors.displayName &&
                  <div style={{
                    margin: "5px 0 0 auto",
                    fontFamily: "Lato, sans-serif",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "rgb(252, 92, 99)"
                  }}>
                    {errors.displayName.type === "required" ? "Required" : (
                      (errors.displayName.type === "minLength" || errors.displayName.type === "maxLength") &&
                      "Display Name must be 3-20 characters"
                    )}
                  </div>
                }
              </FormFields>

              <FormFields>
                <FormLabel>Address</FormLabel>
                <Input
                  name="address"
                  inputRef={register({ required: true })}
                />
                {errors.address &&
                  <div style={{
                    margin: "5px 0 0 auto",
                    fontFamily: "Lato, sans-serif",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "rgb(252, 92, 99)"
                  }}>
                    {errors.address.type === "required" && "Required"}
                  </div>
                }
              </FormFields>

              <FormFields>
                <FormLabel>Contact Number</FormLabel>
                <Input
                  type="number"
                  name="contactNumber"
                  inputRef={register({ required: true, minLength: 8, maxLength: 15 })}
                />
                {errors.contactNumber &&
                  <div style={{
                    margin: "5px 0 0 auto",
                    fontFamily: "Lato, sans-serif",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "rgb(252, 92, 99)"
                  }}>
                    {errors.contactNumber.type === "required" ? "Required" : (
                      (errors.contactNumber.type === "minLength" || errors.contactNumber.type === "maxLength") &&
                      "Contact Number must be 8-15 characters"
                    )}
                  </div>
                }
              </FormFields>

              <Row>
                <Col md={6}>
                  <Button
                    type="button"
                    kind={KIND.secondary}
                    onClick={openQrForm}
                    overrides={{
                      BaseButton: {
                        style: ({ $theme }) => ({
                          width: '100%',
                          borderTopLeftRadius: '3px',
                          borderTopRightRadius: '3px',
                          borderBottomRightRadius: '3px',
                          borderBottomLeftRadius: '3px'
                        }),
                      },
                    }}
                  >
                    Add QR Code
                  </Button>
                </Col>
                <Col md={6}>
                  <Button
                    type="submit"
                    disabled={updating || state.storeLogoLoader}
                    overrides={{
                      BaseButton: {
                        style: ({ $theme }) => ({
                          width: '100%',
                          borderTopLeftRadius: '3px',
                          borderTopRightRadius: '3px',
                          borderBottomLeftRadius: '3px',
                          borderBottomRightRadius: '3px',
                        }),
                      },
                    }}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </DrawerBox>
          </Col>
        </Row>
      </Form>
    </Grid>
  );
};

export default StoreSettingsForm;
