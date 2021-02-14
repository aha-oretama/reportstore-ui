import Layout from '../../../../components/layout';
import Head from 'next/head';
import { useTest } from '../../../../hooks/useTest';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Title } from '../../../../components/molecule/title';
import { UserProfile } from '../../../../hooks/useUser';
import { authServerSide } from '../../../../utils/auth0';
import { GetServerSideProps } from 'next';
import moment from 'moment';
import { TimeIcon } from '../../../../components/atoms/timeIcon';
import { StatusIcon } from '../../../../components/molecule/statusIcon';
import { Suite } from '../../../../models';
import Link from 'next/link';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemState,
} from 'react-accessible-accordion';
import { AccordionArrow } from '../../../../components/atoms/accordionArrow';
import ReactModal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface Props {
  user: UserProfile;
}

interface SuiteListProps {
  suites: Suite[];
  handler: (id: number, e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const SuiteList: React.FunctionComponent<SuiteListProps> = ({
  suites,
  handler,
}) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {suites.map((suite) => (
          <li key={suite.id}>
            <Link href="#">
              <a
                className="block hover:bg-blue-50"
                onClick={(e) => handler(suite.id, e)}
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="px-2 py-0.5 sm:px-6">
                      <p className="text-gray-700 truncate">{suite.name}</p>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm font-light text-gray-500 justify-between">
                            <time className="mr-2" dateTime="2020-01-07">
                              {moment(suite.timestamp).format()}
                            </time>
                            <div className="flex items-center">
                              <TimeIcon />
                              {suite.time}
                            </div>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex items-center">
                      <span className="mr-2">
                        {`${suite.tests - (suite.failures + suite.errors)}/${
                          suite.tests
                        }`}
                      </span>
                      <StatusIcon
                        failure={suite.errors > 0 || suite.failures > 0}
                        skipped={suite.skipped > 0}
                      />
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface SuiteInfoProps {
  suite: Suite | null;
}

const SuiteInfo: React.FunctionComponent<SuiteInfoProps> = ({ suite }) => {
  if (!suite) {
    return null;
  }

  return (
    <div className="px-4 py-4">
      <h2 className="text-2xl font-extrabold text-gray-700 tracking-tight">
        {suite.name}
      </h2>
      <Accordion allowMultipleExpanded={true}>
        {suite.testcases.map((testcase) => (
          <AccordionItem
            key={testcase.id}
            className="mt-4 border-gray-200 border-solid border-2 px-2 py-2"
          >
            <AccordionItemHeading aria-level={3}>
              <AccordionItemButton
                className={`flex justify-between items-center ${
                  !testcase.failure && !testcase.skipped
                    ? 'pointer-events-none'
                    : ''
                }`}
              >
                <span>{testcase.name}</span>
                <div className="flex items-center">
                  <span className="flex items-center px-4">
                    <TimeIcon />
                    {testcase.time}
                  </span>
                  <StatusIcon
                    failure={!!testcase.failure}
                    skipped={!!testcase.skipped}
                  />
                  <AccordionItemState>
                    {({ expanded }) => (
                      <AccordionArrow
                        expanded={expanded}
                        disabled={!testcase.failure && !testcase.skipped}
                      />
                    )}
                  </AccordionItemState>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="mt-4 border-gray-200 border-solid border-t-2 px-2 py-2 overflow-x-scroll">
              <p>{testcase.failure || testcase.skipped}</p>
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

const GetTestId: React.FunctionComponent<Props> = ({ user }) => {
  const router = useRouter();
  const { id } = router.query;
  const { testData, isLoading, isError } = useTest(id as string);
  const [targetSuite, setSuite] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const suiteHandler = (id: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSuite(testData.suites.find((suite) => suite.id === id));
    if (window.innerWidth <= 768) {
      // md
      setShowModal(true);
    }
  };

  // Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
  ReactModal.setAppElement('#__next');

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <Layout user={user}>
      <Head>
        <title>{testData.name}</title>
      </Head>
      <Title title={`${testData.name} ${testData.time}`} />
      <div className="divide-x divide-black md:flex md:justify-between">
        <div className="flex-shrink-0">
          <SuiteList handler={suiteHandler} suites={testData.suites} />
        </div>
        <div className="flex-grow invisible md:visible">
          <SuiteInfo suite={targetSuite} />
        </div>
        {/* Scrollable in modal, https://github.com/reactjs/react-modal/issues/283#issuecomment-391430385 */}
        <ReactModal
          isOpen={showModal}
          className="md:hidden overflow-y-auto max-h-screen bg-white"
        >
          <div className="w-4 m-4">
            <FontAwesomeIcon
              icon={faArrowLeft}
              fixedWidth={true}
              size="xs"
              onClick={() => setShowModal(false)}
            />
          </div>
          <SuiteInfo suite={targetSuite} />
        </ReactModal>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await authServerSide(context);
};

export default GetTestId;
