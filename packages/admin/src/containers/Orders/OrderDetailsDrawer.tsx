import React, { useCallback } from 'react';
import { useDrawerDispatch, useDrawerState } from 'context/DrawerContext';
import { Scrollbars } from 'react-custom-scrollbars';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import {
  DrawerTitleWrapper,
  DrawerTitle,
      ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { Box } from 'components/Box/Box';

type Props = any;

const OrderDetail: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const data = useDrawerState('data');
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);

  const statusLabels = (status) => {
    switch (status) {
      case 'PEN':
        return 'Pending';
      case 'CONF':
        return 'Confirmed';
      case 'FIN':
        return 'Finished';
      case 'CAN':
        return 'Cancelled';
      case 'REJ':
        return 'Rejected';
      case 'EXP':
        return 'Expired';

      default:
        break;
    }
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Order Detail - {data.shortOrderId}</DrawerTitle>
      </DrawerTitleWrapper>

      <Box style={{ height: '100%' }}>
        <Scrollbars
          autoHide
          renderView={(props) => (
            <div {...props} style={{ ...props.style, overflowX: 'hidden' }} />
          )}
          renderTrackHorizontal={(props) => (
            <div
              {...props}
              style={{ display: 'none' }}
              className='track-horizontal'
            />
          )}
        >
          {data && (
            <Row>
              <Col md={6}>
                <DrawerBox
                  overrides={{
                    Block: {
                      style: {
                        width: '100%',
                        height: 'auto',
                        padding: '30px',
                        borderRadius: '3px',
                        backgroundColor: '#ffffff',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    },
                  }}
                >
                  <Row>
                    <Col md={4}>
                      <strong>User Name:</strong>
                    </Col>
                    <Col md={8}>{data.user.name}</Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <strong>User Address:</strong>
                    </Col>
                    <Col md={8}>
                      {data.user.address ? data.user.address : 'NA'}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <strong>User Contact:</strong>
                    </Col>
                    <Col md={8}>{data.user.mobile}</Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <strong>User Id:</strong>
                    </Col>
                    <Col md={8}>{data.userId ? data.userId : 'NA'}</Col>
                  </Row>
                </DrawerBox>
              </Col>
              <Col md={6}>
                <DrawerBox
                  overrides={{
                    Block: {
                      style: {
                        width: '100%',
                        height: 'auto',
                        padding: '30px',
                        borderRadius: '3px',
                        backgroundColor: '#ffffff',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    },
                  }}
                >
                  {' '}
                  <Row>
                    <Col md={5}>
                      <strong>Store Name:</strong>
                    </Col>
                    <Col md={7}>{data.store && data.store.name.en}</Col>
                  </Row>
                  <Row>
                    <Col md={5}>
                      <strong>Order Status:</strong>
                    </Col>
                    <Col md={7}>{statusLabels(data.status)}</Col>
                  </Row>
                  <Row>
                    <Col md={5}>
                      <strong>Order Type:</strong>
                    </Col>
                    <Col md={7}>{data.orderType}</Col>
                  </Row>
                  <Row>
                    <Col md={5}>
                      <strong>Amount:</strong>
                    </Col>
                    <Col md={7}>{data.orderCart.totalPrice.toFixed()}</Col>
                  </Row>
                  <Row>
                    <Col md={5}>
                      <strong>Created At:</strong>
                    </Col>
                    <Col md={7}>
                      {new Date(data.createdAt).toLocaleString()}
                    </Col>
                  </Row>
                  {/* <Uploader onChange={handleUploader} /> */}
                </DrawerBox>
              </Col>
            </Row>
          )}
        </Scrollbars>

        <ButtonGroup style={{ float: 'right' }}>
          <Button
            kind={KIND.minimal}
            onClick={closeDrawer}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  float: 'right',
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
        </ButtonGroup>
      </Box>
    </>
  );
};

export default OrderDetail;
