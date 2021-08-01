import React, { useState, useEffect } from 'react';
import {
  WalkerWrapper,
  Category,
  NoCategory,
  IconWrapper,
  CategoryWrapper,
} from './category-walker.style';
import { Button } from 'components/button/button';
import { ArrowNext } from 'assets/icons/ArrowNext';
import SpringModal from 'components/spring-modal/spring-modal';
import { useRouter } from 'next/router';
// import { TreeMenu } from 'components/tree-menu/tree-menu';
import startCase from 'lodash/startCase';

type WalkerProps = {
  style?: any;
  className?: string;
  children: React.ReactNode;
  // onClick: () => void;
};

const CategoryWalker: React.FunctionComponent<WalkerProps> = ({
  style,
  className,
  children,
}) => {
  const [isOpen, setOpen] = useState(false);
  const { query } = useRouter();
  return (
    <WalkerWrapper style={style} className={className}>
      <CategoryWrapper>
        {query.category ? (
          <Category>{startCase(query.category as string)}</Category>
        ) : (
          <NoCategory>No Category Selected</NoCategory>
        )}
        {/* <IconWrapper>
          <ArrowNext width="13px" />
        </IconWrapper>
        <Category>{child}</Category> */}
      </CategoryWrapper>

      <Button variant='text' onClick={() => setOpen(true)}>
        Filter
      </Button>
      <SpringModal isOpen={isOpen} onRequestClose={() => setOpen(false)}>
        {children}
      </SpringModal>
    </WalkerWrapper>
  );
};

export default CategoryWalker;
