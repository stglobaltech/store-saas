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

export const getLocalStateAccessToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (err) {
    return undefined;
  }
};

export const setLocalStateAccessToken = (token, userId, roles) => {
  try {
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("userId", userId);
    localStorage.setItem("roles", roles);
  } catch {
    // ignore write errors
  }
};

export const removeLocalStateAccessToken = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("userId");
  } catch {
    // ignore write errors
  }
};
