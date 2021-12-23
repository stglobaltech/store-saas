import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button, { KIND } from 'components/Button/Button';
import Popover, { PLACEMENT } from 'components/Popover/Popover';
import Notification from 'components/Notification/Notification';
import { STAFF_MEMBERS, SETTINGS } from 'settings/constants';
import { NotificationIcon } from 'assets/icons/NotificationIcon';
import { AlertDotIcon } from 'assets/icons/AlertDotIcon';
import { ArrowLeftRound } from 'assets/icons/ArrowLeftRound';
import { MenuIcon } from 'assets/icons/MenuIcon';
import {
  TopbarWrapper,
  Logo,
  TopbarRightSide,
  ProfileImg,
  Image,
  AlertDot,
  NotificationIconWrapper,
  UserDropdowItem,
  NavLink,
  LogoutBtn,
  DrawerIcon,
  CloseButton,
  DrawerWrapper,
  BrandName,
} from './Topbar.style';
import UserImage from 'assets/image/user.png';
import Drawer, { ANCHOR } from 'components/Drawer/Drawer';
import Sidebar from '../Sidebar/Sidebar';
import { useQuery } from '@apollo/client';
import { Q_GET_USER_ID, Q_GET_RESTAURANT } from 'services/GQL';

const data = [
  {
    title: 'Delivery Successful',
    time: '5m',
    message: 'Order #34567 had been placed',
  },
];
const Topbar = ({ refs, onLogout }: any) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [storeUrl, setStoreUrl] = useState('');
  const {
    data: { userId },
  } = useQuery(Q_GET_USER_ID);

  const { data: restaurantData, error } = useQuery(Q_GET_RESTAURANT, {
    context: { clientName: 'CONTENT_SERVER' },
    variables: { ownerId: userId },
    onCompleted: ({ getStore }) => {
      setStoreUrl(getStore.domain);
    },
  });

  if (error) return <div>Error! {error.message}</div>;

  return (
    <TopbarWrapper ref={refs}>
      <Logo>
        <NavLink to='/'>
          <BrandName>{restaurantData?.getStore?.name?.en}</BrandName>
        </NavLink>
      </Logo>

      <DrawerWrapper>
        <DrawerIcon onClick={() => setIsDrawerOpen(true)}>
          <MenuIcon />
        </DrawerIcon>
        <Drawer
          isOpen={isDrawerOpen}
          anchor={ANCHOR.left}
          onClose={() => setIsDrawerOpen(false)}
          overrides={{
            Root: {
              style: {
                zIndex: '1',
              },
            },
            DrawerBody: {
              style: {
                marginRight: '0',
                marginLeft: '0',
                '@media only screen and (max-width: 767px)': {
                  marginLeft: '30px',
                },
              },
            },
            DrawerContainer: {
              style: {
                width: '270px',
                '@media only screen and (max-width: 767px)': {
                  width: '80%',
                },
              },
            },
            Close: {
              component: () => (
                <CloseButton onClick={() => setIsDrawerOpen(false)}>
                  <ArrowLeftRound />
                </CloseButton>
              ),
            },
          }}
        >
          <Sidebar onMenuItemClick={() => setIsDrawerOpen(false)} />
        </Drawer>
      </DrawerWrapper>

      <TopbarRightSide>
        {storeUrl && (
          <Link
            to={{ pathname: storeUrl }}
            target='_blank'
            style={{ textDecoration: 'none' }}
          >
            <Button
              type='button'
              kind={KIND.minimal}
              overrides={{
                BaseButton: {
                  style: ({ $theme }) => ({
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    borderBottomRightRadius: '3px',
                    borderBottomLeftRadius: '3px',
                    paddingTop: '8px',
                    paddingRight: '12px',
                    paddingBottom: '8px',
                    paddingLeft: '12px',
                    outline: '1px solid',
                  }),
                },
              }}
            >
              Visit Store
            </Button>
          </Link>
        )}

        <Popover
          content={({ close }) => <Notification data={data} onClear={close} />}
          accessibilityType={'tooltip'}
          placement={PLACEMENT.bottomRight}
          overrides={{
            Body: {
              style: {
                width: '330px',
                zIndex: 2,
              },
            },
            Inner: {
              style: {
                backgroundColor: '#ffffff',
              },
            },
          }}
        >
          <NotificationIconWrapper>
            <NotificationIcon />
            <AlertDot>
              <AlertDotIcon />
            </AlertDot>
          </NotificationIconWrapper>
        </Popover>

        <Popover
          content={({ close }) => (
            <UserDropdowItem>
              <NavLink to={STAFF_MEMBERS} exact={false} onClick={close}>
                Staff
              </NavLink>
              <NavLink to={SETTINGS} exact={false} onClick={close}>
                Settings
              </NavLink>
              <LogoutBtn
                onClick={() => {
                  onLogout();
                  close();
                }}
              >
                Logout
              </LogoutBtn>
            </UserDropdowItem>
          )}
          accessibilityType={'tooltip'}
          placement={PLACEMENT.bottomRight}
          overrides={{
            Body: {
              style: () => ({
                width: '220px',
                zIndex: 2,
              }),
            },
            Inner: {
              style: {
                backgroundColor: '#ffffff',
              },
            },
          }}
        >
          <ProfileImg>
            <Image src={UserImage} alt='user' />
          </ProfileImg>
        </Popover>
      </TopbarRightSide>
    </TopbarWrapper>
  );
};

export default Topbar;
