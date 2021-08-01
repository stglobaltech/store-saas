import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import ProductDetailsFood from 'features/product-details/product-details-one/product-details-one';
import { Modal } from '@redq/reuse-modal';
import { GET_VENDOR } from 'utils/graphql/query/vendor.query';
import { SEO } from 'components/seo';
import ErrorMessage from 'components/error-message/error-message';
import { Box } from 'components/box';

const ProductPage: NextPage = () => {
  const {
    query: { slug },
  } = useRouter();

  const { data, error, loading } = useQuery(GET_VENDOR, {
    variables: { slug },
  });

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <SEO
        title={`${data?.vendor?.name} - PickBazar`}
        description={`${data?.vendor?.name} Details`}
      />
      <Modal>
        <Box position="relative" bg="gray.200" pt={[60, 89, 78]} pb={60}>
          <ProductDetailsFood product={data?.vendor} />
        </Box>
      </Modal>
    </>
  );
};
export default ProductPage;
