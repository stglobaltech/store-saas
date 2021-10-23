import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { getToken } from "../Storage";
import {
  Q_IS_LOGGED_IN,
  Q_GET_USER_ID,
  Q_GET_STORE_ID,
  Q_GET_PARENTRESTAURANTID,
  Q_GET_ROLES,
  Q_GET_STORENAMEEN
} from "./query";
import customFetch from "./custom-fetch";

const cache = new InMemoryCache();

const getAccessToken = () => {
    let { accessToken = null } = getToken();
    return { authorization: accessToken ? `Bearer ${accessToken}` : '' };
  };

const auth_server_uri = new HttpLink({
    uri: process.env.REACT_APP_GQL_AUTH_SERVER_URI,
    headers: getAccessToken(),
    fetch: customFetch,
  });
  
  const content_server_uri = new HttpLink({
    uri: process.env.REACT_APP_GQL_CONTENT_SERVER_URI,
    headers: getAccessToken(),
    fetch: customFetch,
  });

export const client = new ApolloClient({
  connectToDevTools: process.browser,
  ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === 'AUTH_SERVER', // Routes the query to the proper client
    auth_server_uri,
    content_server_uri
  ),
  cache
});

cache.writeQuery({
  query: Q_IS_LOGGED_IN,
  data: { isLoggedIn: !!localStorage.getItem("token") },
});

cache.writeQuery({
  query: Q_GET_USER_ID,
  data: { userId: localStorage.getItem("userId") },
});

cache.writeQuery({
  query: Q_GET_STORE_ID,
  data: { storeId: localStorage.getItem("storeId") },
});

cache.writeQuery({
  query: Q_GET_PARENTRESTAURANTID,
  data: { parentRestaurantId: localStorage.getItem("parentRestaurantId") },
});

cache.writeQuery({
  query: Q_GET_STORENAMEEN,
  data: { storeNameEn: localStorage.getItem("storeName") },
});

cache.writeQuery({
  query: Q_GET_ROLES,
  data: {
    roles:
      localStorage.getItem("roles") && JSON.parse(localStorage.getItem("roles")),
  },
});