import { NextApiRequest, NextApiResponse } from 'next';
import { getSortedTestsData } from '../../lib/tests';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const testsData = await getSortedTestsData();
  res.status(200).json(testsData);
};
