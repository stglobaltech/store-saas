import React from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { GET_CATEGORIES_BY_STOREID } from "graphql/query/category.query";
import { useRouter } from "next/router";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import css from "@styled-system/css";
import { Box } from "components/box";
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
import CategoryImage from "assets/images/categories.png";
import All from "../../assets/images/all.png";
import Bag from "../../assets/images/bag.png";
import Cart from "../../assets/images/trolley2.png";
import Loader from "components/loader/loader";
import { FormattedMessage } from "react-intl";
import ErrorMessage from "../../components/error-message/error-message";
import { useLocale } from "contexts/language/language.provider";
import { useAppState } from "contexts/app/app.provider";
SwiperCore.use([Navigation]);

const Grid = styled.div(
  css({
    display: "grid",
    gridGap: "10px",
    gridTemplateColumns: "repeat(1, minmax(180px, 1fr))",

    "@media screen and (min-width: 480px)": {
      gridTemplateColumns: "repeat(2, minmax(180px, 1fr))",
    },

    "@media screen and (min-width: 740px)": {
      gridTemplateColumns: "repeat(3, minmax(180px, 1fr))",
    },

    "@media screen and (min-width: 991px)": {
      gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
    },

    "@media screen and (min-width: 1200px)": {
      gridTemplateColumns: "repeat(5, minmax(180px, 1fr))",
    },

    "@media screen and (min-width: 1400px)": {
      gridTemplateColumns: "repeat(6, minmax(180px, 1fr))",
    },

    "@media screen and (min-width: 1700px)": {
      gridTemplateColumns: "repeat(7, minmax(180px, 1fr))",
    },
  })
);

const Card = styled.div<any>((props) => {
  return {
    backgroundColor: "#fff",
    position: "relative",
    overflow: "hidden",
    borderRadius: 6,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: props.active ? "2px solid #04aa6d" : "2px solid #fff",
    borderColor: props.active ? "primary.regular" : "#fff",
    cursor: "pointer",
    transition: "0.25s ease-in-out",
  };
});

interface Props {
  type: string;
  productCategoriesSSR?: Array<any>;
}

export const HorizontalCategoryCardMenu = ({}: Props) => {
  const router = useRouter();
  const storeId = useAppState("activeStoreId");
  const { isRtl, locale } = useLocale();

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
              <Card
                role="button"
                onClick={() => onCategoryClick(category._id)}
                active={selectedQueries === category._id}
              >
                <Box position="relative" padding={10}>
                  <ImageWrapper>
                    <Image
                      url={category?.imageUrl?.length ? category.imageUrl : Bag}
                      alt={category?.title}
                    />
                  </ImageWrapper>
                </Box>
                <Title>{locale === 'en' ? category.name.en : category.name.ar}</Title>
              </Card>
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
        <FormattedMessage id="categories" defaultMessage="Categories" />
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
            <Card
              role="button"
              onClick={() => router.replace("/")}
              active={router.asPath === "/"}
            >
              <Box position="relative" padding={10}>
                <ImageWrapper>
                  <img src={All} alt={"All Categories"} />
                </ImageWrapper>
              </Box>
              <Title>
                <FormattedMessage id="all" defaultMessage="All" />
              </Title>
            </Card>
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
