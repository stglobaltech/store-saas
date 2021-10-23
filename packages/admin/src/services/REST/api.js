import axios from 'axios';
import { getToken, setToken } from '../Storage';
import jwtDecode from 'jwt-decode';
import { isTokenValidOrUndefined } from '../utils';

const getAccessToken = async () => {
  if (!isTokenValidOrUndefined()) {
    let { accessToken = null, refreshToken } = getToken();
    let axiosoptions = {
      headers: {
        'Content-Type': 'application/json',
        authorization: refreshToken ? `Bearer ${refreshToken}` : '',
      },
    };

    let body = {
      accessToken: accessToken,
    };

    await axios
      .post(`${process.env.REACT_APP_BASE_URI_AUTH_SERVER}/tokens/refresh`, body, axiosoptions)
      .then((res) => {
        if (res && res.data && res.data && res.data.accessToken) {
          const newAccessToken = res.data.accessToken;
          const { exp } = jwtDecode(newAccessToken);
          let expiryDate = new Date(exp * 1000);

          setToken({ accessToken: newAccessToken, expiryDate });
        }
      });
  }
  let { accessToken = null } = getToken();
  return { accessToken };
};

let Api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URI,
});

Api.interceptors.request.use(async (config) => {
  await getAccessToken().then((res) => {
    config.headers['authorization'] = res.accessToken ? `Bearer ${res.accessToken}` : '';
  });
  return config;
});

export default Api;
