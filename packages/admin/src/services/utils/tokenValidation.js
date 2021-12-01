import { getToken } from '../Storage';

const isTokenValidOrUndefined = () => {
  let { expiryDate = null, accessToken = null } = getToken();

  if (!accessToken) return true;
  try {
    const now = new Date();

    if (now >= new Date(expiryDate)) {
      return false;
    } else {
      return true;
    }
  } catch {
    return false; //token is invalid
  }
};

export { isTokenValidOrUndefined };
