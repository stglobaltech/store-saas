import Button, { KIND, SIZE } from 'components/Button/Button';
import { FormFields, FormTitle, Error } from 'components/FormFields/FormFields';
import { Field, Formik, Form } from 'formik';
import React, { useState } from 'react';
import { FormWrapper, MobileCol, Wrapper } from './Signup.style';
import * as Yup from 'yup';
import Input from 'components/Input/Input';
import { M_REGISTER } from 'services/GQL';
import { useMutation } from '@apollo/client';
import { Select } from 'baseui/select';
import { Col, Row } from 'components/FlexBox/FlexBox';
import { Link, useHistory } from 'react-router-dom';
import { useNotifier } from 'react-headless-notifier';
import SuccessNotification from 'components/Notification/SuccessNotification';
import DangerNotification from 'components/Notification/DangerNotification';

export default function Register() {
  const [ccode, setCcode] = useState('');

  const initialValues = {
    username: '',
    restuarantName: '',
    countryCode: '+91',
    mobileNumber: '',
    email: '',
    password: '',
    repeatPassword: '',
  };

  const { notify } = useNotifier();
  const history = useHistory();

  const getLoginValidationSchema = () => {
    return Yup.object({
      username: Yup.string().required('Required!'),
      storeName: Yup.string().required('Required!'),
      email: Yup.string().email('Invalid format').required('Required!'),
      countryCode: Yup.string().required('Required!'),
      mobileNumber: Yup.string().required('Required!'),
      domain: Yup.string()
        .required('Required!')
        .matches(/^[a-z0-9]*$/, 'cannot have special characters'),
      password: Yup.string()
        .required('Required!')
        .matches(/^.{7,}$/, 'minimum 7 characters'),
      repeatPassword: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'Passwords doesnot match')
        .required('Required!'),
    });
  };

  const MyInput = ({ field, form, ...props }) => {
    return <Input size={SIZE.mini} {...field} {...props} />;
  };

  const [doRegister, { error, loading, data }] = useMutation(M_REGISTER, {
    context: { clientName: 'AUTH_SERVER' },
    onCompleted: (data) => {
      if (data.gateSignup.success) {
        notify(
          <SuccessNotification
            message={'Thank You! Your account has been created successfully'}
            dismiss
          />
        );
        history.push('/login');
      } else
        notify(
          <DangerNotification message={data.gateSignup.message.en} dismiss />
        );
    },
  });

  const handleRegister = (formValues, { resetForm }) => {
    const { repeatPassword, ...user } = formValues;
    user.restuarantName = { en: user.storeName, ar: '' };
    user.appType = 'GATE';
    user.deviceType = 'WEB';
    user.domain = `https://${user.domain}.orderznow.com`;
    Object.keys(countryCodes).forEach((key) => {
      if (countryCodes[key] === user.countryCode) {
        user.countryCode = key;
      }
    });
    delete user.storeName;

    doRegister({ variables: { gateSignUpDto: user } });

    data?.gateSignup?.success && resetForm();
  };

  const countryCodes = {
    IND: '+91',
    KWT: '+965',
    KSA: '+966',
    OMN: '+968',
    UAE: '+971',
    QAT: '+974',
  };
  return (
    <Wrapper>
      <FormWrapper>
        <Formik
          initialValues={initialValues}
          onSubmit={handleRegister}
          render={({ errors, status, touched }) => (
            <Form style={{ backgroundColor: '#ffffff', paddingBottom: '50px' }}>
              <FormFields>
                <FormTitle>
                  <strong>Sign Up</strong>
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
                    (data.gateSignup.success === 'error' ||
                      !data.gateSignup.success) &&
                    data.gateSignup.message.en !=
                      'Domain name already exists' && (
                      <>{data.gateSignup.message.en}</>
                    )
                  )}
                </div>
              </FormFields>
              <FormFields>
                <Field
                  type='text'
                  name='username'
                  component={MyInput}
                  placeholder='User Name'
                />
                {errors.username && touched.username && (
                  <Error>{errors.username}</Error>
                )}
              </FormFields>
              <FormFields>
                <Field
                  type='text'
                  name='storeName'
                  component={MyInput}
                  placeholder='Restaurant Name'
                />
                {errors.storeName && touched.storeName && (
                  <Error>{errors.storeName}</Error>
                )}
              </FormFields>
              <FormFields>
                <Field
                  type='email'
                  name='email'
                  component={MyInput}
                  placeholder='Email'
                />
                {errors.email && touched.email && <Error>{errors.email}</Error>}
              </FormFields>
              <Row style={{ marginBottom: '20px' }}>
                <Col md={4}>
                  <FormFields>
                    <Field
                      component={Select}
                      size={SIZE.compact}
                      name='countryCode'
                      options={[
                        { label: '+91', id: 'IND' },
                        { label: '+966', id: 'KSA' },
                        { label: '+965', id: 'KWT' },
                        { label: '+971', id: 'UAE' },
                        { label: '+974', id: 'QAT' },
                        { label: '+968', id: 'OMN' },
                      ]}
                      value={ccode}
                      onChange={(e) => setCcode(e.value)}
                      placeholder={'+91'}
                    />
                    {errors.countryCode && touched.countryCode && (
                      <Error>{errors.countryCode}</Error>
                    )}
                  </FormFields>
                </Col>
                <MobileCol md={8}>
                  <FormFields>
                    <Field
                      type='text'
                      name='mobileNumber'
                      component={MyInput}
                      placeholder='Mobile Number'
                    />
                    {errors.mobileNumber && touched.mobileNumber && (
                      <Error>{errors.mobileNumber}</Error>
                    )}
                  </FormFields>
                </MobileCol>
              </Row>
              <Row style={{ marginBottom: '-15px' }}>
                <Col xs={7} style={{ marginRight: '0px' }}>
                  <FormFields>
                    <Field
                      type='text'
                      name='domain'
                      component={MyInput}
                      placeholder='Domain Name'
                    />
                    {errors.domain && touched.domain && (
                      <Error>{errors.domain}</Error>
                    )}
                    {data?.gateSignup?.message?.en ===
                      'Domain name already exists' && (
                      <Error>{data.gateSignup.message.en}</Error>
                    )}
                  </FormFields>
                </Col>
                <Col xs={5} style={{ paddingLeft: '0px' }}>
                  <p>.orderznow.com</p>
                </Col>
              </Row>
              <FormFields>
                <Field
                  type='password'
                  name='password'
                  component={MyInput}
                  placeholder='Password'
                />
                {errors.password && touched.password && (
                  <Error>{errors.password}</Error>
                )}
              </FormFields>
              <FormFields>
                <Field
                  type='password'
                  name='repeatPassword'
                  component={MyInput}
                  placeholder='Repeat Password'
                />
                {errors.repeatPassword && touched.repeatPassword && (
                  <Error>{errors.repeatPassword}</Error>
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
                <Col>
                  <Link to='/login'>
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
                      Already having account? Sign In
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
