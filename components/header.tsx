import React from 'react';
import { useUser } from '../hooks/useUser';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const Header: React.FunctionComponent = () => {
  const { user, loading } = useUser();
  const router = useRouter();

  const handleLogoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push('/api/logout');
  };

  const handleMyIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(`/mypage`);
  };

  const handleSignInClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push('/api/login');
  };

  const handleSignUpClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push('/api/login');
  };

  return (
    <header>
      <nav className="w-full z-30 top-10 py-1 bg-white shadow-lg border-b border-blue-400">
        <div className="w-full flex items-center justify-between mt-0 px-6 py-2">
          <label
            htmlFor="menu-toggle"
            className="cursor-pointer md:hidden block"
          >
            <svg
              className="fill-current text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
            >
              <title>menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </label>
          <input className="hidden" type="checkbox" id="menu-toggle" />
          <div
            className="hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1"
            id="menu"
          >
            <nav>
              <ul className="md:flex items-center justify-between text-base text-blue-600 pt-4 md:pt-0">
                <li>
                  <Link href="/price">
                    <a className="inline-block no-underline hover:text-black font-medium text-lg py-2 px-4 lg:-ml-2">
                      Pricing
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/docs">
                    <a className="inline-block no-underline hover:text-black font-medium text-lg py-2 px-4 lg:-ml-2">
                      Docs
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/company">
                    <a className="inline-block no-underline hover:text-black font-medium text-lg py-2 px-4 lg:-ml-2">
                      Company
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {!loading && user ? (
            <div
              className="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4"
              id="nav-content"
            >
              {/* TODO: We will remove logout button from header */}
              <button
                onClick={handleLogoutClick}
                className="bg-transparent text-gray-800  p-2 rounded border border-gray-300 mr-4 hover:bg-gray-100 hover:text-gray-700"
              >
                Logout
              </button>
              <Link href="/gh">
                <a className="inline-block no-underline text-blue-600 hover:text-black font-medium text-lg py-2 px-4 lg:-ml-2">
                  Go to App
                </a>
              </Link>
              <button
                onClick={handleMyIconClick}
                className="items-center space-x-4"
              >
                <img
                  src={user.picture}
                  alt="My profile icon"
                  className="w-12 h-12 rounded-full"
                />
              </button>
            </div>
          ) : (
            <div
              className="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4"
              id="nav-content"
            >
              <div className="auth flex items-center w-full md:w-full">
                <button
                  onClick={handleSignInClick}
                  className="bg-transparent text-gray-800  p-2 rounded border border-gray-300 mr-4 hover:bg-gray-100 hover:text-gray-700"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignUpClick}
                  className="bg-blue-600 text-gray-200  p-2 rounded  hover:bg-blue-500 hover:text-gray-100"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
