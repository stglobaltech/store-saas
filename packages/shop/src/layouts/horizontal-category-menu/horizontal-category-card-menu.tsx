import React from "react";
import { GET_CATEGORIES } from "graphql/query/category.query";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import ErrorMessage from "components/error-message/error-message";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Text } from "components/text";
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

SwiperCore.use([Navigation]);

interface Props {
  type: string;
  productCategories?: Array<any>;
}

export const HorizontalCategoryCardMenu = ({
  productCategories,
}: Props) => {
  const router = useRouter();
  if (!productCategories) return null;
  const { pathname, query } = router;
  const selectedQueries = query.category;

  const onCategoryClick = (slug: string) => {
    delete query["search"];
    router.push({
      pathname,
      query: { ...query, category: slug },
    });
  };

  const sliderContent = () => {
    return (
      <>
        {productCategories.map((category, idx) => (
          <SwiperSlide key={idx}>
            <ItemCard
              role="button"
              onClick={() => onCategoryClick(category._id)}
              active={selectedQueries === category.slug}
            >
              <ImageWrapper>
                <Image url={category.imageUrl} alt={category.title} />
              </ImageWrapper>
              <Title>{category.name.en}</Title>
            </ItemCard>
          </SwiperSlide>
        ))}
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
