import styled from 'styled-components';
import { compose, space, color, typography } from 'styled-system';

export const Text = styled.p<any>(
  {
    boxSizing: 'border-box',
    minWidth: 0,
    margin: 0,
  },
  compose(space, color, typography)
);
