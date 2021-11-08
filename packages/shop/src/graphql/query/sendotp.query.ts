import { gql } from "@apollo/client";

export const SEND_OTP = gql`
  query sendOtp($sendOtpInputDto: SendOtpInputDto!) {
    sendOtp(sendOtpInputDto: $sendOtpInputDto) {
      success
      message {
        en
        ar
      }
      otp
    }
  }
`;
