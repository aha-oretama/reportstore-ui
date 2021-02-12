import React from 'react';

interface Props {
  title: string;
}

export const Title: React.FunctionComponent<Props> = ({ title }) => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
        {title}
      </h1>
      <hr />
    </div>
  );
};
