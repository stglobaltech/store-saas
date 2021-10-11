import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDrawerDispatch } from "context/DrawerContext";
import { Scrollbars } from "react-custom-scrollbars";
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

type Props = any;

const GenerateQrCode: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), [
    dispatch,
  ]);

  const { register, handleSubmit, getValues } = useForm();
  const [qrcode, setQrcode] = useState("");

  const generate = () => {
    const url = getValues("url");
    url &&
      setQrcode(
        `http://api.qrserver.com/v1/create-qr-code/?data=${url}&size=120x120`
      );
  };

  const onSubmit = (data) => {
    closeDrawer();
    console.log(data);
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Generate QR Code</DrawerTitle>
      </DrawerTitleWrapper>

      <Form onSubmit={handleSubmit(onSubmit)} style={{ height: "100%" }}>
        <Scrollbars
          autoHide
          renderView={(props) => (
            <div {...props} style={{ ...props.style, overflowX: "hidden" }} />
          )}
          renderTrackHorizontal={(props) => (
            <div
              {...props}
              style={{ display: "none" }}
              className="track-horizontal"
            />
          )}
        >
          <Row>
            <Col lg={4}>
              <FieldDetails>
                Add name and url to generate qr code from here
              </FieldDetails>
            </Col>

            <Col lg={8}>
              <DrawerBox>
                <FormFields>
                  <FormLabel>Name</FormLabel>
                  <Input inputRef={register({ required: true })} name="name" />
                </FormFields>

                <FormFields>
                  <FormLabel>Menu URL</FormLabel>
                  <Input
                    inputRef={register({ required: true })}
                    name="url"
                    onChange={() => setQrcode("")}
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>QR Code</FormLabel>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "150px",
                      backgroundColor: "rgba(0,0,0,.05)",
                    }}
                  >
                    {qrcode ? (
                      <img src={qrcode} />
                    ) : (
                      <Button type="button" onClick={generate}>
                        Generate
                      </Button>
                    )}
                  </div>
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
            type="submit"
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
            Generate Code
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default GenerateQrCode;
