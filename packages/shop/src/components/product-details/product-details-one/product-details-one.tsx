import React, { useEffect } from "react";
import Router from "next/router";
import { Button } from "components/button/button";
import {
  ProductDetailsWrapper,
  ProductPreview,
  ProductInfo,
  ProductTitlePriceWrapper,
  ProductTitle,
  BackButton,
  ProductWeight,
  ProductDescription,
  ButtonText,
  ProductMeta,
  ProductCartWrapper,
  ProductPriceWrapper,
  ProductPrice,
  SalePrice,
  ProductCartBtn,
  MetaSingle,
  MetaItem,
  RelatedItems,
} from "./product-details-one.style";
import { LongArrowLeft } from "assets/icons/LongArrowLeft";
import { CartIcon } from "assets/icons/CartIcon";
import ReadMore from "components/truncate/truncate";
import CarouselWithCustomDots from "components/multi-carousel/multi-carousel";
import Products from "components/product-grid/product-list/product-list";
import { FormattedMessage } from "react-intl";
import { useLocale } from "contexts/language/language.provider";
import { Counter } from "components/counter/counter";

import AuthenticationForm from "features/authentication-form";
import { openModal } from "@redq/reuse-modal";
import { useNotifier } from "react-headless-notifier";
import { useMutation } from "@apollo/client";
import { useCart } from "contexts/cart/use-cart";
import { AuthContext } from "contexts/auth/auth.context";
import { M_ADD_PRODUCT_TO_CART } from "graphql/mutation/add-product-to-cart.mutation";
import { M_UPDATE_PRODUCT_QUANTITY } from "graphql/mutation/update-product-quantity.mutation";
import SuccessNotification from "../../../components/Notification/SuccessNotification";
import DangerNotification from "../../../components/Notification/DangerNotification";
import {
  ADD_PRODUCT_TO_CART_FAILED,
  ERROR_CART_DELETED,
} from "../../../utils/constant";
import { useAppState } from "contexts/app/app.provider";
import { getCartId } from "utils/localStorage";
import { handlePrevOrderPending } from "components/prev-order-pending/handleprevorderpending";

