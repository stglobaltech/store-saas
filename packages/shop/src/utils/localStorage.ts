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
    return localStorage.getItem('access_token');
  } catch (err) {
    return undefined;
  }
};

export const setLocalStateAccessToken = (value) => {
  try {
    localStorage.setItem('access_token', value);
  } catch {
    // ignore write errors
  }
};

export const removeLocalStateAccessToken = () => {
  try {
    localStorage.removeItem('access_token');
  } catch {
    // ignore write errors
  }
};
