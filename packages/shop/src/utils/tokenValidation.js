import { getToken } from './localStorage';

const isTokenValidOrUndefined = () => {
  const tokens = getToken();
  let { expiryDate = null, accessToken = null } = tokens
    ? JSON.parse(tokens)
    : {};
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
