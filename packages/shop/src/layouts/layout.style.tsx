import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';

export const LayoutWrapper = styled.div`
  background-color: ${themeGet('colors.gray.200', '#F7F7F7')};

  @media (max-width: 990px) {
    background-color: ${themeGet('colors.white', '#ffffff')};
  }

  .reuseModalHolder {
    padding: 0;
    overflow: auto;
    border-radius: ${themeGet('radii.small', '3px')}
      ${themeGet('radii.small', '3px')} 0 0;
    border: 0;
  }
`;
