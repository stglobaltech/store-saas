import axios from 'axios';
import jwtDecode from 'jwt-decode';

import {
  getLocalStateAccessToken,
  setLocalStateAccessToken,
  removeLocalStateAccessToken,
} from './localStorage';
import { isTokenValidOrUndefined } from './tokenValidation';

export default async function customFetch(uri, options) {
  const tokens = getLocalStateAccessToken();
  if (!isTokenValidOrUndefined()) {
    let { accessToken = null, refreshToken } = JSON.parse(tokens);
    let accessTokenInputDto = { accessToken: accessToken };
    let body = {
      query: `
    mutation($accessTokenInputDto: BuildAccessTokenInputDto!) {
      refreshToken(accessTokenInputDto: $accessTokenInputDto) {
        success
        message{
          en
          ar
        }
        accessToken
      }
    }
      `,
      variables: {
        accessTokenInputDto,
      },
    };
    let axiosoptions = {
      headers: {
        'Content-Type': 'application/json',
        authorization: refreshToken ? `Bearer ${refreshToken}` : '',
      },
    };

    const res = await axios.post(
      process.env.REACT_APP_GQL_AUTH_SERVER_URI,
      body,
      axiosoptions
    );
    if (
      res &&
      res.data &&
      res.data.data &&
      res.data.data.refreshToken &&
      res.data.data.refreshToken.accessToken
    ) {
      const newAccessToken = res.data.data.refreshToken.accessToken;

      const { exp } = jwtDecode(newAccessToken);

      let expiryDate = new Date(exp * 1000);

      setToken({ accessToken: newAccessToken, expiryDate });
    } else if (res && res.data && res.data.errors && res.data.errors.length) {
      removeTokens();
      window.location.replace('/');
    }
  }

  let { accessToken = null } = tokens ? JSON.parse(tokens) : {};
  options.headers.authorization = `Bearer ${accessToken}`;

  const initialRequest = await fetch(uri, options);
  return initialRequest;
}
