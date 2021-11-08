import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@apollo/client';
import { useDrawerDispatch, useDrawerState } from 'context/DrawerContext';
import { Scrollbars } from 'react-custom-scrollbars';
import Input from 'components/Input/Input';
import Select from 'components/Select/Select';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';
import Uploader from 'components/Uploader/Uploader';
import { GetBannerURL } from 'services/REST/discount.service';
import { Q_GET_USER_ID, Q_GET_RESTAURANT, M_CREATE_DISCOUNT } from 'services/GQL';
import { useNotifier } from 'react-headless-notifier';
import SuccessNotification from '../../components/Notification/SuccessNotification';
import DangerNotification from '../../components/Notification/DangerNotification';

interface imgUploadRes {[
  urlText: string
]: any}

type Props = any;

const AddCoupon: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);

  const { notify } = useNotifier();
  const refetch = useDrawerState('data');

  const promotionTypes = [
    { value: "PROMOCODE", label: "PROMOCODE" },
    { value: "OFFER", label: "OFFER" }
  ];
  const discountInTypes = [
    { value: "Store", label: "Store" }
  ];
  const discountTypes = [
    { value: "instant", label: "instant" },
    { value: "cashback", label: "cashback" }
  ];
  const units = [
    { value: "PERCENTAGE", label: "PERCENTAGE" },
    { value: "COST", label: "COST" }
  ];

  const { register, handleSubmit, getValues, formState: { errors } } = useForm({ mode: 'onChange' });
  const [offer, setOffer] = useState({
    category: [promotionTypes[0]],
    discountIn: [discountInTypes[0]],
    discountType: [discountTypes[0]],
    discountUnit: [units[0]],
    discountValue: 0,
    maximumValue: 0,
    image: undefined,
    imageLoader: false,
    imageError: ""
  });

  const { data: { userId } } = useQuery(Q_GET_USER_ID);

  const { error, data: storeData } = useQuery(Q_GET_RESTAURANT, {
    context: { clientName: "CONTENT_SERVER" },
    variables: { ownerId: userId }
  });

  const [doCreate, { loading: saving }] = useMutation(M_CREATE_DISCOUNT, {
    onCompleted: (data) => {
      closeDrawer();
      if (data && data.createDiscount && data.createDiscount.success) {
        notify(
          <SuccessNotification
            message={data.createDiscount.message.en}
            dismiss
          />
        );

        refetch();
      }
      else
        notify(
          <DangerNotification
            message={data.createDiscount.message.en}
            dismiss
          />
        );
    }
  });

  const uploadImage = (files) => {
    setOffer({ ...offer, imageLoader: true });
    const formData = new FormData();
    formData.append("file", files[0], files[0].name);
    GetBannerURL(formData)
      .then((result: imgUploadRes) => {
        setOffer({
          ...offer,
          image: result.urlText,
          imageLoader: false,
          imageError: ""
        });
      })
      .catch(() => {
        setOffer({
          ...offer,
          image: undefined,
          imageLoader: false,
          imageError: "Something went wrong! Either continue without banner or try after sometime"
        });
      });
  };

  const onSubmit = (values) => {
    const discountCreateInput = {
      name: values.name,
      arName: values.arName,
      startsOn: values.startsOn,
      endsOn: values.endsOn,
      category: offer.category[0].value,
      isConditional: false,
      discountValue: Number(offer.discountValue),
      discountUnit: offer.discountUnit[0].value,
      maximumValue: Number(offer.maximumValue),
      discountIn: offer.discountIn[0].value,
      discountFor: "store",
      discountType: offer.discountType[0].value,
      discountToEntities: {},
      conditionals: {
        firstOrder: false,
        purchaseAbove: 0,
        offerDays: [],
        timings: "",
        paymentType: []
      },
      restaurant: {
        name: storeData.getStore.name.en,
        _id: storeData.getStore._id
      }
    };

    doCreate({ variables: { discountCreateInput } });
  };

  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Add Coupon</DrawerTitle>
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
              <FieldDetails>
                Add your coupon description and necessary informations from
                here
              </FieldDetails>
            </Col>

            <Col lg={8}>
              <DrawerBox>
                <FormFields>
                  <FormLabel>Promotion Type</FormLabel>
                  <Select
                    options={promotionTypes}
                    labelKey="label"
                    valueKey="value"
                    value={offer.category}
                    searchable={false}
                    clearable={false}
                    onChange={({ value }) => setOffer({...offer, category: value})}
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
                </FormFields>

                <FormFields>
                  <FormLabel>{offer.category[0].value === "OFFER" ? "Offer" : "Promocode"} Name in English</FormLabel>
                  <Input
                    name="name"
                    placeholder="Name in English"
                    inputRef={register({ required: true, minLength: 3, maxLength: 15 })}
                  />
                  {errors.name && (
                    <div
                      style={{
                        margin: "5px 0 0 auto",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "rgb(252, 92, 99)",
                      }}
                    >
                      {errors.name.type === "required"
                        ? "Required"
                        : (errors.name.type === "minLength" ||
                            errors.name.type === "maxLength") &&
                          "Offer Name or Promocode Name must be 3-15 characters"
                      }
                    </div>
                  )}
                </FormFields>

                <FormFields>
                  <FormLabel>{offer.category[0].value === "OFFER" ? "Offer" : "Promocode"} Name in Arabic</FormLabel>
                  <Input
                    name="arName"
                    placeholder="Name in Arabic"
                    inputRef={register({ required: true, minLength: 3, maxLength: 15 })}
                  />
                  {errors.arName && (
                    <div
                      style={{
                        margin: "5px 0 0 auto",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "rgb(252, 92, 99)",
                      }}
                    >
                      {errors.arName.type === "required"
                        ? "Required"
                        : (errors.arName.type === "minLength" ||
                            errors.arName.type === "maxLength") &&
                            "Offer Name or Promocode Name must be 3-15 characters"
                      }
                    </div>
                  )}
                </FormFields>

                <FormFields>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    type="date"
                    name="startsOn"
                    inputRef={register({ required: true })}
                  />
                  {errors.startsOn && errors.startsOn.type === "required" && (
                    <div
                      style={{
                        margin: "5px 0 0 auto",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "rgb(252, 92, 99)",
                      }}
                    >
                      Required
                    </div>
                  )}
                </FormFields>

                <FormFields>
                  <FormLabel>End Date</FormLabel>
                  <Input
                    type="date"
                    name="endsOn"
                    inputRef={register({
                      required: true,
                      validate: (value) => {
                        const startDate = getValues("startsOn");
                        if (
                          new Date(startDate).getTime() >
                          new Date(value).getTime()
                        ) {
                          return false;
                        }
                        return true;
                      }
                    })}
                  />
                  {errors.endsOn && (
                    <div
                      style={{
                        margin: "5px 0 0 auto",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "rgb(252, 92, 99)",
                      }}
                    >
                      {errors.endsOn.type === "required"
                        ? "Required"
                        : (errors.endsOn.type === "validate" &&
                            "Select Proper Date.Expiry Date Should Be Greater Than Start Date"
                      )}
                    </div>
                  )}
                </FormFields>

                <FormFields>
                  <FormLabel>Discount In</FormLabel>
                  <Select
                    options={discountInTypes}
                    labelKey="label"
                    valueKey="value"
                    value={offer.discountIn}
                    searchable={false}
                    clearable={false}
                    onChange={({ value }) => setOffer({...offer, discountIn: value})}
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
                </FormFields>

                <FormFields>
                  <FormLabel>Discount Type</FormLabel>
                  <Select
                    options={discountTypes}
                    labelKey="label"
                    valueKey="value"
                    value={offer.discountType}
                    searchable={false}
                    clearable={false}
                    onChange={({ value }) => setOffer({...offer, discountType: value})}
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
                </FormFields>

                <FormFields>
                  <FormLabel>Value</FormLabel>
                  <Input
                    type="number"
                    name="discountValue"
                    value={offer.discountValue}
                    placeholder="Offer Value"
                    inputRef={register}
                    onChange={(e) => setOffer({...offer, discountValue: e.target.value})}
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Unit</FormLabel>
                  <Select
                    options={units}
                    labelKey="label"
                    valueKey="value"
                    value={offer.discountUnit}
                    searchable={false}
                    clearable={false}
                    onChange={({ value }) => setOffer({...offer, discountUnit: value})}
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
                </FormFields>

                <FormFields>
                  <FormLabel>Maximum Value</FormLabel>
                  <Input
                    type="number"
                    name="maximumValue"
                    value={offer.maximumValue}
                    placeholder="Maximum Value"
                    pattern={"[0-9]"}
                    inputRef={register}
                    onChange={(e) => setOffer({...offer, maximumValue: e.target.value})}
                  />
                </FormFields>
              </DrawerBox>
            </Col>
          </Row>

          {/* TODO: Change value offers to offer in ln 563 */}
          {offer.category[0].value === "OFFERS" && (
          <Row>
            <Col lg={4}>
              <FieldDetails>Upload your Banner image here</FieldDetails>
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
              {offer.imageError.length && (
                <div
                  style={{
                    margin: "5px 0 30px auto",
                    fontFamily: "Lato, sans-serif",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "rgb(252, 92, 99)",
                    textAlign: "right"
                  }}
                >
                  {offer.imageError}
                </div>
              )}
            </Col>
          </Row>
          )}
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
            disabled={offer.imageLoader || saving}
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
            {saving ? "Saving" : "Create Coupon"}
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddCoupon;
