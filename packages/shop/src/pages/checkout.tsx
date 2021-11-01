import React,{useEffect} from "react";
import { NextPage, GetStaticProps } from "next";
import { useQuery } from "@apollo/client";
import { Modal } from "@redq/reuse-modal";
import { SEO } from "components/seo";
import Checkout from "features/checkouts/checkout-two/checkout-two";
import { Q_GET_ALL_ADDRESSES } from "graphql/query/customer.query";

import { ProfileProvider } from "contexts/profile/profile.provider";
import { initializeApollo } from "utils/apollo";
import { Q_GET_USERID } from "graphql/query/loggedIn-user.query";

type Props = {
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};
const CheckoutPage: NextPage<Props> = ({ deviceType }) => {
  // const { data, error, loading } = useQuery(Q_GET_USERID);

  const { data, loading } = useQuery(Q_GET_ALL_ADDRESSES);

  let token = "true";

  if (loading) {
    return <div>loading...</div>;
  }

  function formatAddress() {
    const addresses = data.getAllAddress.map((address) => ({
      address: address.address,
      id: address.id,
      name: address.name,
    }));
    return addresses;
  }

  let userAddresses = [];
  if (data) {
    userAddresses = formatAddress();
  }

  return (
    <>
      <SEO title="Checkout - PickBazar" description="Checkout Details" />
      <ProfileProvider initData={{address:userAddresses}}>
        <Modal>
          <Checkout token={token} deviceType={deviceType} />
        </Modal>
      </ProfileProvider>
    </>
  );
};

// export const getStaticProps: GetStaticProps = async () => {
//   const apolloClient = initializeApollo();

//   await apolloClient.query({
//     query: GET_LOGGED_IN_CUSTOMER,
//   });

//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//   };
// };

export default CheckoutPage;
