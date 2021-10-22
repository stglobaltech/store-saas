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
import { useQuery } from '@apollo/client';
import { Q_GET_STORE_ID, Q_WORK_FLOW_POLICY } from '../../services/GQL';
import { InLineLoader } from '../../components/InlineLoader/InlineLoader';
import axios from "axios";

interface DownloadRes {[
  data: string
]: any}

type Props = any;

const GenerateQrCode: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), [
    dispatch,
  ]);

  const { register, handleSubmit, setValue, getValues } = useForm();
  const [qrcode, setQrcode] = useState("");

  const { data: { storeId } } = useQuery(Q_GET_STORE_ID);

  const { loading, error } = useQuery(Q_WORK_FLOW_POLICY, {
    context: { clientName: "CONTENT_SERVER" },
    onCompleted: ({ workFlowPolicyApi }) => {
      const { plan } = workFlowPolicyApi;
      if(plan) {
        const storeInfo = plan.filter(function(stores) {
          return stores.storeId === storeId;
        });
        
        const newUrl = storeInfo[0].url && storeInfo[0].domain ? storeInfo[0].url + "/" + storeInfo[0].domain : storeInfo[0].url
        setValue("name", storeInfo[0].domain);
        setValue("url", newUrl);
        generate();
      }
    }
  });

  // const [docreate, { loading: updating }] = useMutation(M_UPDATE_WORK_FLOW_POLICY, {
  //   onCompleted: (data) => {
  //     console.log(data);      
  //   }
  // });

  const generate = () => {
    const url = getValues("url");
    const domain = getValues("name");
    if(url && domain) {
      axios({
        url: `http://api.qrserver.com/v1/create-qr-code/?data=${url}&size=120x120`,
        method: "GET",
        responseType: "blob"
      }).then((res: DownloadRes) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        setQrcode(url);
      });
    }
  };

  const downloadQr = () => {
      const link = document.createElement("a");
      link.href = qrcode;
      link.setAttribute("download", "image.png");
      document.body.appendChild(link);
      link.click();
  };

  const printQr = () => {
    const toPrint = `<img src="${qrcode}" />`;
    const w = window.open();
    w.document.write(toPrint);
    w.print();
    w.close();
  };

  const onSubmit = (data) => {
    // docreate({ variables: {
    //   configUpdateDto: {
    //     isFleetRequired: false,
    //     isAggregator: false,
    //     plan: {
    //       planName: "",
    //       storeId: "",
    //       storeName: "",
    //       entityId: "",
    //       expiryDate: "",
    //       url: ""
    //     }
    //   }
    // }});
    // closeDrawer();
    console.log(data);
  };

  if(loading)
    return <InLineLoader />;
  
  if(error)
    return <div>Error! {error.message}</div>;

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
                  <Input
                    name="name"
                    inputRef={register({ required: true })}
                    onChange={() => setQrcode("")}
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Menu URL</FormLabel>
                  <Input
                    name="url"
                    inputRef={register({ required: true })}
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
                      <img src={qrcode} alt="" />
                    ) : (
                      <Button type="button" onClick={generate}>
                        Generate
                      </Button>
                    )}
                  </div>

                  {qrcode && (
                    <div style={{marginTop: "16px", textAlign: "center"}}>
                      <Button type="button" onClick={downloadQr}
                        overrides={{
                          BaseButton: {
                            style: ({ $theme }) => ({
                              borderTopLeftRadius: "3px",
                              borderTopRightRadius: "3px",
                              borderBottomRightRadius: "3px",
                              borderBottomLeftRadius: "3px",
                              marginRight: "15px"
                            }),
                          },
                        }}
                      >
                        Download
                      </Button>
                      <Button type="button" onClick={printQr}
                        overrides={{
                          BaseButton: {
                            style: ({ $theme }) => ({
                              borderTopLeftRadius: "3px",
                              borderTopRightRadius: "3px",
                              borderBottomRightRadius: "3px",
                              borderBottomLeftRadius: "3px"
                            }),
                          },
                        }}
                      >
                        Print
                      </Button>
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
            Save
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default GenerateQrCode;
