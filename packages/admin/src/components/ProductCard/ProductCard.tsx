import React from "react";
import {
  ProductCardWrapper,
  ProductImageWrapper,
  ProductInfo,
  SaleTag,
  DiscountPercent,
  Image,
  ProductTitle,
  ProductWeight,
  ProductMeta,
  OrderID,
  ProductPriceWrapper,
  ProductPrice,
  DiscountedPrice,
} from "./ProductCard.style";
import { useDrawerDispatch } from "context/DrawerContext";
import Switch from "components/switch/Switch";
import { useMutation } from "@apollo/client";
import { M_TOGGLE_PRODUCT_ISActivated } from "services/GQL";
import { useNotifier } from "react-headless-notifier";
import SuccessNotification from "../../components/Notification/SuccessNotification";
import DangerNotification from "../../components/Notification/DangerNotification";

type ProductCardProps = {
  title: string;
  image: any;
  weight?: string;
  currency?: string;
  description?: string;
  price: number;
  salePrice?: number;
  orderId?: number;
  discountInPercent?: number;
  data: any;
  isActivated?: boolean;
  productId?: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  image,
  weight,
  price,
  salePrice,
  discountInPercent,
  currency,
  data,
  orderId,
  isActivated,
  productId,
  ...props
}) => {
  const dispatch = useDrawerDispatch();
  const { notify } = useNotifier();

  const openDrawer = React.useCallback(
    () =>
      dispatch({
        type: "OPEN_DRAWER",
        drawerComponent: "PRODUCT_UPDATE_FORM",
        data: data,
      }),
    [dispatch, data]
  );

  const [toggleProduct] = useMutation(M_TOGGLE_PRODUCT_ISActivated, {
    onCompleted: (data) => {
      if (
        data &&
        data.toggleProductIsActivatedState &&
        data.toggleProductIsActivatedState.success
      ) {
        notify(
          <SuccessNotification
            message={data.toggleProductIsActivatedState?.message?.en}
            dismiss
          />
        );
      } else {
        notify(
          <DangerNotification
            message={
              data?.toggleProductIsActivated?.message?.en ||
              "Could not change product state"
            }
            dismiss
          />
        );
      }
    },
  });

  function handleToggle(e) {
    toggleProduct({
      variables: {
        productToggleIsActivatedInputDto: {
          productIds: [productId],
          isActivated: e,
        },
      },
    });
  }

  return (
    <ProductCardWrapper {...props} className="product-card">
      <ProductImageWrapper onClick={openDrawer}>
        <Image url={image} className="product-image" />
        {discountInPercent && discountInPercent !== 0 ? (
          <>
            <SaleTag>Sale</SaleTag>
            <DiscountPercent>{discountInPercent}% Off</DiscountPercent>
          </>
        ) : null}
      </ProductImageWrapper>
      <ProductInfo>
        <ProductTitle>{title}</ProductTitle>
        <ProductWeight>{weight}</ProductWeight>
        <ProductMeta>
          <ProductPriceWrapper>
            <ProductPrice>
              {currency} {salePrice && salePrice !== 0 ? salePrice : price}
            </ProductPrice>

            {discountInPercent && discountInPercent !== 0 ? (
              <DiscountedPrice>
                {currency} {price}
              </DiscountedPrice>
            ) : null}
          </ProductPriceWrapper>

          <OrderID>
            <Switch isActivated={isActivated} handleToggle={handleToggle} />
          </OrderID>
        </ProductMeta>
      </ProductInfo>
    </ProductCardWrapper>
  );
};

export default ProductCard;
