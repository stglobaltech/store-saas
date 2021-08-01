import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box } from './box';
import { Text } from './text';
import * as icons from 'assets/icons/category-icons';

const CardBox = styled.div<any>((props) =>
  css({
    backgroundColor: ['gray.200', 'gray.200', '#fff'],
    textAlign: 'center',
    padding: '1rem 10px',
    borderRadius: [10, 10, 6],
    cursor: 'pointer',
    border: props.active ? '2px solid' : '2px solid',
    borderColor: props.active ? '#212121' : ['gray.200', 'gray.200', '#fff'],
  })
);
interface Props {
  data: any;
  active: any;
  style?: any;
  onClick: (slug: string) => void;
}
const Icon = ({ name, style }) => {
  const TagName = icons[name];
  return !!TagName ? <TagName style={style} /> : <p>Invalid icon {name}</p>;
};
export const CardMenu = ({ data, onClick, active, style }: Props) => {
  return (
    <>
      {data.map(({ id, title, icon, slug }) => (
        <CardBox
          key={id}
          onClick={() => onClick(slug)}
          active={slug === active}
          role='button'
          style={style}
        >
          <Box
            padding='10px 15px'
            height={80}
            alignItems='center'
            justifyContent='center'
            display='flex'
          >
            <Icon name={icon} style={{ height: 40, width: 'auto' }} />
          </Box>
          <Text as='span' color='#212121' fontSize={14} fontWeight={600}>
            {title}
          </Text>
        </CardBox>
      ))}
    </>
  );
};
