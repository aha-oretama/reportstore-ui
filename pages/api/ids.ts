import { NextApiRequest, NextApiResponse } from 'next';
import { getSortedTestsData } from '../../lib/tests';

export default (
  req: NextApiRequest,
  res: NextApiResponse<ReturnType<typeof getSortedTestsData>>
) => {
  res.status(200).json(getSortedTestsData());
};
