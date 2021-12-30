import React from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  FormFields,
  FormLabel,
  FormTitle,
  Error,
} from 'components/FormFields/FormFields';
import { Wrapper, FormWrapper } from './Login.style';
import Input from 'components/Input/Input';
import Button, { KIND } from 'components/Button/Button';
import {
  useQuery,
  useMutation,
  useApolloClient,
  useLazyQuery,
} from '@apollo/client';
import {
  M_LOGIN,
  Q_GET_RESTAURANT_ID,
  Q_IS_LOGGED_IN,
  Q_GET_USER_ID,
  Q_GET_STORE_ID,
  Q_GET_PARENTRESTAURANTID,
  Q_GET_ROLES,
  Q_GET_STORENAMEEN,
} from '../../services/GQL';
import jwtDecode from 'jwt-decode';
import { Col, Row } from 'components/FlexBox/FlexBox';

interface DecodedToken {
  roles: string[];
  exp: number;
}

export default function Login() {
  const location = useLocation();
  const cache = useApolloClient();
  const {
    data: { isLoggedIn = false },
  } = useQuery(Q_IS_LOGGED_IN);
  const [getRestaurantId, getRestaurantData] = useLazyQuery(
    Q_GET_RESTAURANT_ID
  );

  const { from } = (location.state as any) || { from: { pathname: '/' } };

  const initialValues = {
    email: '',
    password: '',
  };

  const getLoginValidationSchema = () => {
    return Yup.object().shape({
      email: Yup.string().required('Email is Required!'),
      password: Yup.string().required('Password is Required!'),
    });
  };

  const MyInput = ({ field, form, ...props }) => {
    return <Input {...field} {...props} />;
  };

  if (
    getRestaurantData &&
    getRestaurantData.data &&
    getRestaurantData.data.getStore
  ) {
    let userId = getRestaurantData.data.getStore.ownerId;
    let storeId = getRestaurantData.data.getStore._id;
    let parentId = getRestaurantData.data.getStore.parentId;
    let storeName = getRestaurantData.data.getStore.name.en;
    localStorage.setItem('storeId', storeId);
    localStorage.setItem('parentRestaurantId', parentId);
    localStorage.setItem('storeName', storeName);

    cache.writeQuery({
      query: Q_IS_LOGGED_IN,
      data: { isLoggedIn: !!localStorage.getItem('token') },
    });

    cache.writeQuery({
      query: Q_GET_USER_ID,
      data: { userId },
    });

    cache.writeQuery({
      query: Q_GET_STORE_ID,
      data: { storeId },
    });

    cache.writeQuery({
      query: Q_GET_PARENTRESTAURANTID,
      data: { parentRestaurantId: parentId },
    });

    cache.writeQuery({
      query: Q_GET_STORENAMEEN,
      data: { storeNameEn: storeName },
    });
  }

  const [doLogin, { loading, error, data }] = useMutation(M_LOGIN, {
    context: { clientName: 'AUTH_SERVER' },
    onCompleted({ gateLogin }) {
      const { success, accessToken, userId, refreshToken } = gateLogin;
      if (success && accessToken) {
        const { exp, roles } = jwtDecode<DecodedToken>(accessToken);

        const token = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          expiryDate: new Date(exp * 1000),
        };
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('userId', userId);
        localStorage.setItem('roles', JSON.stringify(roles));

        cache.writeQuery({
          query: Q_GET_ROLES,
          data: {
            roles,
          },
        });

        getRestaurantId({
          context: { clientName: 'CONTENT_SERVER' },
          variables: { ownerId: userId },
        });

        return <Redirect to={from} />;
      }
    },
  });

  const login = (formValues) => {
    doLogin({
      variables: { gateLoginDto: { ...formValues, deviceType: 'WEB',appType:"STORE" } },
    });
  };

  if (isLoggedIn) {
    return <Redirect to={{ pathname: '/' }} />;
  }

  return (
    <Wrapper>
      <FormWrapper>
        <Formik
          initialValues={initialValues}
          onSubmit={login}
          render={({ errors, status, touched }) => (
            <Form>
              <FormFields>
                <FormTitle>
                  <strong>Login to admin</strong>
                </FormTitle>
              </FormFields>

              <FormFields>
                <div
                  style={{
                    fontFamily: 'Lato, sans-serif',
                    fontWeight: 'bold',
                    color: 'rgb(252, 92, 99)',
                  }}
                >
                  {error ? (
                    <>{error.message}</>
                  ) : (
                    data &&
                    (data.gateLogin.success === 'error' ||
                      !data.gateLogin.success) && (
                      <>
                        {data.gateLogin.message.en ||
                          'Error!!..Something went wrong.'}
                      </>
                    )
                  )}
                </div>
              </FormFields>

              <FormFields>
                <FormLabel>Email</FormLabel>
                <Field
                  type='email'
                  name='email'
                  component={MyInput}
                  placeholder='Ex: demo@demo.com'
                />
                {errors.email && touched.email && <Error>{errors.email}</Error>}
              </FormFields>
              <FormFields>
                <FormLabel>Password</FormLabel>
                <Field
                  type='password'
                  name='password'
                  component={MyInput}
                  placeholder='Ex: demo'
                />
                {errors.password && touched.password && (
                  <Error>{errors.password}</Error>
                )}
              </FormFields>
              <Button
                type='submit'
                disabled={loading}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      width: '100%',
                      marginLeft: 'auto',
                      borderTopLeftRadius: '3px',
                      borderTopRightRadius: '3px',
                      borderBottomLeftRadius: '3px',
                      borderBottomRightRadius: '3px',
                      marginBottom: '10px',
                    }),
                  },
                }}
              >
                Submit
              </Button>
              <Row>
                <Col xs={6}>
                  {/* <Link to='/forgotpassword'>
                    <Button
                      overrides={{
                        BaseButton: {
                          style: ({ $theme }) => ({
                            padding: '0px',
                            backgroundColor: 'white',
                            fontWeight: 'normal',
                          }),
                        },
                      }}
                      kind={KIND.minimal}
                    >
                      Forgot password
                    </Button>
                  </Link> */}
                </Col>
                <Col xs={6}>
                  <Link to='/register'>
                    <Button
                      overrides={{
                        BaseButton: {
                          style: ({ $theme }) => ({
                            padding: '0px',
                            float: 'right',
                            fontWeight: 'normal',
                          }),
                        },
                      }}
                      kind={KIND.minimal}
                    >
                      New user? Sign up
                    </Button>
                  </Link>{' '}
                </Col>
              </Row>
            </Form>
          )}
          validationSchema={getLoginValidationSchema}
        />
      </FormWrapper>
    </Wrapper>
  );
}
