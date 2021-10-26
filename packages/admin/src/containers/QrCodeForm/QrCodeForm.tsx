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
import { useQuery, useMutation } from '@apollo/client';
import { Q_GET_USER_ID, Q_GET_RESTAURANT, M_UPDATE_DOMAIN_AND_URL } from '../../services/GQL';
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

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();
  const [storeId, setStoreId] = useState("");
  const [qrcode, setQrcode] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState({
    success : false,
    message: ""
  });

  const { data: { userId } } = useQuery(Q_GET_USER_ID);

  const { loading, error } = useQuery(Q_GET_RESTAURANT, {
    context: { clientName: "CONTENT_SERVER" },
    variables: { ownerId: userId },
    onCompleted: ({ getStore }) => {
      const { _id, domain, url } = getStore;
      setStoreId(_id);
      setValue("domain", domain);
      setValue("url", url);
      generate();
    }
  });

  const [doUpdate, { loading: updating }] = useMutation(M_UPDATE_DOMAIN_AND_URL, {
    onCompleted: (data) => {
      if (data && data.updateDomainAndUrl)
        setUpdateStatus({success: true, message: "Domain and URL Updated Successfully"});
      else
        setUpdateStatus({success: false, message: "Domain and URL Could Not Be Updated"});
    }
  });

  const onChangeDomain = () => {
    setValue("url", `https://${getValues("domain")}.orderznow.com`);
    setQrcode("");
  };

  const generate = () => {
    const domain = getValues("domain");
    const url = getValues("url");
    if(domain && url) {
      setDownloading(true);
      axios({
        url: `https://api.qrserver.com/v1/create-qr-code/?data=${url}&size=120x120`,
        method: "GET",
        responseType: "blob"
      }).then((res: DownloadRes) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        setQrcode(url);
        setDownloading(false);
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

  const onSubmit = (values) => {
    doUpdate({ variables: {
      input: {
        _id: storeId,
        domain: values.domain,
        url: getValues("url")
      }
    }});
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

          {updateStatus.message && (
            updateStatus.success ? (
              <div style={{
                padding: "0.75rem 1.25rem",
                marginBottom: "1rem",
                border: "1px solid transparent",
                borderRadius: "0.25rem",
                color: "#155724",
                backgroundColor: "#d4edda",
                borderColor: "#c3e6cb"
              }}>
                {updateStatus.message}
              </div>
            ) : (
              <div style={{
                padding: "0.75rem 1.25rem",
                marginBottom: "1rem",
                border: "1px solid transparent",
                borderRadius: "0.25rem",
                color: "#721c24",
                backgroundColor: "#f8d7da",
                borderColor: "#f5c6cb"
              }}>
                {updateStatus.message}
              </div>
          ))}

          <Row>
            <Col lg={4}>
              <FieldDetails>
                Add domain and url to generate qr code from here
              </FieldDetails>
            </Col>

            <Col lg={8}>
              <DrawerBox>
                <FormFields>
                  <FormLabel>Domain</FormLabel>
                  <Input
                    name="domain"
                    inputRef={register({ required: true, minLength: 3, maxLength: 20 })}
                    onChange={onChangeDomain}
                  />
                  {errors.domain &&
                    <div style={{
                      margin: "5px 0 0 auto",
                      fontFamily: "Lato, sans-serif",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "rgb(252, 92, 99)"
                    }}>
                      {errors.domain.type === "required" ? "Required" : (
                        (errors.domain.type === "minLength" || errors.domain.type === "maxLength") &&
                        "Domain name must be 3-20 characters"
                      )}
                    </div>
                  }
                </FormFields>

                <FormFields>
                  <FormLabel>Menu URL</FormLabel>
                  <Input
                    name="url"
                    inputRef={register}
                    disabled
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
                      <Button type="button" onClick={generate} disabled={downloading}>
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
            disabled={updating}
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
