import React from 'react';
import useComponentSize from 'settings/useComponentSize';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import DrawerItems from '../DrawerItems/DrawerItems';
import { DrawerProvider } from 'context/DrawerContext';
import {
  LayoutWrapper,
  ContentWrapper,
  ContentInnerWrapper,
} from './Layout.style';
import { styled } from 'baseui';
import { useMedia } from 'settings/use-media';
import { useApolloClient } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import {
  Q_IS_LOGGED_IN,
  Q_GET_USER_ID,
  Q_GET_STORE_ID,
  Q_GET_PARENTRESTAURANTID,
  Q_GET_ROLES,
  Q_GET_STORENAMEEN } from "../../services/GQL";

const SidedbarDesktop = styled('div', () => ({
  '@media only screen and (max-width: 1199px)': {
    display: 'none',
  },
}));

const AdminLayout = ({ children }: any) => {
  let [topbarRef, { height }] = useComponentSize();
  let [sidebarRef, { width }] = useComponentSize();
  const desktop = useMedia('(min-width: 992px)');

  const client = useApolloClient();
  const history = useHistory();

  const signOut = () => {
    client.writeQuery({
      query: Q_IS_LOGGED_IN,
      data: { isLoggedIn: false },
    });

    client.writeQuery({
      query: Q_GET_USER_ID,
      data: { userId: null },
    });

    client.writeQuery({
      query: Q_GET_STORE_ID,
      data: { storeId: null },
    });

    client.writeQuery({
      query: Q_GET_PARENTRESTAURANTID,
      data: { parentRestaurantId: null },
    });

    client.writeQuery({
      query: Q_GET_ROLES,
      data: {
        roles: null,
      },
    });
    
    client.writeQuery({
      query: Q_GET_STORENAMEEN,
      data: {
        storeNameEn: null,
      },
    });

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("storeId");
    localStorage.removeItem("parentRestaurantId");
    localStorage.removeItem("storeName");
    localStorage.removeItem("roles");
    history.push("/login");
  };

  return (
    <DrawerProvider>
      <Topbar refs={topbarRef} onLogout={signOut} />
      <LayoutWrapper
        style={{
          height: `calc(100vh - ${height}px)`,
        }}
      >
        {desktop ? (
          <>
            <SidedbarDesktop>
              <Sidebar
                refs={sidebarRef}
                style={{
                  height: `calc(100vh - ${height}px)`,
                }}
                onLogout={signOut}
              />
            </SidedbarDesktop>
            <ContentWrapper
              style={{
                width: `calc(100% - ${width}px)`,
              }}
            >
              <ContentInnerWrapper>{children}</ContentInnerWrapper>
            </ContentWrapper>
          </>
        ) : (
          <ContentWrapper
            style={{
              width: '100%',
            }}
          >
            <ContentInnerWrapper>{children}</ContentInnerWrapper>
          </ContentWrapper>
        )}
      </LayoutWrapper>
      <DrawerItems />
    </DrawerProvider>
  );
};

export default AdminLayout;
