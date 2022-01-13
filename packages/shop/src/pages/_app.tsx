import React from "react";
import { NotifierContextProvider } from "react-headless-notifier";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "site-settings/site-theme/default";
import { AppProvider } from "contexts/app/app.provider";
import { AuthProvider } from "contexts/auth/auth.provider";
import { LanguageProvider } from "contexts/language/language.provider";
import { CartProvider } from "contexts/cart/use-cart";
import { useApollo } from "utils/apollo";
import { useMedia } from "utils/use-media";
import { useCart } from "contexts/cart/use-cart";
import { isTokenValidOrUndefined } from "utils/tokenValidation";

// External CSS import here
import "rc-drawer/assets/index.css";
import "rc-table/assets/index.css";
import "rc-collapse/assets/index.css";
import "react-multi-carousel/lib/styles.css";
import "components/multi-carousel/multi-carousel.style.css";
import "react-spring-modal/dist/index.css";
import "overlayscrollbars/css/OverlayScrollbars.css";
import "components/scrollbar/scrollbar.css";
import "@redq/reuse-modal/lib/index.css";
import "swiper/swiper-bundle.min.css";
import { GlobalStyle } from "assets/styles/global.style";

// Language translation messages
import { messages } from "site-settings/site-translation/messages";
import "typeface-lato";
import "typeface-poppins";
import { useEffect } from "react";
// need to provide types
const DemoSwitcher = dynamic(
  () => import("components/demo-switcher/switcher-btn")
);
const AppLayout = dynamic(() => import("layouts/app-layout"));

const RouteGuard = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    isAuthenticated(router.asPath);
    router.replace("/");
  }, []);

  const { cartItemsCount } = useCart();
  function isAuthenticated(url) {
    const privatePaths = [
      "/checkout",
      "/transactions",
      "/order-history",
      "/order-received",
      "/order",
    ];
    const path = url.split("?")[0];
    if (
      (!isTokenValidOrUndefined() || !cartItemsCount) &&
      privatePaths.includes(path)
    ) {
      router.push("/");
    }
  }
  return children;
};

export default function ExtendedApp({ Component, pageProps }) {
  const mobile = useMedia("(max-width: 580px)");
  const tablet = useMedia("(max-width: 991px)");
  const desktop = useMedia("(min-width: 992px)");
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyle />
        <LanguageProvider messages={messages}>
          <RouteGuard>
            <CartProvider>
              <AppProvider>
                <AuthProvider>
                  <AppLayout>
                    <NotifierContextProvider>
                      <Component
                        {...pageProps}
                        deviceType={{ mobile, tablet, desktop }}
                      />
                    </NotifierContextProvider>
                  </AppLayout>
                </AuthProvider>
              </AppProvider>
            </CartProvider>
          </RouteGuard>
        </LanguageProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