type ProductDetailsProps = {
  product: any;
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

const ProductDetails: React.FunctionComponent<ProductDetailsProps> = ({
  product,
  deviceType,
}) => {
  const storeId = process.env.NEXT_PUBLIC_STG_CLIENT_ID;
  const entityId = storeId;

  const { isRtl } = useLocale();
  const data = product;

  const {
    addItem,
    removeItem,
    getItem,
    isInCart,
    cartItemsCount,
    getParticularItemCount,
  } = useCart();

  const workFlowPolicy = useAppState("workFlowPolicy") as any;

  const { notify } = useNotifier();

  const [addProductToCart, { loading: addProductLoading }] = useMutation(
    M_ADD_PRODUCT_TO_CART,
    {
      onCompleted: (resData) => {
        if (
          resData &&
          resData.addProductToCart &&
          resData.addProductToCart.productId
        ) {
          addItem({
            ...data,
            inCartProductId: resData.addProductToCart.productId,
          });
        } else {
          notify(
            <DangerNotification message={ADD_PRODUCT_TO_CART_FAILED} dismiss />
          );
        }
      },
    }
  );

  const [
    updateProductQuantity,
    { loading: updateProductQuantityLoading },
  ] = useMutation(M_UPDATE_PRODUCT_QUANTITY);

  const {
    authState: { isAuthenticated },
    authDispatch,
  } = React.useContext<any>(AuthContext);

  function handleJoin() {
    authDispatch({
      type: "SIGNIN",
    });

    openModal({
      show: true,
      overlayClassName: "quick-view-overlay",
      closeOnClickOutside: true,
      component: AuthenticationForm,
      closeComponent: "",
      config: {
        enableResizing: false,
        disableDragging: true,
        className: "quick-view-modal",
        width: 458,
        height: "auto",
      },
    });
  }

  async function addItemHandler() {
    const {
      _id,
      productName: { en, ar },
      price,
      quantity,
      maxQuantity,
    } = data;
    const addProductInput = {
      entityId,
      storeCode: storeId,
      product: {
        productId: _id,
        name: { en, ar },
        quantity: 1,
        maxQuantity: maxQuantity,
        price: price.price,
        quotedPrice: price.price,
      },
    };
    const itemCountInCart = getParticularItemCount(data._id);
    if (getCartId()) {
      return handlePrevOrderPending();
    }
    if (itemCountInCart === 0) {
      addProductToCart({ variables: { addProductInput } });
    } else {
      const currentItem = getItem(data._id);
      try {
        if (currentItem.maxQuantity < itemCountInCart + 1)
          throw new Error(
            `maximum of ${data.maxQuantity} ${data.productName.en} can be added to the cart!`
          );
        const res = (await updateProductQuantity({
          variables: {
            quantityUpdateInput: {
              productId: currentItem.inCartProductId,
              quantity: itemCountInCart + 1,
              entityId: storeId,
            },
          },
        })) as any;
        if (
          res &&
          res.data.updateCartProductQuantity &&
          res.data.updateCartProductQuantity.totalPrice
        ) {
          addItem(data);
        } else {
          throw new Error(`could not add ${data.productName.en} to the cart!`);
        }
      } catch (error) {
        notify(<DangerNotification message={`${error.message}`} dismiss />);
      }
    }
  }

  async function removeItemHandler() {
    const { _id, maxQuantity } = data;
    const itemCountInCart = getParticularItemCount(_id);
    const currentItem = getItem(data._id);
    try {
      const res = await updateProductQuantity({
        variables: {
          quantityUpdateInput: {
            productId: currentItem.inCartProductId,
            quantity: itemCountInCart - 1,
            entityId: storeId,
          },
        },
      });
      if (
        res &&
        res.data.updateCartProductQuantity &&
        res.data.updateCartProductQuantity.totalPrice
      ) {
        removeItem(data);
      }
    } catch (error) {
      if (error.message === ERROR_CART_DELETED) {
        removeItem(data);
        notify(
          <SuccessNotification message={`Your cart is empty now!`} dismiss />
        );
      }
    }
  }

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      handleJoin();
    } else {
      addItemHandler();
    }
    // if (!isInCart(data.id)) {
    //   cartAnimation(e);
    // }
  };
  const handleRemoveClick = (e) => {
    e.stopPropagation();
    removeItemHandler();
  };

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  }, []);

  return (
    <>
      <ProductDetailsWrapper className="product-card" dir="ltr">
        {!isRtl && (
          <ProductPreview>
            <BackButton>
              <Button
                type="button"
                size="small"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #f1f1f1",
                  color: "#77798c",
                }}
                onClick={Router.back}
              >
                <LongArrowLeft style={{ marginRight: 5 }} />
                <FormattedMessage id="backBtn" defaultMessage="Back" />
              </Button>
            </BackButton>

            <CarouselWithCustomDots
              items={[{ url: product.picture }]}
              deviceType={deviceType}
            />
          </ProductPreview>
        )}

        <ProductInfo dir={isRtl ? "rtl" : "ltr"}>
          <ProductTitlePriceWrapper>
            <ProductTitle>{product.productName.en}</ProductTitle>
            <ProductPriceWrapper>
              {product.discountInPercent ? (
                <SalePrice>
                  {workFlowPolicy.currency + " "}
                  {product.price.price}
                </SalePrice>
              ) : null}

              <ProductPrice>
                {workFlowPolicy.currency + " "}
                {product.price.price}
              </ProductPrice>
            </ProductPriceWrapper>
          </ProductTitlePriceWrapper>

          <ProductWeight>
            <b>maximum quantity</b> : {product.maxQuantity}
          </ProductWeight>
          <ProductDescription>
            <ReadMore character={600}>{product.description.en}</ReadMore>
          </ProductDescription>

          <ProductCartWrapper>
            <ProductCartBtn>
              {!isInCart(data._id) ? (
                <Button
                  className="cart-button"
                  variant="secondary"
                  borderRadius={100}
                  onClick={handleAddClick}
                >
                  <CartIcon mr={2} />
                  <ButtonText>
                    <FormattedMessage
                      id="addCartButton"
                      defaultMessage="Cart"
                    />
                  </ButtonText>
                </Button>
              ) : (
                <Counter
                  value={getItem(data._id).quantity}
                  onDecrement={handleRemoveClick}
                  onIncrement={handleAddClick}
                />
              )}
            </ProductCartBtn>
          </ProductCartWrapper>
          {/* 
          <ProductMeta>
            <MetaSingle>
              {product?.categories?.map((item: any) => (
                <Link
                  href={`/${product.type.toLowerCase()}?category=${item.slug}`}
                  key={`link-${item.id}`}
                >
                  <a>
                    <MetaItem>{item.title}</MetaItem>
                  </a>
                </Link>
              ))}
            </MetaSingle>
          </ProductMeta> */}
        </ProductInfo>

        {/* {isRtl && (
          <ProductPreview>
            <BackButton>
              <Button
                title="Back"
                intlButtonId="backBtn"
                iconPosition="left"
                size="small"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f1f1f1',
                  color: '#77798c',
                }}
                icon={<LongArrowLeft />}
                onClick={Router.back}
              />
            </BackButton>

            <CarouselWithCustomDots
              items={product.gallery}
              deviceType={deviceType}
            />
          </ProductPreview>
        )} */}
      </ProductDetailsWrapper>

      {/* <RelatedItems>
        <h2>
          <FormattedMessage
            id="intlRelatedItems"
            defaultMessage="Related Items"
          />
        </h2>
        <Products
          type={product.type.toLowerCase()}
          deviceType={deviceType}
          loadMore={false}
          fetchLimit={10}
        />
      </RelatedItems> */}
    </>
  );
};

export default ProductDetails;
