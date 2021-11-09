import React, { useContext, useState } from "react";
import Link from "next/link";
import { Input } from "components/forms/input";
import { Select } from "components/forms/select";
import {
  Button,
  IconWrapper,
  Wrapper,
  Container,
  LogoWrapper,
  Heading,
  SubHeading,
  HelperText,
  Offer,
  // Input,
  Divider,
  LinkButton,
} from "./authentication-form.style";
import { AuthContext } from "contexts/auth/auth.context";
import { FormattedMessage, useIntl } from "react-intl";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SEND_OTP } from "graphql/query/sendotp.query";
import { M_USER_SIGNUP } from "graphql/mutation/signup.mutation";

const countryCodes = [
  { name: "+91", value: "IND" },
  { name: "+965", value: "KWT" },
  { name: "+966", value: "KSA" },
  { name: "+968", value: "OMN" },
  { name: "+971", value: "UAE" },
  { name: "+974", value: "QAT" },
];

//verify user by sending otp
function VerifyUser({ handleSentOtp }) {
  const [verifyState, setVerifyState] = useState({
    mobile: "",
    countryCode: "",
    sentOtp: false,
  });

  const [sendOtp] = useLazyQuery(SEND_OTP, {
    context: { linkName: "auth" },
    onCompleted: (data) => {
      if (data && data.sendOtp && data.sendOtp.success) {
        setVerifyState({ ...verifyState, sentOtp: true });
      }
    },
  });

  function handleSendOtp(e) {
    e.preventDefault();
    if (!verifyState.sentOtp) {
      sendOtp({
        variables: {
          sendOtpInputDto: {
            mobile: verifyState.mobile,
            countryCode: verifyState.countryCode,
          },
        },
      });
    } else {
      handleSentOtp();
    }
  }

  return (
    <Wrapper>
      <Container>
        <Heading>
          <FormattedMessage
            id="verifyUser"
            defaultMessage="Please Verify Yourself"
          />
        </Heading>
        <SubHeading>
          <FormattedMessage
            id="signUpTexts"
            defaultMessage="Every fill is required in sign up"
          />
        </SubHeading>
        <form onSubmit={handleSendOtp}>
          <Input
            type="text"
            placeholder="eg: 900900900900"
            height="48px"
            backgroundColor="#F7F7F7"
            mb="10px"
            onChange={(e) =>
              setVerifyState({ ...verifyState, mobile: e.target.value })
            }
          />
          <Select
            options={countryCodes}
            handleChange={(value) =>
              setVerifyState({ ...verifyState, countryCode: value })
            }
          />
          {verifyState.sentOtp ? (
            <FormattedMessage id="otpSent" defaultMessage="Otp Sent" />
          ) : null}
          {!verifyState.sentOtp ? (
            <Button
              variant="primary"
              size="big"
              width="100%"
              type="submit"
              style={{ margin: "20px 0" }}
            >
              <FormattedMessage id="sendOtp" defaultMessage="Continue" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="big"
              width="100%"
              type="submit"
              style={{ margin: "20px 0" }}
            >
              <FormattedMessage id="signUpAfterOtp" defaultMessage="Continue" />
            </Button>
          )}
        </form>
      </Container>
    </Wrapper>
  );
}

//signup user with sent otp
function SignUp() {
  const [signup, setSignup] = React.useState({
    email: "",
    mobile: "",
    countryCode: "",
    name: "",
    status: "ON",
    deviceType: "WEB",
    osVersion: "WEB",
    deviceModel: "WEB",
    versionCode: "WEB",
    otp: "",
  });
  const intl = useIntl();
  const { authDispatch } = useContext<any>(AuthContext);
  const toggleSignInForm = () => {
    authDispatch({
      type: "SIGNIN",
    });
  };

  const [mutateSignup] = useMutation(M_USER_SIGNUP, {
    context: { linkName: "auth" },
    onCompleted: (data) => {
      if (data && data.userSignup && data.userSignup.success) {
        authDispatch({
          type: "SIGNIN",
        });
      }
    },
  });

  function handleSignup(e) {
    e.preventDefault();
    mutateSignup({
      variables: {
        userSignupInputDto: {
          name: signup.name,
          countryCode: signup.countryCode,
          status: "ON",
          mobile: signup.mobile,
          email: signup.email,
          otp: signup.otp,
          deviceId: "WEB",
          deviceType: "WEB",
          osVersion: "WEB",
          deviceModel: "WEB",
          versionCode: "WEB",
        },
      },
    });
  }

  return (
    <Wrapper>
      <Container>
        <Heading>
          <FormattedMessage id="signUpBtnText" defaultMessage="Sign Up" />
        </Heading>
        <SubHeading>
          <FormattedMessage
            id="signUpText"
            defaultMessage="Every fill is required in sign up"
          />
        </SubHeading>
        <form onSubmit={handleSignup}>
          <Input
            type="text"
            placeholder={intl.formatMessage({
              id: "userSignupName",
              defaultMessage: "Enter your name",
            })}
            height="48px"
            backgroundColor="#F7F7F7"
            mb="10px"
            onChange={(e) => setSignup({ ...signup, name: e.target.value })}
          />
          <Input
            type="email"
            placeholder={intl.formatMessage({
              id: "emailAddressPlaceholder",
              defaultMessage: "eg: demo@demo.com",
            })}
            height="48px"
            backgroundColor="#F7F7F7"
            mb="10px"
            onChange={(e) => setSignup({ ...signup, email: e.target.value })}
          />
          <Input
            type="text"
            placeholder={intl.formatMessage({
              id: "userSignupMobile",
              defaultMessage: "eg: 9000900090",
            })}
            height="48px"
            backgroundColor="#F7F7F7"
            mb="10px"
            onChange={(e) => setSignup({ ...signup, mobile: e.target.value })}
          />
          <Select
            options={countryCodes}
            handleChange={(value) =>
              setSignup({ ...signup, countryCode: value })
            }
          />
          <Input
            type="text"
            placeholder={intl.formatMessage({
              id: "userSignupOtp",
              defaultMessage: "eg: 9000900090",
            })}
            height="48px"
            backgroundColor="#F7F7F7"
            mb="10px"
            onChange={(e) => setSignup({ ...signup, otp: e.target.value })}
          />
          <HelperText style={{ padding: "20px 0 30px" }}>
            <FormattedMessage
              id="signUpText"
              defaultMessage="By signing up, you agree to Orderznow's"
            />
            &nbsp;
            <Link href="/">
              <a>
                <FormattedMessage
                  id="termsConditionText"
                  defaultMessage="Terms &amp; Condition"
                />
              </a>
            </Link>
          </HelperText>
          <Button variant="primary" size="big" width="100%" type="submit">
            <FormattedMessage id="continueBtn" defaultMessage="Continue" />
          </Button>
        </form>
        <Offer style={{ padding: "20px 0" }}>
          <FormattedMessage
            id="alreadyHaveAccount"
            defaultMessage="Already have an account?"
          />{" "}
          <LinkButton onClick={toggleSignInForm}>
            <FormattedMessage id="loginBtnText" defaultMessage="Login" />
          </LinkButton>
        </Offer>
      </Container>
    </Wrapper>
  );
}

const forms = ["VERIFY_USER", "SIGNUP"];
export default function SignOutModal() {
  const [form, setForm] = React.useState(forms[0]);

  function toggleSignUpForm() {
    setForm(forms[1]);
  }

  return form === forms[0] ? (
    <VerifyUser handleSentOtp={toggleSignUpForm} />
  ) : (
    <SignUp />
  );
}
