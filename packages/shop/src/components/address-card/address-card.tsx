import React, { useContext } from "react";
import * as Yup from "yup";
import { withFormik, FormikProps, Form } from "formik";
import { closeModal } from "@redq/reuse-modal";
import TextField from "components/forms/text-field";
import { Button } from "components/button/button";
import { useMutation } from "@apollo/client";
import { M_ADD_ADDRESS } from "graphql/mutation/add-address.mutation";
import { FieldWrapper, Heading } from "./address-card.style";
import { ProfileContext } from "contexts/profile/profile.context";
import { FormattedMessage } from "react-intl";

// Shape of form values
interface FormValues {
  id?: number | null;
  name?: string;
  info?: string;
  buildingNo?: string;
}

// The type of props MyForm receives
interface MyFormProps {
  item?: any | null;
}

// Wrap our form with the using withFormik HoC
const FormEnhancer = withFormik<MyFormProps, FormValues>({
  // Transform outer props into form values
  mapPropsToValues: (props) => {
    return {
      id: props.item.id || null,
      name: props.item.name || "",
      info: props.item.info || "",
      buildingNo: props.item.buildingNo || "",
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Title is required!"),
    info: Yup.string().required("Address is required"),
    buildingNo: Yup.string().required("Builidng No. is required"),
  }),
  handleSubmit: (values) => {
    // do submitting things
  },
});

const UpdateAddress = (props: FormikProps<FormValues> & MyFormProps) => {
  const {
    isValid,
    item,
    values,
    touched,
    errors,
    dirty,
    handleChange,
    handleBlur,

    handleReset,
    isSubmitting,
  } = props;
  const addressValue = {
    id: values.id,
    type: "secondary",
    name: values.name,
    info: values.info,
    buildingNo: values.buildingNo,
  };
  const { state, dispatch } = useContext(ProfileContext);

  const [addressMutation, { data }] = useMutation(M_ADD_ADDRESS, {
    onCompleted: (data) => {
      if (data && data.saveAddress && data.saveAddress.id) {
        const { saveAddress } = data;
        const newAddress = {
          id: saveAddress.id,
          name: saveAddress.name,
          address: saveAddress.address,
          buildingNo: saveAddress.buildingNo,
        };
        dispatch({ type: "ADD_OR_UPDATE_ADDRESS", payload: newAddress });
        closeModal();
      }
    },
  });

  const handleSubmit = async () => {
    if (isValid) {
      const addressInput = {
        name: addressValue.name,
        buildingNo: addressValue.buildingNo,
        address: addressValue.info,
        geoHash: "t9x39vg",
        location: {
          coordinates: [77.77962228101195, 8.732943300976322],
          type: "Point",
        },
      };
      const response = await addressMutation({
        variables: { addressInput },
      });
    }
  };
  return (
    <Form>
      <Heading>{item && item.id ? "Edit Address" : "Add New Address"}</Heading>
      <FieldWrapper>
        <TextField
          id="name"
          type="text"
          placeholder="Enter Title"
          error={touched.name && errors.name}
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FieldWrapper>

      <FieldWrapper>
        <TextField
          id="buildingNo"
          type="text"
          placeholder="Building And Building No."
          value={values.buildingNo}
          error={touched.buildingNo && errors.buildingNo}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FieldWrapper>

      <FieldWrapper>
        <TextField
          id="info"
          as="textarea"
          placeholder="Enter Address"
          error={touched.info && errors.info}
          value={values.info}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FieldWrapper>

      <Button
        onClick={handleSubmit}
        type="submit"
        style={{ width: "100%", height: "44px" }}
      >
        <FormattedMessage
          id={item && item.id ? "updateAddressBtn" : "saveAddressBtn"}
          defaultMessage="Save Address"
        />
      </Button>
    </Form>
  );
};

export default FormEnhancer(UpdateAddress);
