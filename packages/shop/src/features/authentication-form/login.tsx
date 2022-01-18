import React, { useContext } from "react";
import jwtDecode from "jwt-decode";
import { useNotifier } from "react-headless-notifier";
import {
  LinkButton,
  Button,
  IconWrapper,
  Wrapper,
  Container,
  LogoWrapper,
  Heading,
  SubHeading,
  OfferSection,
  Offer,
  // Input,
  Divider,
} from "./authentication-form.style";
import {  useLazyQuery, useMutation } from "@apollo/client";
import { AuthContext } from "contexts/auth/auth.context";
import { FormattedMessage, useIntl } from "react-intl";
import { closeModal } from "@redq/reuse-modal";
import { Input } from "components/forms/input";
import { SEND_OTP } from "graphql/query/sendotp.query";
import { Select } from "components/forms/select";
import { M_USER_LOGIN } from "graphql/mutation/me";
import { setToken } from "utils/localStorage";
import { initializeApollo } from "utils/apollo";
import { Q_GET_ROLES, Q_GET_USERID } from "graphql/query/loggedIn-queries.query";
import { useCart } from "contexts/cart/use-cart";
import SuccessNotification from "../../components/Notification/SuccessNotification";
import DangerNotification from "../../components/Notification/DangerNotification";

const countryCodes = [
  { name: "+91", value: "IND" },
  { name: "+965", value: "KWT" },
  { name: "+966", value: "KSA" },
  { name: "+968", value: "OMN" },
  { name: "+971", value: "UAE" },
  { name: "+974", value: "QAT" },
];

// form component to send otp to user as a stepper UI
function SendOtp({ handleVerifyOtp }) {
  const intl = useIntl();
  const { notify } = useNotifier();
  const [mobile, setMobile] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("");

  const [sendOtp] = useLazyQuery(SEND_OTP, {
    context: { linkName: "auth" },
    onCompleted: (data) => {
      if (data && data.sendOtp && data.sendOtp.success) {
        notify(
          <SuccessNotification
            message="Otp sent to your phone/email"
            dismiss
          />
        );
        handleVerifyOtp(mobile, countryCode);
      } else {
        notify(
          <DangerNotification
            message="Something went wrong! OTP could not be sent..."
            dismiss
          />
        );
      }
    },
  });

  function loginCallback(e) {
    e.preventDefault();
    sendOtp({
      variables: {
        sendOtpInputDto: {
          mobile: mobile,
          countryCode: countryCode,
          appType:"USER"
        },
      },
    });
  }
  return (
    <Wrapper>
      <Container>
        <Heading>
          <FormattedMessage id="welcomeBack" defaultMessage="Welcome Back" />
        </Heading>

        <SubHeading>
          <FormattedMessage
            id="loginText"
            defaultMessage="Login with your registered mobile number"
          />
        </SubHeading>
        <form onSubmit={loginCallback}>
          <Select
            options={countryCodes}
            handleChange={(value) => setCountryCode(value)}
          />
          <Input
            type="text"
            placeholder={intl.formatMessage({
              id: "userSignupMobile",
              defaultMessage: "Mobile",
            })}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            height="48px"
            backgroundColor="#F7F7F7"
            mt="10px"
          />
          <Button
            variant="primary"
            size="big"
            style={{ width: "100%", marginTop: "20px" }}
            type="submit"
          >
            <FormattedMessage id="sendOtp" defaultMessage="Send Otp" />
          </Button>
        </form>
      </Container>
    </Wrapper>
  );
}

