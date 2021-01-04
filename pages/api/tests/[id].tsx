import { NextApiRequest, NextApiResponse } from 'next';
import { getTestData } from '../../../lib/tests';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
  } = req;
  const testData = await getTestData(id);
  res.status(200).json(testData);
};
