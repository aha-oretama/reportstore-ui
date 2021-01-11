import styles from './layout.module.css';
import React from 'react';

export default function Header() {
  return (
    <header className={styles.header}>
      {/*{isAuthenticated ? (*/}
      {/*  <>*/}
      {/*    <img*/}
      {/*      src="/images/profile.jpg"*/}
      {/*      className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}*/}
      {/*      alt={user.name}*/}
      {/*    />*/}
      {/*    <h1 className={utilStyles.heading2Xl}>{user.name}</h1>*/}
      {/*  </>*/}
      {/*) : (*/}
      <>
        <a href="/api/login">Login</a>
      </>
      {/*)}*/}
    </header>
  );
}
