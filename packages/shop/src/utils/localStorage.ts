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
    return (
      localStorage.getItem("accessToken")
    );
  } catch (err) {
    return undefined;
  }
};

export const setLocalStateAccessToken = (accessToken, refreshToken, userId) => {
  try {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userId", userId);
  } catch {
    // ignore write errors
  }
};

export const removeLocalStateAccessToken = () => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  } catch {
    // ignore write errors
  }
};
