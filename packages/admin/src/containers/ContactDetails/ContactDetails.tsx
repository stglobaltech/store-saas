import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import Input from "components/Input/Input";
import Button, { KIND } from "components/Button/Button";
import { Grid, Row, Col } from "components/FlexBox/FlexBox";
import { Form } from "../DrawerItems/DrawerItems.style";
import { FormFields, FormLabel } from "components/FormFields/FormFields";
import { useQuery, useMutation } from "@apollo/client";
import {
  Q_GET_USER_ID,
  Q_GET_RESTAURANT,
  M_UPDATE_STORECONTACTADDRESS,
} from "../../services/GQL";
import { InLineLoader } from "../../components/InlineLoader/InlineLoader";
import Select from "components/Select/Select";
import UpdateAddressMap from "components/Map/UpdateAddressMap";
import { useNotifier } from "react-headless-notifier";
import SuccessNotification from "../../components/Notification/SuccessNotification";
import DangerNotification from "../../components/Notification/DangerNotification";
import { useHistory } from "react-router-dom";

type Props = {};

const ContactDetails: React.FC<Props> = () => {
  const history = useHistory();
  const { notify } = useNotifier();

  const {
    data: { userId },
  } = useQuery(Q_GET_USER_ID);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [storeId, setStoreId] = useState("");
  const [countryCode, setCountryCode] = useState([]);
  const [addressState, setAddressState] = useState({
    address: "",
    coordinates: [],
    type: "Point",
  });

  useEffect(() => {
    register({ name: "countryCode" });
  }, [register]);

  const { loading, error, data } = useQuery(Q_GET_RESTAURANT, {
    context: { clientName: "CONTENT_SERVER" },
    variables: { ownerId: userId },
    onCompleted: ({ getStore }) => {
      setStoreId(getStore._id);
      setValue("countryCode", getStore.countryCode);
      setValue("contactNumber", getStore.contactNumber);
      setCountryCode([
        { value: getStore.countryCode, label: getStore.countryCode },
      ]);
      setAddressState({ ...addressState, address: getStore.address });
    },
  });

  const [updateAddress, { loading: updating }] = useMutation(
    M_UPDATE_STORECONTACTADDRESS,
    {
      onCompleted: (data) => {
        if (
          data &&
          data.editStoreContactAddress &&
          data.editStoreContactAddress.success
        )
          notify(
            <SuccessNotification
              message={data.editStoreContactAddress.message.en}
              dismiss
            />
          );
        else
          notify(
            <DangerNotification
              message={data.editStoreContactAddress.message.en}
              dismiss
            />
          );
      },
    }
  );

  const onCountryCodeChange = ({ value }) => {
    setValue("countryCode", value[0].value);
    setCountryCode(value);
  };

  const handleAddress = useCallback((addressData) => {
    let pos = {
      lat: addressData.position.lat(),
      lng: addressData.position.lng(),
    };
    setAddressState({
      address: addressData.formatted_address,
      coordinates: [pos.lng, pos.lat],
      type: "Point",
    });
  }, []);

  const checkKeyDownForOnSubmit = (e) => {
    if (e.keyCode === 13) e.preventDefault();
  };

  const onSubmit = (values) => {
    const countryCodes = {
      IND: "+91",
      KWT: "+965",
      KSA: "+966",
      OMN: "+968",
      UAE: "+971",
      QAT: "+974",
    };

    let storeEditInput = {
      _id: storeId,
      countryCode: "",
      contactNumber: values.contactNumber,
      address: addressState.address,
      coordinates: addressState.coordinates,
      type: addressState.type,
    };

    Object.keys(countryCodes).forEach((key) => {
      if (countryCodes[key] === values.countryCode) {
        storeEditInput.countryCode = key;
      }
    });

    updateAddress({ variables: { storeEditInput } });
  };

  if (loading) return <InLineLoader />;

  if (error) return <div>Error! {error.message}</div>;

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Button
            type="button"
            kind={KIND.secondary}
            onClick={history.goBack}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                  borderBottomRightRadius: "3px",
                  borderBottomLeftRadius: "3px",
                  color: $theme.colors.red400,
                }),
              },
            }}
          >
            Back
          </Button>
        </Col>
      </Row>

      <Form
        onKeyDown={checkKeyDownForOnSubmit}
        onSubmit={handleSubmit(onSubmit)}
        style={{ paddingBottom: 0 }}
      >
        <Row>
          <Col md={6}>
            <FormFields>
              <FormLabel>Country Code</FormLabel>
              <Select
                options={[
                  { value: "+91", label: "+91" },
                  { value: "+966", label: "+966" },
                  { value: "+965", label: "+965" },
                  { value: "+968", label: "+968" },
                  { value: "+971", label: "+971" },
                  { value: "+974", label: "+974" },
                ]}
                labelKey="label"
                valueKey="value"
                placeholder="Country code"
                value={countryCode}
                searchable={false}
                onChange={onCountryCodeChange}
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
          </Col>

          <Col md={6}>
            <FormFields>
              <FormLabel>Contact Number</FormLabel>
              <Input
                type="number"
                name="contactNumber"
                inputRef={register({
                  minLength: 8,
                  maxLength: 15,
                })}
              />
              {errors.contactNumber && (
                <div
                  style={{
                    margin: "5px 0 0 auto",
                    fontFamily: "Lato, sans-serif",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "rgb(252, 92, 99)",
                  }}
                >
                  {errors.contactNumber.type === "required"
                    ? "Required"
                    : (errors.contactNumber.type === "minLength" ||
                        errors.contactNumber.type === "maxLength") &&
                      "Contact Number must be 8-15 characters"}
                </div>
              )}
            </FormFields>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <FormFields>
              <FormLabel>Address</FormLabel>
              <Input
                name="address"
                value={addressState.address}
                inputRef={register}
                disabled
              />
              {errors.address && (
                <div
                  style={{
                    margin: "5px 0 0 auto",
                    fontFamily: "Lato, sans-serif",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "rgb(252, 92, 99)",
                  }}
                >
                  {errors.address.type === "required" && "Required"}
                </div>
              )}
            </FormFields>

            <div>
              <UpdateAddressMap
                handleAddress={handleAddress}
                storeLoc={
                  data.getStore.storeLoc && data.getStore.storeLoc.coordinates
                }
              />
            </div>
          </Col>
        </Row>

        <div style={{ textAlign: "center" }}>
          <Button
            type="submit"
            disabled={updating}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                  borderBottomLeftRadius: "3px",
                  borderBottomRightRadius: "3px",
                }),
              },
            }}
          >
            {updating ? "Updating" : "Submit"}
          </Button>
        </div>
      </Form>
    </Grid>
  );
};

export default ContactDetails;