// form component to verify otp as a stepperUI
function VerifyOtp({ mobile, countryCode, handleLoginSuccess }) {
  const client = initializeApollo();
  const intl = useIntl();
  const { notify } = useNotifier();
  const [otp, setOtp] = React.useState("");

  const [verifyOtpAndLogin] = useMutation(M_USER_LOGIN, {
    context: { linkName: "auth" },
    onCompleted: (data) => {
      if (data && data.userLogin && data.userLogin.success) {
        notify(
          <SuccessNotification
            message="Login successful! Shop now..."
            dismiss
          />
        );
        const { accessToken, userId, refreshToken } = data.userLogin;
        const { roles, exp } = jwtDecode(accessToken) as any;
        const token = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          expiryDate: new Date(exp * 1000),
        };
        handleLoginSuccess(token, userId, roles);
        client.writeQuery({
          query: Q_GET_USERID,
          data: { userId },
        });
        client.writeQuery({
          query:Q_GET_ROLES,
          data:{roles}
        })
      } else if(data && data.userLogin && data.userLogin.accessToken===null && data.userLogin.refreshToken===null) {
        notify(
          <DangerNotification
            message={`${mobile} is not registered with us! Please signup and continue!!`}
            dismiss
          />
        );
      }
    },
  });

  function verifyOtpCallback(e) {
    e.preventDefault();
    verifyOtpAndLogin({
      variables: {
        userLoginInputDto: {
          otp: otp,
          mobile: mobile,
          countryCode: countryCode,
          deviceType: "WEB",
        },
      },
    });
  }
  return (
    <Wrapper>
      <Heading>
        <FormattedMessage id="welcomeBack" defaultMessage="Welcome Back" />
      </Heading>

      <SubHeading>
        <FormattedMessage
          id="userLoginPageModalTextForVerifyOTP"
          defaultMessage="Enter your one time password"
        />
      </SubHeading>

      <Container>
        <form onSubmit={verifyOtpCallback}>
          <Input
            type="text"
            placeholder={intl.formatMessage({
              id: "userLoginOtpPlaceholder",
              defaultMessage: "otp...",
            })}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            height="48px"
            backgroundColor="#F7F7F7"
            mb="10px"
          />
          <Button
            variant="primary"
            size="big"
            style={{ width: "100%" }}
            type="submit"
          >
            <FormattedMessage id="loginBtnText" defaultMessage="Login" />
          </Button>
        </form>
      </Container>
    </Wrapper>
  );
}

const forms = ["SEND_OTP", "VERIFY_OTP"];
export default function SignInModal() {
  const intl = useIntl();
  const { authDispatch } = useContext<any>(AuthContext);
  const { isOpen, toggleCart } = useCart();
  const [form, setForm] = React.useState({
    form: forms[0],
    mobile: "",
    countryCode: "",
  });

  const toggleSignUpForm = () => {
    authDispatch({
      type: "SIGNUP",
    });
  };

  const toggleForgotPassForm = () => {
    authDispatch({
      type: "FORGOTPASS",
    });
  };

  function handleVerifyOtp(mobile, countryCode) {
    setForm({ form: forms[1], mobile, countryCode });
  }

  function handleLoginSuccess(token, userId, roles) {
    setToken(token, userId, roles);
    authDispatch({ type: "SIGNIN_SUCCESS" });
    closeModal();
    if (isOpen) toggleCart();
  }

  return (
    <Wrapper>
      <Container>
        {form.form === forms[0] ? (
          <SendOtp handleVerifyOtp={handleVerifyOtp} />
        ) : (
          <VerifyOtp
            mobile={form.mobile}
            countryCode={form.countryCode}
            handleLoginSuccess={handleLoginSuccess}
          />
        )}

        <Offer style={{ padding: "20px 0" }}>
          <FormattedMessage
            id="dontHaveAccount"
            defaultMessage="Don't have any account?"
          />{" "}
          <LinkButton onClick={toggleSignUpForm}>
            <FormattedMessage id="signUpBtnText" defaultMessage="Sign Up" />
          </LinkButton>
        </Offer>
      </Container>

      {/* <OfferSection>
        <Offer>
          <FormattedMessage
            id="forgotPasswordText"
            defaultMessage="Forgot your password?"
          />{" "}
          <LinkButton onClick={toggleForgotPassForm}>
            <FormattedMessage id="resetText" defaultMessage="Reset It" />
          </LinkButton>
        </Offer>
      </OfferSection> */}
    </Wrapper>
  );
}
