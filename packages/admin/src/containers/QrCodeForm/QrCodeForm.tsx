import React, { useState, useCallback } from "react";
import { useDrawerDispatch } from "context/DrawerContext";
import { Scrollbars } from "react-custom-scrollbars";
import Button, { KIND } from "components/Button/Button";
import DrawerBox from "components/DrawerBox/DrawerBox";
import { Row, Col } from "components/FlexBox/FlexBox";
import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  ButtonGroup,
} from "../DrawerItems/DrawerItems.style";
import { FormFields } from "components/FormFields/FormFields";
import { useQuery } from '@apollo/client';
import { Q_GET_USER_ID, Q_GET_RESTAURANT } from '../../services/GQL';
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

  const [qrcode, setQrcode] = useState("");
  const [downloading, setDownloading] = useState(false);

  const { data: { userId } } = useQuery(Q_GET_USER_ID);

  const { loading, error } = useQuery(Q_GET_RESTAURANT, {
    context: { clientName: "CONTENT_SERVER" },
    variables: { ownerId: userId },
    onCompleted: ({ getStore }) => {
      const { domain } = getStore;
      if(domain) {
        setDownloading(true);
        axios({
          url: `https://api.qrserver.com/v1/create-qr-code/?data=${domain}&size=120x120`,
          method: "GET",
          responseType: "blob"
        }).then((res: DownloadRes) => {
          const qrImage = window.URL.createObjectURL(new Blob([res.data]));
          setQrcode(qrImage);
          setDownloading(false);
        });
      }
    }
  });

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

  if(loading || downloading)
    return <InLineLoader />;
  
  if(error)
    return <div>Error! {error.message}</div>;

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Generate QR Code</DrawerTitle>
      </DrawerTitleWrapper>

      <Form style={{ height: "100%" }}>
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
            <Col lg={6}>
              <DrawerBox>
                <FormFields>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "150px",
                      backgroundColor: "rgba(0,0,0,.05)",
                      padding: "15px"
                    }}
                  >
                    {qrcode ? (
                      <img src={qrcode} alt="" />
                    ) : (
                      <div>Unable to generate qr code... try again later</div>
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
                              paddingTop: "10px",
                              paddingBottom: "10px",
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
                              borderBottomLeftRadius: "3px",
                              paddingTop: "10px",
                              paddingBottom: "10px"
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
            Close
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default GenerateQrCode;
