// localStorage.js
export const getLocalState = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const setLocalState = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch {
    // ignore write errors
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (err) {
    return undefined;
  }
};

export const setToken = (token, userId, roles) => {
  try {
    //token:{accessToken,refreshToken,expiryDate}
    const newToken = localStorage.getItem("token") || {};
    Object.keys(token).map((tokenKey) => {
      newToken[tokenKey] = token[tokenKey];
    });
    localStorage.setItem("token", JSON.stringify(newToken));
    if (userId && roles) {
      localStorage.setItem("userId", userId);
      localStorage.setItem("roles", roles);
    }
  } catch {
    // ignore write errors
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("userId");
  } catch {
    // ignore write errors
  }
};

export const getUserId = () => {
  try {
    return localStorage.getItem("userId");
  } catch {}
};

export const getCartId = () => {
  try {
    return localStorage.getItem("cartId");
  } catch {}
};
