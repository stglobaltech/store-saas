import React, { useCallback } from 'react';
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

import { Waypoint } from 'react-waypoint';
import { Button } from 'components/button/button';
import { useAppDispatch } from 'contexts/app/app.provider';
import Search from 'features/search/search';
// import CategoryIconNav from 'components/type-nav/type-nav';
// import { useModal } from 'contexts/modal/use-modal';

interface Props {
  intlTitleId: string;
  type?: string;
  // onClick?: Function;
}

export const MobileBanner: React.FC<Props> = ({
  type,
  // onClick,
  intlTitleId,
}) => {
  // const [showModal] = useModal(() => <CategoryIconNav />);
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
            // onClick={showModal}
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
    </Box>
  );
};
