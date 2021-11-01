import { useMemo } from "react";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";

import { getToken } from "./localStorage";
import customFetch from "./customFetch";

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const apiLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT,
  credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
  fetch: customFetch,
});

const authLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_AUTH_API_ENDPOINT,
  fetch: customFetch,
});

const link = ApolloLink.split(
  (operation) => {
    return operation.getContext().linkName === "auth";
  },
  authLink,
  apiLink
);

const authMiddleware = new ApolloLink((operation, forward) => {
  let token;

  // get the authentication token from local storage if it exists
  if (typeof window !== "undefined") {
    token = getToken();
    token = JSON.parse(token);
  }

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token.accessToken}` : "",
    },
  }));

  return forward(operation);
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: concat(authMiddleware, link),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // Reusable helper function to generate a field
            // policy for the Query.products field.
            products: {
              keyArgs: ["type", "category", "text"],
              merge(existing, incoming) {
                const { items: newItems } = incoming;
                return existing
                  ? {
                      ...incoming,
                      items: [...existing.items, ...newItems],
                    }
                  : incoming;
              },
            },
          },
        },
      },
    }),
  });
}

export function initializeApollo(initialState: any = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
