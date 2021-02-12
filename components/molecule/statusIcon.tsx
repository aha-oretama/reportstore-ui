import React from 'react';

interface Props {
  failure?: boolean;
  skipped?: boolean;
}

export const StatusIcon: React.FunctionComponent<Props> = ({
  failure = false,
  skipped = false,
}) => {
  const getStatusIcon = (
    message: string,
    color: 'red' | 'green' | 'yellow'
  ) => {
    return (
      <p
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${color}-100 text-${color}-800`}
      >
        {message}
      </p>
    );
  };

  if (failure) {
    return getStatusIcon('Failure', 'red');
  }
  if (skipped) {
    return getStatusIcon('Skipped', 'yellow');
  }
  return getStatusIcon('Success', 'green');
};
