import React from 'react';
import Carousel from 'react-multi-carousel';
import styled from 'styled-components';
import css from '@styled-system/css';
import { ArrowNext } from 'assets/icons/arrow-next';
import { ArrowPrev } from 'assets/icons/arrow-prev';
import { useLocale } from 'contexts/language/language.provider';

const ButtonPrev = styled.button(
  css({
    backgroundColor: 'white',
    color: 'primary.regular',
    boxShadow: 'base',
    left: ['5px', '5px', '27px'],
  }),
  {
    height: 40,
    width: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderRadius: '20px',
    border: 0,
    outline: 0,
    cursor: 'pointer',
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    zIndex: 99,
  }
);

const ButtonNext = styled.button(
  css({
    backgroundColor: 'white',
    color: 'primary.regular',
    boxShadow: 'base',
    right: ['5px', '5px', '27px'],
  }),
  {
    height: 40,
    width: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderRadius: '20px',
    border: 0,
    outline: 0,
    cursor: 'pointer',
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    zIndex: 99,
  }
);

const PrevButton = ({ onClick, children }: any) => {
  return (
    <ButtonPrev
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className='prevButton'
      aria-label='Back Arrow'
    >
      {children}
    </ButtonPrev>
  );
};
const NextButton = ({ onClick, children }: any) => {
  return (
    <ButtonNext
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className='nextButton'
      aria-label='Forward Arrow'
    >
      {children}
    </ButtonNext>
  );
};

const ButtonGroup = ({ next, previous }: any) => {
  const { isRtl }: any = useLocale();

  return (
    <div>
      {isRtl ? (
        <>
          <NextButton onClick={() => next()} className='rtl'>
            <ArrowPrev />
          </NextButton>
          <PrevButton onClick={() => previous()}>
            <ArrowNext />
          </PrevButton>
        </>
      ) : (
        <>
          <PrevButton onClick={() => previous()}>
            <ArrowPrev />
          </PrevButton>
          <NextButton onClick={() => next()}>
            <ArrowNext />
          </NextButton>
        </>
      )}
    </div>
  );
};

type Props = {
  data: any[] | undefined;
  props?: any;
  component?: any;
  autoPlay?: boolean;
  infinite?: boolean;
  isRtl?: boolean;
  customLeftArrow?: React.ReactElement;
  customRightArrow?: React.ReactElement;
  itemClass?: string;
};
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};
export default function CustomCarousel({
  data,
  component,
  autoPlay = false,
  infinite = true,
  customLeftArrow,
  customRightArrow,
  itemClass,
  isRtl,
  ...props
}: Props) {
  return (
    <div dir='ltr'>
      <Carousel
        arrows={false}
        ssr={true}
        deviceType={''}
        responsive={responsive}
        showDots={false}
        slidesToSlide={1}
        infinite={infinite}
        containerClass='container-with-dots'
        itemClass={itemClass}
        autoPlay={autoPlay}
        autoPlaySpeed={3000}
        renderButtonGroupOutside={true}
        additionalTransfrom={0}
        customButtonGroup={<ButtonGroup />}
        {...props}
        // use dir ltr when rtl true
      >
        {data.map((item: any, index: number) => {
          if (component) return component(item);
          return (
            <div style={{ padding: '0 10px', overflow: 'hidden' }} key={index}>
              <a
                href={item.link}
                style={{ display: 'flex', cursor: 'pointer' }}
              >
                <img
                  key={item.id}
                  src={item.imgSrc}
                  alt={item.alt}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    position: 'relative',
                  }}
                />
              </a>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}
