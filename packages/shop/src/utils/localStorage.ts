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
    const serializedState = localStorage.getItem('access_token');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const setLocalStateAccessToken = (value) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem('access_token', serializedState);
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
