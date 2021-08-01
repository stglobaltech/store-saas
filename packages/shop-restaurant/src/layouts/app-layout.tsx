import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Sticky from 'react-stickynode';
import { useAppState } from 'contexts/app/app.provider';
import Header from './header/header';
import { Box } from 'components/box';

const MobileHeader = dynamic(() => import('./header/mobile-header'), {
  ssr: false,
});

type LayoutProps = {
  className?: string;
  token?: string;
};

const Layout: React.FunctionComponent<LayoutProps> = ({
  className,
  children,
  token,
}) => {
  const isSticky = useAppState('isSticky');
  const { pathname } = useRouter();
  const isHomePage = pathname === '/';

  return (
    <Box
      className={`layoutWrapper ${className}`}
      bg={['white', 'white', 'gray.200']}
    >
      <Sticky enabled={isSticky} innerZ={1001}>
        <MobileHeader
          className={`${isSticky ? 'sticky' : 'unSticky'} ${
            isHomePage ? 'home' : ''
          } desktop`.trim()}
        />

        <Header
          className={`${isSticky && isHomePage ? 'sticky' : 'unSticky'} ${
            isHomePage ? 'home' : ''
          }`.trim()}
        />
      </Sticky>
      {children}
    </Box>
  );
};

export default Layout;
