import { NextApiRequest, NextApiResponse } from 'next';
import { getSortedTestsData } from '../../lib/tests';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { repositoryId } = req.query;
  const testsData = await getSortedTestsData(Number(repositoryId));
  res.status(200).json(testsData);
};
