export const getToken = () => {
  let token = localStorage.getItem("token");
  token = token ? JSON.parse(token) : {};
  return token || {};
};

export const setToken = (obj) => {
  const token = JSON.parse(localStorage.getItem("token"));
  Object.keys(obj).forEach((key) => {
    token[key] = obj[key];
  });
  localStorage.setItem("token", JSON.stringify(token));
  return getToken();
};

export const removeTokens = () => {
  localStorage.clear();
};
