import styled from 'styled-components';
import css from '@styled-system/css';

export const CategoryWrapper = styled.div<any>(
  css({
    padding: ['30px 15px', '30px 15px', '30px'],
  })
);

export const CategoryInner = styled.div<any>({
  position: 'relative',
});

export const ItemCard = styled.div<any>((props) =>
 css({
    textAlign: 'center',
    borderRadius: 6,
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    border: props.active ? '2px solid' : '2px solid #fff',
    borderColor: props.active ? 'primary.regular' : '#fff',
  })
);

export const ImageWrapper = styled.div<any>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '200px',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  padding:20,
  img: {
    // width: 'auto',
    // height: '200px',
    // maxWidth: '100%',
    // maxHeight: '100%',
    flexShrink: 0,
    minWidth: '100%',
    minHeight: '200px',
  },
});

export const Title = styled.span<any>(
  css({
    fontSize: 'base',
    fontWeight: 'bolder',
    textAlign: 'center',
    padding: '12px 6px',
    display: 'block',
    letterSpacing:"1px"
  })
);

export const SliderNav = styled.button({
  width: 30,
  height: 30,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'text.bold',
  backgroundColor: 'white',
  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)',
  outline: 0,
  padding: 0,
  border: 0,
  borderRadius: '50%',
  position: 'absolute',
  top: '50%',
  marginTop: '-15px',
  zIndex: 1,
  cursor: 'pointer',

  svg: {
    width: 18,
    maxHeight: 18,
  },

  '&.swiper-button-disabled': {
    display: 'none',
  },

  '&.banner-slider-prev': {
    left: -15,
  },

  '&.banner-slider-next': {
    right: -15,
  },
});
