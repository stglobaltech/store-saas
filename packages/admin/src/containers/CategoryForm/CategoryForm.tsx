import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { useDrawerDispatch } from 'context/DrawerContext';
import { Scrollbars } from 'react-custom-scrollbars';
import Input from 'components/Input/Input';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { useNotifier } from 'react-headless-notifier';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';
import {
  GET_PRODUCT_CATEGORIES,
  M_CREATE_PRODUCT_CATEGORY,
  Q_GET_STORE_ID,
} from 'services/GQL';
import SuccessNotification from 'components/Notification/SuccessNotification';
import DangerNotification from 'components/Notification/DangerNotification';
import Uploader from 'components/Uploader/Uploader';
import { uploadFile } from 'services/REST/restaurant.service';

interface imgUploadRes {
  [urlText: string]: any;
}

type Props = any;

const AddCategory: React.FC<Props> = (props) => {
  const {
    data: { storeId },
  } = useQuery(Q_GET_STORE_ID);

  const [categoryImage, setCategoryImage] = useState({
    url: '',
    uploading: false,
  });

  const dispatch = useDrawerDispatch();

  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);

  const { notify } = useNotifier();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  React.useEffect(() => {
    register({ name: 'parent' });
    register({ name: 'image' });
  }, [register]);

  const [createCategory, { loading: saving }] = useMutation(
    M_CREATE_PRODUCT_CATEGORY,
    {
      onCompleted: (data) => {
        closeDrawer();
        if (data && data.createCategory)
          notify(
            <SuccessNotification
              message={data.createCategory.message.en}
              dismiss
            />
          );
        else
          notify(
            <DangerNotification
              message={data.createCategory.message.en}
              dismiss
            />
          );
      },
      refetchQueries: [
        {
          query: GET_PRODUCT_CATEGORIES,
          variables: { storeId: storeId },
        },
      ],
    }
  );

  const uploadImage = (files) => {
    setCategoryImage({ ...categoryImage, uploading: true });
    const formData = new FormData();
    formData.append('file', files[0], files[0].name);
    uploadFile(formData)
      .then((result: imgUploadRes) => {
        setCategoryImage({
          ...categoryImage,
          url: result.urlText,
          uploading: false,
        });
      })
      .catch((err) => {
        setCategoryImage({ ...categoryImage, uploading: false });
      });
  };

  const onSubmit = (values) => {
    const newCategory = {
      name: { en: values.categoryName, ar: values.categoryNameRl },
      isEnable: true,
      storeCode: storeId,
      imageUrl: categoryImage.url,
    };
    createCategory({ variables: { categoryCreateInput: newCategory } });
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Add Category</DrawerTitle>
      </DrawerTitleWrapper>

      <Form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
        <Scrollbars
          autoHide
          renderView={(props) => (
            <div {...props} style={{ ...props.style, overflowX: 'hidden' }} />
          )}
          renderTrackHorizontal={(props) => (
            <div
              {...props}
              style={{ display: 'none' }}
              className='track-horizontal'
            />
          )}
        >
          <Row>
            <Col lg={4}>
              <FieldDetails>Upload your Category image here</FieldDetails>
            </Col>
            <Col lg={8}>
              <DrawerBox
                overrides={{
                  Block: {
                    style: {
                      width: '100%',
                      height: 'auto',
                      padding: '30px',
                      borderRadius: '3px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  },
                }}
              >
                <Uploader onChange={uploadImage} />
              </DrawerBox>
            </Col>
          </Row>
          <Row>
            <Col lg={4}>
              <FieldDetails>
                Add your category description and necessary informations from
                here
              </FieldDetails>
            </Col>

            <Col lg={8}>
              <DrawerBox>
                <FormFields>
                  <FormLabel>Category Name</FormLabel>
                  <Input
                    name='categoryName'
                    inputRef={register({
                      required: true,
                      minLength: 3,
                      maxLength: 20,
                    })}
                  />
                  {errors.categoryName && (
                    <div
                      style={{
                        margin: '5px 0 0 auto',
                        fontFamily: 'Lato, sans-serif',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'rgb(252, 92, 99)',
                      }}
                    >
                      {errors.categoryName.type === 'required'
                        ? 'Required'
                        : (errors.categoryName.type === 'minLength' ||
                            errors.categoryName.type === 'maxLength') &&
                          'Store Name must be 3-20 characters'}
                    </div>
                  )}
                </FormFields>
                <FormFields>
                  <FormLabel>Category Name (Regional Language)</FormLabel>
                  <Input
                    name='categoryNameRl'
                    inputRef={register({
                      required: true,
                      minLength: 3,
                      maxLength: 20,
                    })}
                  />
                  {errors.categoryNameRl && (
                    <div
                      style={{
                        margin: '5px 0 0 auto',
                        fontFamily: 'Lato, sans-serif',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'rgb(252, 92, 99)',
                      }}
                    >
                      {errors.categoryNameRl.type === 'required'
                        ? 'Required'
                        : (errors.categoryNameRl.type === 'minLength' ||
                            errors.categoryNameRl.type === 'maxLength') &&
                          'Store Name must be 3-20 characters'}
                    </div>
                  )}
                </FormFields>
              </DrawerBox>
            </Col>
          </Row>
        </Scrollbars>
        <ButtonGroup>
          <Button
            type='button'
            kind={KIND.minimal}
            onClick={closeDrawer}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: '50%',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  borderBottomRightRadius: '3px',
                  borderBottomLeftRadius: '3px',
                  marginRight: '15px',
                  color: $theme.colors.red400,
                }),
              },
            }}
          >
            Cancel
          </Button>

          <Button
            type='submit'
            disabled={saving || categoryImage.uploading}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: '50%',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  borderBottomRightRadius: '3px',
                  borderBottomLeftRadius: '3px',
                }),
              },
            }}
          >
            {categoryImage.uploading
              ? 'loading'
              : saving
              ? 'Saving'
              : 'Create Category'}
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddCategory;
