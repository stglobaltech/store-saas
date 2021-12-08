import React, { useCallback, useState } from 'react';
import { useDrawerDispatch, useDrawerState } from 'context/DrawerContext';
import { Scrollbars } from 'react-custom-scrollbars';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import {
  DrawerTitleWrapper,
  DrawerTitle,
  ButtonGroup,
  Form,
} from '../DrawerItems/DrawerItems.style';
import { Box } from 'components/Box/Box';
import {
  M_CANCEL_ORDER,
  M_FINISH_ORDER_WITHOUT_FLEET,
  M_FINISH_ORDER_WITH_FLEET,
  Q_GET_STORE_ID,
  Q_STORE_PLAN_FOR_USER_WEB_ADMIN,
} from 'services/GQL';
import { useMutation, useQuery } from '@apollo/client';
import SuccessNotification from 'components/Notification/SuccessNotification';
import DangerNotification from 'components/Notification/DangerNotification';
import { useNotifier } from 'react-headless-notifier';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';
import Input from 'components/Input/Input';
import { useForm } from 'react-hook-form';

type Props = any;

const OrderDetail: React.FC<Props> = (props) => {
  const [cancelReason, setCancelReason] = useState(false);

  const dispatch = useDrawerDispatch();

  const data = useDrawerState('data');

  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);

  const { register, handleSubmit } = useForm();

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

  const { notify } = useNotifier();

  const {
    data: { storeId },
  } = useQuery(Q_GET_STORE_ID);

  const { data: planData } = useQuery(Q_STORE_PLAN_FOR_USER_WEB_ADMIN, {
    variables: {
      storeId,
    },
  });

  const [cancelOrder] = useMutation(M_CANCEL_ORDER, {
    onCompleted: (data) => {
      closeDrawer();
      if (data.storeCancelOrder.success) {
        notify(
          <SuccessNotification
            message={data.storeCancelOrder.message.en}
            dismiss
          />
        );
      } else {
        notify(
          <DangerNotification
            message={data.storeCancelOrder.message.en}
            dismiss
          />
        );
      }
    },
  });

  const [finishOrderWithoutFleet] = useMutation(M_FINISH_ORDER_WITHOUT_FLEET, {
    onCompleted: (data) => {
      if (data.userRecievedOrder.success) {
        notify(
          <SuccessNotification
            message={data.userRecievedOrder.message.en}
            dismiss
          />
        );
      } else {
        notify(
          <DangerNotification
            message={data.userRecievedOrder.message.en}
            dismiss
          />
        );
      }
      closeDrawer();
    },
  });

  const [finishOrderWithFleet] = useMutation(M_FINISH_ORDER_WITH_FLEET, {
    onCompleted: (data) => {
      if (data.storeFinishOrder.success) {
        notify(
          <SuccessNotification
            message={data.storeFinishOrder.message.en}
            dismiss
          />
        );
      } else {
        notify(
          <DangerNotification
            message={data.storeFinishOrder.message.en}
            dismiss
          />
        );
      }
      closeDrawer();
    },
  });

  const onFinishOrderWithoutFleet = () => {
    finishOrderWithoutFleet({
      variables: {
        userReceivedOrder: { orderId: data._id },
      },
    });
  };

  const onFinishOrderWithFleet = () => {
    finishOrderWithFleet({
      variables: {
        finishOrder: {
          orderId: data._id,
        },
      },
    });
  };

  const onCancelOrderSubmit = (values) => {
    cancelOrder({
      variables: {
        chefInputDto: {
          orderId: data._id,
          cancelReason: { en: values.cancelReason, ar: values.cancelReason },
        },
      },
    });
  };

  const toggleCancelReason = () => {
    setCancelReason(!cancelReason);
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
                  <Row>
                    <Col md={5}>
                      <strong>Actions:</strong>
                    </Col>
                    <Col md={7}>
                      <Button
                        type='button'
                        onClick={
                          planData?.getParticularStorePlanForGate?.data?.plan[0]
                            .isFleetRequired
                            ? onFinishOrderWithFleet
                            : onFinishOrderWithoutFleet
                        }
                        disabled={data.status !== 'CONF'}
                        overrides={{
                          BaseButton: {
                            style: ({ $theme, $size, $shape }) => {
                              return {
                                borderTopLeftRadius: '3px',
                                borderTopRightRadius: '3px',
                                borderBottomLeftRadius: '3px',
                                borderBottomRightRadius: '3px',
                                paddingTop: '4px',
                                paddingBottom: '4px',
                              };
                            },
                          },
                        }}
                      >
                        Finish
                      </Button>
                      <Button
                        type='button'
                        kind={KIND.minimal}
                        onClick={toggleCancelReason}
                        disabled={
                          data.status === 'FIN' ||
                          data.status === 'CAN' ||
                          data.status === 'EXP'
                        }
                        overrides={{
                          BaseButton: {
                            style: ({ $theme, $size, $shape }) => {
                              return {
                                borderTopLeftRadius: '3px',
                                borderTopRightRadius: '3px',
                                borderBottomLeftRadius: '3px',
                                borderBottomRightRadius: '3px',
                                paddingTop: '4px',
                                paddingBottom: '4px',
                                color: $theme.colors.red400,
                              };
                            },
                          },
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                  {cancelReason && (
                    <Form onSubmit={handleSubmit(onCancelOrderSubmit)}>
                      <Row>
                        <Col>
                          <FormFields>
                            <FormLabel>Cancel Reason</FormLabel>
                            <Input
                              type='text-area'
                              name='cancelReason'
                              inputRef={register}
                            />
                          </FormFields>
                          <Button
                            type='submit'
                            overrides={{
                              BaseButton: {
                                style: ({ $theme, $size, $shape }) => {
                                  return {
                                    borderTopLeftRadius: '3px',
                                    borderTopRightRadius: '3px',
                                    borderBottomLeftRadius: '3px',
                                    borderBottomRightRadius: '3px',
                                    paddingTop: '4px',
                                    paddingBottom: '4px',
                                    float: 'right',
                                  };
                                },
                              },
                            }}
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
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
