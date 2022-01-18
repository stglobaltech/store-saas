import React from "react";
import { useQuery } from "@apollo/client";
import {
  GET_CATEGORIES,
  GET_CATEGORIES_BY_STOREID,
} from "graphql/query/category.query";
import { useRouter } from "next/router";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "components/image/image";
import { ArrowNext } from "assets/icons/ArrowNext";
import { ArrowPrev } from "assets/icons/ArrowPrev";
import {
  CategoryWrapper,
  CategoryInner,
  ItemCard,
  ImageWrapper,
  Title,
  SliderNav,
} from "./horizontal-category-card-menu.style";
import noImage from "assets/images/no_image.jpg";
import All from "../../assets/images/all.png";
import Loader from "components/loader/loader";
import { FormattedMessage } from "react-intl";
import ErrorMessage from "../../components/error-message/error-message";
import { useLocale } from "contexts/language/language.provider";
import { useAppState } from "contexts/app/app.provider";
SwiperCore.use([Navigation]);

interface Props {
  type: string;
  productCategoriesSSR?: Array<any>;
}

export const HorizontalCategoryCardMenu = ({}: Props) => {
  const router = useRouter();
  const storeId = useAppState("activeStoreId");
  const { isRtl } = useLocale();

  const { data, loading, error } = useQuery(GET_CATEGORIES_BY_STOREID, {
    variables: { storeId },
  });

  const { pathname, query } = router;
  const selectedQueries = query.category;

  const onCategoryClick = (slug: string) => {
    delete query["search"];
    router.push({
      pathname,
      query: { ...query, category: slug },
    });
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <ErrorMessage>
        <FormattedMessage id="error" defaultMessage="Something went wrong :(" />
      </ErrorMessage>
    );

  const sliderContent = () => {
    return (
      <>
        {data?.getCategoriesForUser?.productCategories?.map((category, idx) => {
          return (
            <SwiperSlide key={idx}>
              <ItemCard
                role="button"
                onClick={() => onCategoryClick(category._id)}
                active={selectedQueries === category._id}
              >
                <ImageWrapper>
                  <Image
                    url={
                      category?.imageUrl?.length ? category.imageUrl : noImage
                    }
                    alt={category?.title}
                  />
                </ImageWrapper>
                <Title>{!isRtl ? category.name.en : category.name.ar}</Title>
              </ItemCard>
            </SwiperSlide>
          );
        })}
      </>
    );
  };

  const breakpoints = {
    320: {
      slidesPerView: 2,
    },

    440: {
      slidesPerView: 3,
    },

    620: {
      slidesPerView: 4,
    },

    820: {
      slidesPerView: 5,
    },

    1100: {
      slidesPerView: 6,
    },

    1280: {
      slidesPerView: 7,
    },
  };

  return (
    <CategoryWrapper>
      <h4 style={{ marginBottom: "20px", color: "#04aa6d", padding: "10px" }}>
        Categories
      </h4>
      <CategoryInner>
        <Swiper
          id="category-card-menu"
          navigation={{
            nextEl: ".banner-slider-next",
            prevEl: ".banner-slider-prev",
          }}
          breakpoints={breakpoints}
          slidesPerView={7}
          spaceBetween={10}
        >
          <SwiperSlide key={"all"}>
            <ItemCard role="button" onClick={() => router.replace("/")} active={router.asPath==="/"}>
              <ImageWrapper>
                <Image url={All} alt={"All Categories"} />
              </ImageWrapper>
              <Title>{!isRtl ? "All" : "All"}</Title>
            </ItemCard>
          </SwiperSlide>
          {sliderContent()}
        </Swiper>
        <SliderNav className="banner-slider-next">
          <ArrowNext />
        </SliderNav>
        <SliderNav className="banner-slider-prev">
          <ArrowPrev />
        </SliderNav>
      </CategoryInner>
    </CategoryWrapper>
  );
};
