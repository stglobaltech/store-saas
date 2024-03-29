import React, { useContext, useEffect } from "react";
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
  ProductDescriptionTitle,
  MetaData,
  ProductMetaSingle,
  ProductMetaItem,
  ProductMetaItemDes,
} from "./product-details-one.style";
import { LongArrowLeft } from "assets/icons/LongArrowLeft";
import { CartIcon } from "assets/icons/CartIcon";
import ReadMore from "components/truncate/truncate";
import CarouselWithCustomDots from "components/multi-carousel/multi-carousel";
import Products from "components/product-grid/product-list/product-list";
import { FormattedMessage, useIntl } from "react-intl";
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
  ERROR_CART_EMPTY
} from "../../../utils/constant";
import { useAppState } from "contexts/app/app.provider";
import { getCartId } from "utils/localStorage";
import { handlePrevOrderPending } from "components/prev-order-pending/handleprevorderpending";
import Image from "components/image/image";
import DeliveryTruck from "../../../assets/images/cargo-truck.png";
import CashOnDelivery from "../../../assets/images/pay.png";
import Return from "../../../assets/images/return.png";
import ShoppingBag from "../../../assets/images/shopping-bag-green.png";

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
  const workFlowPolicy = useAppState("workFlowPolicy") as any;
  const { authState } = useContext<any>(AuthContext);
  const storeId = useAppState("activeStoreId");
  const entityId = storeId;

  const intl = useIntl();
  const { isRtl, locale } = useLocale();
  const data = product;

  const {
    addItem,
    removeItem,
    getItem,
    isInCart,
    cartItemsCount,
    getParticularItemCount,
  } = useCart();

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
            <DangerNotification
              message={intl.formatMessage({
                id: 'errorAddProductToCart',
                defaultMessage: ADD_PRODUCT_TO_CART_FAILED,
              })}
              dismiss
            />
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
    // if (getCartId()) {
    //   return handlePrevOrderPending();
    // }
    if (itemCountInCart === 0) {
      addProductToCart({ variables: { addProductInput } });
    } else {
      const currentItem = getItem(data._id);
      try {
        if (currentItem.maxQuantity < itemCountInCart + 1)
          throw new Error(intl.formatMessage({
            id: 'errorMaximumCartItemsAdded',
            defaultMessage: 'Maximum of {quantity} {product} can be added to the cart!',
          },
          {
            quantity: data.maxQuantity,
            product: locale === 'en' ? data.productName.en : data.productName.ar
          }
          ));
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
          <SuccessNotification
            message={intl.formatMessage({
              id: 'errorCartEmpty',
              defaultMessage: ERROR_CART_EMPTY,
            })}
            dismiss
          />
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
            <ProductTitle>
              {locale === 'en' ? product.productName.en : product.productName?.ar}
            </ProductTitle>
            <ProductPriceWrapper>
              <MetaData>
                <FormattedMessage id="perPiece" defaultMessage="per piece" />
              </MetaData>
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
            <b>
              <FormattedMessage id="maximumQuantity" defaultMessage="maximum quantity" />
            </b>{" "}
            : {product.maxQuantity}
          </ProductWeight>

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
                      id="addCartButtons"
                      defaultMessage="Add to cart"
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
            {authState?.isAuthenticated ? (
              <ProductCartBtn onClick={() => Router.push("/checkout")}>
                <Image
                  url={ShoppingBag}
                  style={{ width: "50px", height: "50px",cursor:"pointer" }}
                />
              </ProductCartBtn>
            ) : null}
          </ProductCartWrapper>

          <ProductMeta>
            <ProductMetaSingle>
              <ProductMetaItem>
                <Image
                  url={DeliveryTruck}
                  style={{ width: "20px", height: "20px" }}
                />
                <ProductMetaItemDes>
                  <FormattedMessage
                    id="dispatchHours"
                    defaultMessage="Dispatched within 24 hours"
                  />
                </ProductMetaItemDes>
              </ProductMetaItem>
              <ProductMetaItem>
                <Image
                  url={CashOnDelivery}
                  style={{ width: "20px", height: "20px" }}
                />
                <ProductMetaItemDes>
                  <FormattedMessage
                    id="payOnDeliveryAvailable"
                    defaultMessage="Pay on delivery available"
                  />
                </ProductMetaItemDes>
              </ProductMetaItem>
              <ProductMetaItem>
                <Image url={Return} style={{ width: "20px", height: "20px" }} />
                <ProductMetaItemDes> 
                  <FormattedMessage id="trackYourOrder" defaultMessage="Track your order" />
                </ProductMetaItemDes>
              </ProductMetaItem>
            </ProductMetaSingle>
          </ProductMeta>

          <ProductDescription>
            <ProductDescriptionTitle>
              <FormattedMessage id="productDetails" defaultMessage="Product Details" />
            </ProductDescriptionTitle>
            <ReadMore character={600}>
              {locale === 'en' ? product.description.en : product.description?.ar}
            </ReadMore>
          </ProductDescription>
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
