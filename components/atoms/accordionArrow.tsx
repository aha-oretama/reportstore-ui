import React from 'react';

interface Props {
  expanded: boolean;
  disabled: boolean;
}

export const AccordionArrow: React.FunctionComponent<Props> = ({
  expanded,
  disabled,
}) => {
  if (disabled) {
    // To keep style, return empty span tag
    return <span className="m-2 block h-2 w-2 content" />;
  }

  return (
    <span
      className={`m-2 block h-2 w-2 border-b-2 border-r-2 border-solid border-gray-500 transform ${
        expanded ? 'rotate-45' : '-rotate-45'
      }`}
    />
  );
};
