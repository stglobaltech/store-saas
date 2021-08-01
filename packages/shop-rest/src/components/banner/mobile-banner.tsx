import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  Image,
  Content,
  Title,
  ContentRow,
  Description,
  SearchWrapper,
} from './banner.style';
import dynamic from 'next/dynamic';
import { Waypoint } from 'react-waypoint';
import { Button } from 'components/button/button';
import { useAppDispatch } from 'contexts/app/app.provider';
import Search from 'features/search/search';
const CategoryIconNav = dynamic(() => import('components/type-nav/type-nav'));
const SpringModal = dynamic(() =>
  import('components/spring-modal/spring-modal')
);

interface Props {
  intlTitleId: string;
  type?: string;
}

export const MobileBanner: React.FC<Props> = ({ type, intlTitleId }) => {
  const [isOpen, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const setSticky = useCallback(() => dispatch({ type: 'SET_STICKY' }), [
    dispatch,
  ]);
  const removeSticky = useCallback(() => dispatch({ type: 'REMOVE_STICKY' }), [
    dispatch,
  ]);
  const onWaypointPositionChange = ({ currentPosition }) => {
    if (!currentPosition || currentPosition === 'above') {
      setSticky();
    }
  };
  return (
    <Box display={['flex', 'flex', 'none']}>
      <Content>
        <ContentRow>
          <Description>
            <FormattedMessage
              id={intlTitleId}
              defaultMessage="Set Your Title Through Language File"
              values={{ minute: 90 }}
            />
          </Description>

          <Button
            variant="text"
            onClick={() => setOpen(true)}
            style={{ textTransform: 'capitalize' }}
          >
            {type}
          </Button>
        </ContentRow>

        <SearchWrapper>
          <Search minimal={true} />
        </SearchWrapper>
        <Waypoint
          onEnter={removeSticky}
          onLeave={setSticky}
          onPositionChange={onWaypointPositionChange}
        />
      </Content>
      <SpringModal isOpen={isOpen} onRequestClose={() => setOpen(false)}>
        <CategoryIconNav />
      </SpringModal>
    </Box>
  );
};
