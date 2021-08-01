import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import RadioGroup from 'components/radio-group/radio-group';
import RadioCard from 'components/radio-card/radio-card';

import { ProfileContext } from 'contexts/profile/profile.context';
import { CardHeader } from 'components/card-header/card-header';

interface Props {
  increment?: boolean;
}

const Schedules = ({ increment = false }: Props) => {
  const {
    state: { schedules },
    dispatch,
  } = useContext(ProfileContext);

  return (
    <>
      <CardHeader increment={increment}>
        <FormattedMessage
          id="deliverySchedule"
          defaultMessage="Select Your Delivery Schedule"
        />
      </CardHeader>
      <RadioGroup
        items={schedules}
        component={(item: any) => (
          <RadioCard
            id={item.id}
            key={item.id}
            title={item.title}
            content={item.time_slot}
            name="schedule"
            checked={item.type === 'primary'}
            withActionButtons={false}
            onChange={() =>
              dispatch({
                type: 'SET_PRIMARY_SCHEDULE',
                payload: item.id.toString(),
              })
            }
          />
        )}
      />
    </>
  );
};

export default Schedules;
