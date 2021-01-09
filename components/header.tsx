import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function Header() {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <header className={styles.header}>
      {isAuthenticated ? (
        <>
          <img
            src="/images/profile.jpg"
            className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
            alt={user.name}
          />
          <h1 className={utilStyles.heading2Xl}>{user.name}</h1>
        </>
      ) : (
        <>
          <button onClick={() => loginWithRedirect()}>Log in</button>
        </>
      )}
    </header>
  );
}
