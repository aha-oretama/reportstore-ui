import React from 'react';
import Link from 'next/link';
import { useUser } from '../hooks/useUser';

export const Header: React.FunctionComponent = () => {
  const { user, loading } = useUser();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
          {!loading &&
            (user ? (
              <>
                <li>
                  <Link href="/profile">
                    <a>{user.name}</a>
                  </Link>
                </li>{' '}
                <li>
                  <a href="/api/logout">Logout</a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="/api/login">Login</a>
                </li>
              </>
            ))}
        </ul>
      </nav>
    </header>
  );
};
