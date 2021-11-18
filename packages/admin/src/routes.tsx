import React, { lazy, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  LOGIN,
  PRODUCTS,
  CATEGORY,
  DASHBOARD,
  ORDERS,
  SETTINGS,
  CUSTOMERS,
  COUPONS,
  CONTACT_DETAILS,
  STORE_SETTINGS,
  REPORTS
} from 'settings/constants';
import AuthProvider from 'context/auth';
import { InLineLoader } from 'components/InlineLoader/InlineLoader';
import { useQuery } from '@apollo/client';
import { Q_IS_LOGGED_IN } from 'services/GQL';

const Products = lazy(() => import('containers/Products/Products'));
const AdminLayout = lazy(() => import('containers/Layout/Layout'));
const Dashboard = lazy(() => import('containers/Dashboard/Dashboard'));
const Category = lazy(() => import('containers/Category/Category'));
const Orders = lazy(() => import('containers/Orders/Orders'));
const Settings = lazy(() => import('containers/Settings/Settings'));
const StoreSettingForm = lazy(() =>
  import('containers/StoreSettingForm/StoreSettingForm')
);
const ContactDetails = lazy(() => import('containers/ContactDetails/ContactDetails'));
const Customers = lazy(() => import('containers/Customers/Customers'));
const Coupons = lazy(() => import('containers/Coupons/Coupons'));
const Login = lazy(() => import('containers/Login/Login'));
const NotFound = lazy(() => import('containers/NotFound/NotFound'));
const Reports = lazy(() => import('containers/Reports/OrdersReport'));

/**
 *
 *  A wrapper for <Route> that redirects to the login
 * screen if you're not yet authenticated.
 *
 */

function PrivateRoute({ children, ...rest }) {
  const { data: { isLoggedIn = false } } = useQuery(Q_IS_LOGGED_IN);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

const Routes = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<InLineLoader />}>
        <Switch>
          <PrivateRoute exact={true} path={DASHBOARD}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Dashboard />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={PRODUCTS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Products />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={CATEGORY}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Category />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={ORDERS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Orders />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={CUSTOMERS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Customers />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={COUPONS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Coupons />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={REPORTS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Reports />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={SETTINGS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Settings />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={CONTACT_DETAILS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <ContactDetails />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={STORE_SETTINGS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <StoreSettingForm />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <Route path={LOGIN}>
            <Login />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AuthProvider>
  );
};

export default Routes;
