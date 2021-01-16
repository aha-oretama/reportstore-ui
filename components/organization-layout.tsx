import { useOrganizations } from '../hooks/git/useOrganizations';
import { UserProfile } from '../hooks/useUser';
import React from 'react';

type Props = {
  user: UserProfile;
};

export const OrganizationLayout: React.FunctionComponent<Props> = ({
  user,
}) => {
  const { orgs, isLoading, isError } = useOrganizations(user.sub);

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <ul>
      {/*{orgs.map(org => {*/}
      {/*  <li key={org.name}>{org.name}</li>*/}
      {/*})}*/}
    </ul>
  );
};
